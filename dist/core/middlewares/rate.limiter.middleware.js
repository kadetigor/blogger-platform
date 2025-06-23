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
        if (now > record.resetTime) {
            this.attempts.delete(ip);
            return true;
        }
        return record.count < this.maxAttempts;
    }
    recordAttempt(ip) {
        const now = Date.now();
        const record = this.attempts.get(ip);
        if (!record || now > record.resetTime) {
            this.attempts.set(ip, {
                count: 1,
                resetTime: now + this.windowMs
            });
        }
        else {
            record.count++;
            this.attempts.set(ip, record);
        }
    }
    cleanup() {
        const now = Date.now();
        for (const [ip, record] of this.attempts.entries()) {
            if (now > record.resetTime) {
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
        if (!rateLimiter.isAllowed(ip)) {
            res.status(429).send();
            return;
        }
        rateLimiter.recordAttempt(ip);
        next();
    };
}
