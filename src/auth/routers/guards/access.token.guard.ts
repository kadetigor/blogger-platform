import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../adapters/jwt.service';

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  // Split into ["Bearer", "<token>"]
  const [authType, token] = authHeader.split(' ');
  if (authType !== 'Bearer' || !token) {
    res.sendStatus(401);
    return;
  }

  try {
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
      res.sendStatus(401);
      return;
    }

    // Attach user ID to req.user
    req.user = { 
      id: payload.userId,
      login: payload.userLogin,
    };

    next();
    return;
  } catch (err) {
    // Any verify error → 401
    res.sendStatus(401);
    return;
  }
};
