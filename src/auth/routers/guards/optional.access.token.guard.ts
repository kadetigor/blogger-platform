// src/auth/routers/guards/optional.access.token.guard.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../adapters/jwt.adapter';

const jwtService = new JwtService();

export const optionalAccessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  // If no auth header, continue without setting user
  if (!authHeader) {
    next();
    return;
  }

  // Split into ["Bearer", "<token>"]
  const [authType, token] = authHeader.split(' ');
  if (authType !== 'Bearer' || !token) {
    next();
    return;
  }

  try {
    const payload = await jwtService.verifyToken(token);
    if (payload) {
      // Attach user ID to req.user
      req.user = { 
        id: payload.userId,
        login: payload.userLogin,
      };
    }
  } catch (err) {
    // If token is invalid, just continue without user
  }

  next();
};