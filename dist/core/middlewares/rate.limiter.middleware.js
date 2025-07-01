"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
exports.createRateLimitMiddleware = createRateLimitMiddleware;
class RateLimiter {
    constructor(maxAttempts, windowMs) {
        this.attempts = new Map();
        this.debugLog = [];
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }
    addDebugLog(action, ip, details) {
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
    getDebugInfo() {
        const now = Date.now();
        const attempts = {};
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
            recentLogs: this.debugLog.slice(-20).map(log => (Object.assign(Object.assign({}, log), { timestampFormatted: new Date(log.timestamp).toISOString() })))
        };
    }
    shouldAllowRequest(ip) {
        const now = Date.now();
        const record = this.attempts.get(ip);
        if (!record) {
            this.addDebugLog('shouldAllowRequest', ip, { result: true, reason: 'no record' });
            return true;
        }
        // If the window has expired, delete the old record and allow the request
        if (now >= record.resetTime) {
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
    recordAttempt(ip) {
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
        }
        else {
            // Increment existing record
            record.count++;
            this.attempts.set(ip, record);
            this.addDebugLog('recordAttempt', ip, {
                action: 'incremented',
                newCount: record.count
            });
        }
    }
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
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
                oldCount: record === null || record === void 0 ? void 0 : record.count
            });
        });
    }
    // Clear all attempts (useful for testing)
    clear() {
        this.attempts.clear();
        this.debugLog = [];
    }
    // Force cleanup for a specific IP (useful for testing)
    forceCleanup(ip) {
        const record = this.attempts.get(ip);
        if (record && Date.now() >= record.resetTime) {
            this.attempts.delete(ip);
            this.addDebugLog('forceCleanup', ip, {
                action: 'deleted in force cleanup',
                oldCount: record === null || record === void 0 ? void 0 : record.count
            });
        }
    }
}
exports.RateLimiter = RateLimiter;
function createRateLimitMiddleware(maxAttempts, windowMs) {
    const rateLimiter = new RateLimiter(maxAttempts, windowMs);
    // Clean up expired records periodically
    const cleanupInterval = setInterval(() => {
        rateLimiter.cleanup();
    }, 500); // Run cleanup every 500ms for more responsive cleanup
    // Clear interval on process exit
    process.on('SIGINT', () => clearInterval(cleanupInterval));
    process.on('SIGTERM', () => clearInterval(cleanupInterval));
    // Store rate limiter instance for debug access
    global.__rateLimiter = rateLimiter;
    return (req, res, next) => {
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
        // CRITICAL: Force cleanup for this IP before checking if request is allowed
        rateLimiter.forceCleanup(ip);
        // Check if request should be allowed
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
        let statusCode;
        let attemptRecorded = false;
        // Override status method to capture status code
        res.status = function (code) {
            statusCode = code;
            return originalStatus.call(this, code);
        };
        // Helper function to determine if we should count this attempt
        const shouldCountAttempt = () => {
            const isRegistrationEndpoint = req.path.includes('/registration');
            if (isRegistrationEndpoint) {
                // Always count registration attempts
                return true;
            }
            else {
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
        const wrapResponseMethod = (originalMethod) => {
            return function (...args) {
                handleRateLimiting();
                return originalMethod.apply(this, args);
            };
        };
        res.send = wrapResponseMethod(originalSend);
        res.json = wrapResponseMethod(originalJson);
        res.sendStatus = function (code) {
            statusCode = code;
            handleRateLimiting();
            return originalSendStatus.call(this, code);
        };
        res.end = wrapResponseMethod(originalEnd);
        next();
    };
}
