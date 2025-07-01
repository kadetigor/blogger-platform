"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
exports.createRateLimitMiddleware = createRateLimitMiddleware;
class RateLimiter {
    constructor(maxAttempts, windowMs) {
        this.attempts = new Map();
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }
    isAllowed(ip) {
        const now = Date.now();
        const record = this.attempts.get(ip);
        if (!record) {
            return true;
        }
        // If the window has expired, delete the record and allow the request
        if (now >= record.resetTime) {
            this.attempts.delete(ip);
            return true;
        }
        // Check if we've exceeded the limit
        return record.count < this.maxAttempts;
    }
    recordAttempt(ip) {
        const now = Date.now();
        const record = this.attempts.get(ip);
        if (!record || now >= record.resetTime) {
            // Create new record or reset if window expired
            this.attempts.set(ip, {
                count: 1,
                resetTime: now + this.windowMs
            });
        }
        else {
            // Increment existing record
            record.count++;
        }
    }
    cleanup() {
        const now = Date.now();
        for (const [ip, record] of this.attempts.entries()) {
            if (now >= record.resetTime) {
                this.attempts.delete(ip);
            }
        }
    }
}
exports.RateLimiter = RateLimiter;
function createRateLimitMiddleware(maxAttempts, windowMs) {
    const rateLimiter = new RateLimiter(maxAttempts, windowMs);
    // Clean up expired records periodically
    const cleanupInterval = setInterval(() => {
        rateLimiter.cleanup();
    }, windowMs);
    // Clear interval on process exit
    process.on('SIGINT', () => clearInterval(cleanupInterval));
    process.on('SIGTERM', () => clearInterval(cleanupInterval));
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        // Store original response methods
        const originalSend = res.send;
        const originalJson = res.json;
        const originalSendStatus = res.sendStatus;
        const originalEnd = res.end;
        const originalStatus = res.status;
        let statusCode;
        let hasResponded = false;
        // Override status method to capture status code
        res.status = function (code) {
            statusCode = code;
            return originalStatus.call(this, code);
        };
        // Helper function to record attempt if needed
        const checkAndRecordAttempt = () => {
            if (!hasResponded) {
                hasResponded = true;
                // For registration endpoints, count ALL attempts
                const isRegistrationEndpoint = req.path.includes('/registration');
                if (isRegistrationEndpoint) {
                    // Always count registration attempts
                    rateLimiter.recordAttempt(ip);
                }
                else {
                    // For other endpoints (like /login), only count client errors (4xx)
                    if (statusCode && statusCode >= 400 && statusCode < 500) {
                        rateLimiter.recordAttempt(ip);
                    }
                }
            }
        };
        // Check if request should be blocked AFTER recording any previous attempts
        if (!rateLimiter.isAllowed(ip)) {
            res.status(429).send();
            return;
        }
        // Override response methods to check status before sending
        res.send = function (data) {
            checkAndRecordAttempt();
            return originalSend.call(this, data);
        };
        res.json = function (data) {
            checkAndRecordAttempt();
            return originalJson.call(this, data);
        };
        res.sendStatus = function (code) {
            statusCode = code;
            checkAndRecordAttempt();
            return originalSendStatus.call(this, code);
        };
        res.end = function (chunk, encoding) {
            checkAndRecordAttempt();
            return originalEnd.call(this, chunk, encoding);
        };
        next();
    };
}
