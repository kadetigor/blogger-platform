import { Request, Response, NextFunction } from 'express';

interface AttemptRecord {
    count: number;
    resetTime: number;
}

class RateLimiter {
    public attempts: Map<string, AttemptRecord> = new Map();
    private maxAttempts: number;
    private windowMs: number;

    constructor(maxAttempts: number, windowMs: number) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    shouldAllowRequest(ip: string): boolean {
        const now = Date.now();
        const record = this.attempts.get(ip);

        if (!record) {
            return true;
        }

        // If the window has expired, delete the old record and allow the request
        if (now >= record.resetTime) {
            this.attempts.delete(ip);
            return true;
        }

        // Check if we've exceeded the limit
        return record.count < this.maxAttempts;
    }

    recordAttempt(ip: string): void {
        const now = Date.now();
        const record = this.attempts.get(ip);

        if (!record || now >= record.resetTime) {
            // Create new record or reset if window expired
            this.attempts.set(ip, {
                count: 1,
                resetTime: now + this.windowMs
            });
        } else {
            // Increment existing record
            record.count++;
        }
    }

    cleanup(): void {
        const now = Date.now();
        for (const [ip, record] of this.attempts.entries()) {
            if (now >= record.resetTime) {
                this.attempts.delete(ip);
            }
        }
    }
}

export function createRateLimitMiddleware(maxAttempts: number, windowMs: number) {
    const rateLimiter = new RateLimiter(maxAttempts, windowMs);

    // Clean up expired records periodically
    const cleanupInterval = setInterval(() => {
        rateLimiter.cleanup();
    }, windowMs);

    // Clear interval on process exit
    process.on('SIGINT', () => clearInterval(cleanupInterval));
    process.on('SIGTERM', () => clearInterval(cleanupInterval));

    return (req: Request, res: Response, next: NextFunction): void => {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

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
                
                // First record the attempt
                rateLimiter.recordAttempt(ip);
                
                // Then check if we should block future requests
                if (!rateLimiter.shouldAllowRequest(ip)) {
                    // The NEXT request will be blocked, not this one
                    // This is intentional - we count the attempt that puts us over the limit
                }
            }
        };

        // Check if this request should be blocked (before we process it)
        if (!rateLimiter.shouldAllowRequest(ip)) {
            res.status(429).send();
            return;
        }

        // Override response methods to record attempts when appropriate
        res.send = function(data?: any) {
            handleRateLimiting();
            return originalSend.call(this, data);
        };

        res.json = function(data: any) {
            handleRateLimiting();
            return originalJson.call(this, data);
        };

        res.sendStatus = function(code: number) {
            statusCode = code;
            handleRateLimiting();
            return originalSendStatus.call(this, code);
        };

        res.end = function(chunk?: any, encoding?: any) {
            handleRateLimiting();
            return originalEnd.call(this, chunk, encoding);
        };

        next();
    };
}

// Export for direct usage if needed
export { RateLimiter };