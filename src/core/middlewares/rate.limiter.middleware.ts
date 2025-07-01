import { Request, Response, NextFunction } from 'express';

interface AttemptRecord {
    count: number;
    resetTime: number;
}

class RateLimiter {
    public attempts: Map<string, AttemptRecord> = new Map();
    private maxAttempts: number;
    private windowMs: number;
    private debugLog: Array<{timestamp: number, action: string, ip: string, details: any}> = [];

    constructor(maxAttempts: number, windowMs: number) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    private addDebugLog(action: string, ip: string, details: any) {
        this.debugLog.push({
            timestamp: Date.now(),
            action,
            ip,
            details
        });
        // Keep only last 100 entries
        if (this.debugLog.length > 100) {
            this.debugLog.shift();
        }
    }

    getDebugInfo(): any {
        const now = Date.now();
        const attempts: any = {};
        
        for (const [ip, record] of this.attempts.entries()) {
            attempts[ip] = {
                count: record.count,
                resetTime: new Date(record.resetTime).toISOString(),
                resetTimeMs: record.resetTime,
                timeUntilReset: Math.max(0, record.resetTime - now),
                timeUntilResetSeconds: Math.max(0, (record.resetTime - now) / 1000),
                isExpired: now >= record.resetTime,
                timeSinceCreated: now - (record.resetTime - this.windowMs)
            };
        }
        
        return {
            currentTime: new Date(now).toISOString(),
            currentTimeMs: now,
            windowMs: this.windowMs,
            maxAttempts: this.maxAttempts,
            attempts,
            recentLogs: this.debugLog.slice(-20).map(log => ({
                ...log,
                timestampFormatted: new Date(log.timestamp).toISOString()
            }))
        };
    }

    shouldAllowRequest(ip: string): boolean {
        const now = Date.now();
        const record = this.attempts.get(ip);

        if (!record) {
            this.addDebugLog('shouldAllowRequest', ip, { result: true, reason: 'no record' });
            return true;
        }

        // If the window has expired, delete the old record and allow the request
        // Add a 50ms buffer to account for timing precision issues
        if (now >= record.resetTime - 50) {
            this.attempts.delete(ip);
            this.addDebugLog('shouldAllowRequest', ip, { 
                result: true, 
                reason: 'expired', 
                oldCount: record.count,
                expiredAt: new Date(record.resetTime).toISOString(),
                now: new Date(now).toISOString(),
                timeDiff: now - record.resetTime
            });
            return true;
        }

        // Check if we've exceeded the limit
        const allowed = record.count < this.maxAttempts;
        this.addDebugLog('shouldAllowRequest', ip, { 
            result: allowed, 
            currentCount: record.count, 
            maxAttempts: this.maxAttempts,
            timeUntilReset: record.resetTime - now,
            resetTime: new Date(record.resetTime).toISOString()
        });
        return allowed;
    }

    recordAttempt(ip: string): void {
        const now = Date.now();
        let record = this.attempts.get(ip);

        // Clean up expired record if it exists
        if (record && now >= record.resetTime) {
            this.attempts.delete(ip);
            this.addDebugLog('recordAttempt', ip, { 
                action: 'deleted expired', 
                oldCount: record.count 
            });
            record = undefined;
        }

        if (!record) {
            // Create new record
            const newRecord = {
                count: 1,
                resetTime: now + this.windowMs
            };
            this.attempts.set(ip, newRecord);
            this.addDebugLog('recordAttempt', ip, { 
                action: 'created new', 
                resetTime: new Date(newRecord.resetTime).toISOString() 
            });
        } else {
            // Increment existing record
            record.count++;
            this.attempts.set(ip, record);
            this.addDebugLog('recordAttempt', ip, { 
                action: 'incremented', 
                newCount: record.count 
            });
        }
    }

    cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];
        
        for (const [ip, record] of this.attempts.entries()) {
            if (now >= record.resetTime) {
                keysToDelete.push(ip);
            }
        }
        
        // Delete expired entries
        keysToDelete.forEach(key => {
            const record = this.attempts.get(key);
            this.attempts.delete(key);
            this.addDebugLog('cleanup', key, { 
                action: 'deleted in cleanup', 
                oldCount: record?.count 
            });
        });
    }

    // Clear all attempts (useful for testing)
    clear(): void {
        this.attempts.clear();
        this.debugLog = [];
    }
}

export function createRateLimitMiddleware(maxAttempts: number, windowMs: number) {
    const rateLimiter = new RateLimiter(maxAttempts, windowMs);

    // Clean up expired records periodically
    const cleanupInterval = setInterval(() => {
        rateLimiter.cleanup();
    }, 1000); // Run cleanup every second for more responsive cleanup

    // Clear interval on process exit
    process.on('SIGINT', () => clearInterval(cleanupInterval));
    process.on('SIGTERM', () => clearInterval(cleanupInterval));

    // Store rate limiter instance for debug access
    (global as any).__rateLimiter = rateLimiter;

    return (req: Request, res: Response, next: NextFunction): void => {
        // Debug endpoint
        if (req.path === '/debug/rate-limit' && req.method === 'GET') {
            res.json(rateLimiter.getDebugInfo());
            return;
        }

        // Get IP address - handle various formats
        let ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        
        // Handle IPv6 localhost format
        if (ip === '::1' || ip === '::ffff:127.0.0.1') {
            ip = '127.0.0.1';
        }

        // CRITICAL: Check and clean up expired records before deciding to block
        if (!rateLimiter.shouldAllowRequest(ip)) {
            res.status(429).send();
            return;
        }

        // Store original response methods
        const originalSend = res.send;
        const originalJson = res.json;
        const originalSendStatus = res.sendStatus;
        const originalEnd = res.end;
        const originalStatus = res.status;
        
        let statusCode: number | undefined;
        let attemptRecorded = false;

        // Override status method to capture status code
        res.status = function(code: number) {
            statusCode = code;
            return originalStatus.call(this, code);
        };

        // Helper function to determine if we should count this attempt
        const shouldCountAttempt = (): boolean => {
            const isRegistrationEndpoint = req.path.includes('/registration');
            
            if (isRegistrationEndpoint) {
                // Always count registration attempts
                return true;
            } else {
                // For other endpoints (like /login), only count client errors (4xx)
                return statusCode !== undefined && statusCode >= 400 && statusCode < 500;
            }
        };

        // Helper function to handle rate limiting
        const handleRateLimiting = () => {
            if (!attemptRecorded && shouldCountAttempt()) {
                attemptRecorded = true;
                
                // Record the attempt AFTER we know the response status
                rateLimiter.recordAttempt(ip);
            }
        };

        // Override response methods to record attempts when appropriate
        const wrapResponseMethod = (originalMethod: Function) => {
            return function(this: Response, ...args: any[]) {
                handleRateLimiting();
                return originalMethod.apply(this, args);
            };
        };

        res.send = wrapResponseMethod(originalSend);
        res.json = wrapResponseMethod(originalJson);
        res.sendStatus = function(code: number) {
            statusCode = code;
            handleRateLimiting();
            return originalSendStatus.call(this, code);
        };
        res.end = wrapResponseMethod(originalEnd);

        next();
    };
}

// Export for direct usage if needed
export { RateLimiter };