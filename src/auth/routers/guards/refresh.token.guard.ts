import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../adapters/jwt.adapter';
import { AuthService } from '../../application/auth.service';
import { RefreshTokenSessionsRepository } from '../../repositories/refresh.token.sessions.repository';
import { BcryptService } from '../../adapters/bcrypt.adapter';
import { SecurityDevicesService } from '../../devices/security-devices.service';
import { UsersRepository } from '../../../users/repositories/usersRepository';
import { SecurityDeviceRepository } from '../../devices/security-device.repository';

const jwtService = new JwtService();
const refreshTokenSessionsRepository = new RefreshTokenSessionsRepository();
const bcryptService = new BcryptService();
const usersRepository = new UsersRepository();
const securityDeviceRepository = new SecurityDeviceRepository();

const securityDevicesService = new SecurityDevicesService(securityDeviceRepository);

const authService = new AuthService(
  jwtService,
  refreshTokenSessionsRepository,
  bcryptService,
  securityDevicesService,
  usersRepository
)

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

    (req as any).userId = payload.userId;
    (req as any).deviceId = payload.deviceId;

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