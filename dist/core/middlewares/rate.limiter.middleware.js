"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
exports.createRateLimitMiddleware = createRateLimitMiddleware;
const httpStatus_1 = require("../types/httpStatus");
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
}
exports.RateLimiter = RateLimiter;
function createRateLimitMiddleware(maxAttempts, windowMs) {
    const rateLimiter = new RateLimiter(maxAttempts, windowMs);
    return (req, res, next) => {
        const ip = req.ip;
        if (!ip) {
            res.status(httpStatus_1.HttpStatus.InternalServerError).send();
            return;
        }
        if (!rateLimiter.isAllowed(ip)) {
            res.status(429).send();
            return;
        }
        rateLimiter.recordAttempt(ip);
        next();
    };
}
