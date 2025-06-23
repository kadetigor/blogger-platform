
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

          if (!rateLimiter.isAllowed(ip)) {
              res.status(429).send();
              return;
          }

          rateLimiter.recordAttempt(ip);
          next();
      };
  }

// Export for direct usage if needed
export { RateLimiter };