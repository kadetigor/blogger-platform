"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimitMiddleware = createRateLimitMiddleware;
function createRateLimitMiddleware(maxAttempts, windowMs) {
    // Map structure: "ip:endpoint" -> RateLimitRecord
    const attempts = new Map();
    // Clean up old records periodically
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of attempts.entries()) {
            if (now - record.firstAttemptTime >= windowMs) {
                attempts.delete(key);
            }
        }
    }, windowMs / 2);
    return (req, res, next) => {
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
        // Set up response interceptor to count attempts
        const originalSend = res.send;
        const originalJson = res.json;
        const originalSendStatus = res.sendStatus;
        const originalEnd = res.end;
        let responseHandled = false;
        const handleResponse = () => {
            if (responseHandled)
                return;
            responseHandled = true;
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
                }
                else {
                    record.count++;
                }
            }
        };
        // Check if we should block this request
        // We block if there's an existing record AND it has reached the limit
        if (record && record.count >= maxAttempts) {
            res.status(429).send();
            return;
        }
        // Intercept all response methods
        res.send = function (body) {
            handleResponse();
            return originalSend.call(this, body);
        };
        res.json = function (body) {
            handleResponse();
            return originalJson.call(this, body);
        };
        res.sendStatus = function (code) {
            res.statusCode = code;
            handleResponse();
            return originalSendStatus.call(this, code);
        };
        res.end = function (...args) {
            handleResponse();
            // @ts-ignore - Express end() has multiple overloads
            return originalEnd.apply(this, args);
        };
        next();
    };
}
