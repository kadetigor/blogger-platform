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

    isAllowed(ip: string): boolean {
        const now = Date.now();
        const record = this.attempts.get(ip);

        if (!record) {
            return true;
        }

        if (now > record.resetTime) {
            this.attempts.delete(ip);
            return true;
        }

        return record.count < this.maxAttempts;
    }

    recordAttempt(ip: string): void {
        const now = Date.now();
        const record = this.attempts.get(ip);

        if (!record || now > record.resetTime) {
            this.attempts.set(ip, {
                count: 1,
                resetTime: now + this.windowMs
            });
        } else {
            record.count++;
            this.attempts.set(ip, record);
        }
    }

    cleanup(): void {
        const now = Date.now();
        for (const [ip, record] of this.attempts.entries()) {
            if (now > record.resetTime) {
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

        // Check if request should be blocked
        if (!rateLimiter.isAllowed(ip)) {
            res.status(429).send();
            return;
        }

        // Store original response methods
        const originalSend = res.send;
        const originalJson = res.json;
        const originalSendStatus = res.sendStatus;
        const originalEnd = res.end;
        
        let statusCode: number | undefined;
        let hasResponded = false;

        // Override status method to capture status code
        const originalStatus = res.status;
        res.status = function(code: number) {
            statusCode = code;
            return originalStatus.call(this, code);
        };

        // Helper function to record attempt if needed
        const checkAndRecordAttempt = () => {
            if (!hasResponded) {
                // For registration endpoints, count ALL attempts (including successful ones)
                const isRegistrationEndpoint = req.path.includes('/registration');
                
                if (isRegistrationEndpoint) {
                    // Count all registration attempts
                    rateLimiter.recordAttempt(ip);
                } else {
                    // For other endpoints, only count 4xx errors
                    if (statusCode && statusCode >= 400 && statusCode < 500) {
                        rateLimiter.recordAttempt(ip);
                    }
                }
            }
            hasResponded = true;
        };

        // Override response methods to check status before sending
        res.send = function(data?: any) {
            checkAndRecordAttempt();
            return originalSend.call(this, data);
        };

        res.json = function(data: any) {
            checkAndRecordAttempt();
            return originalJson.call(this, data);
        };

        res.sendStatus = function(code: number) {
            statusCode = code;
            checkAndRecordAttempt();
            return originalSendStatus.call(this, code);
        };

        res.end = function(chunk?: any, encoding?: any) {
            checkAndRecordAttempt();
            return originalEnd.call(this, chunk, encoding);
        };

        next();
    };
}

// Export for direct usage if needed
export { RateLimiter };