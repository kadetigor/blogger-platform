import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
    count: number;
    firstAttemptTime: number;
}

export function createRateLimitMiddleware(maxAttempts: number, windowMs: number) {
    // Map structure: "ip:endpoint" -> RateLimitRecord
    const attempts = new Map<string, RateLimitRecord>();

    // Clean up old records periodically
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of attempts.entries()) {
            if (now - record.firstAttemptTime >= windowMs) {
                attempts.delete(key);
            }
        }
    }, windowMs / 2);

    return (req: Request, res: Response, next: NextFunction): void => {
        // Get IP address
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        const endpoint = req.path; // Track by endpoint
        const key = `${ip}:${endpoint}`; // Unique key per IP and endpoint
        const now = Date.now();

        // Get or create record for this IP:endpoint combination
        let record = attempts.get(key);

        // If record exists, check if window has expired
        if (record && (now - record.firstAttemptTime) >= windowMs) {
            // Window expired, delete the record
            attempts.delete(key);
            record = undefined;
        }

        // Check if we should block this request BEFORE processing
        // We count the attempt first for password-recovery endpoint
        if (req.path === '/password-recovery' || req.path === '/new-password') {
            // For password-recovery and new-password, count the attempt immediately
            if (!record) {
                record = {
                    count: 1,
                    firstAttemptTime: now
                };
                attempts.set(key, record);
            } else {
                record.count++;
            }

            // Check if limit exceeded
            if (record.count > maxAttempts) {
                res.status(429).send();
                return;
            }
        }

        // Set up response interceptor to count attempts for other endpoints
        const originalSend = res.send;
        const originalJson = res.json;
        const originalSendStatus = res.sendStatus;
        const originalEnd = res.end;
        let responseHandled = false;

        const handleResponse = () => {
            if (responseHandled) return;
            responseHandled = true;

            // Skip if already counted (password-recovery endpoints)
            if (req.path === '/password-recovery' || req.path === '/new-password') {
                return;
            }

            // Determine if we should count this attempt
            const statusCode = res.statusCode;
            const isRegistrationEndpoint = req.path.includes('/registration');
            
            const shouldCount = isRegistrationEndpoint || (statusCode >= 400 && statusCode < 500);
            
            if (shouldCount) {
                // Create record if it doesn't exist
                if (!record) {
                    record = {
                        count: 1,
                        firstAttemptTime: now
                    };
                    attempts.set(key, record);
                } else {
                    record.count++;
                }
            }
        };

        // Check if we should block this request (for non-password-recovery endpoints)
        if (req.path !== '/password-recovery' && req.path !== '/new-password' && record && record.count >= maxAttempts) {
            res.status(429).send();
            return;
        }

        // Intercept all response methods
        res.send = function(body?: any) {
            handleResponse();
            return originalSend.call(this, body);
        };

        res.json = function(body?: any) {
            handleResponse();
            return originalJson.call(this, body);
        };

        res.sendStatus = function(code: number) {
            handleResponse();
            return originalSendStatus.call(this, code);
        };

        const wrapResponseMethod = (originalMethod: Function) => {
            return function(this: Response, ...args: any[]) {
                handleResponse();
                return originalMethod.apply(this, args);
            };
        };

        res.end = wrapResponseMethod(originalEnd);


        next();
    };
}