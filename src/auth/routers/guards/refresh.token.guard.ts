import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../adapters/jwt.adapter';
import { authService } from '../../application/auth.service';

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  try {
    // Верифицируем refresh токен
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      res.sendStatus(401);
      return;
    }

    // Проверяем валидность сессии в БД
    const sessionValidation = await authService.validateRefreshSession(payload.tokenId);
    if (!sessionValidation.isValid) {
      res.sendStatus(401);
      return;
    }

    // Attach user info to request
    req.user = { 
      id: payload.userId,
      login: '', // Можно получить из БД если нужно
    };

    next();
    return;
  } catch (err) {
    res.sendStatus(401);
    return;
  }
};