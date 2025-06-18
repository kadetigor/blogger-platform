import { WithId } from 'mongodb';
import { jwtService } from '../adapters/jwt.adapter';
import { bcryptService } from '../adapters/bcrypt.adapter';
import { HttpStatus } from '../../core/types/httpStatus';
import { Result } from '../../core/result/result.type';
import { usersRepository } from '../../users/repositories/usersRepository';
import { emailManager } from '../../email/managers/email.manager';
import { v4 as uuid } from 'uuid';
import { UserWithConfirmation } from '../../email/user.with.confirmation.type';
import { RefreshTokenSession } from "../domain/refresh.token.session";
import { refreshTokenSessionsRepository } from "../repositories/refresh.token.sessions.repository";
import { add, addMilliseconds, addMinutes } from 'date-fns'
import { SETTINGS } from '../../core/settings/settings';
import { SessionValidationResult } from '../types/refresh.token.types';

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== HttpStatus.Ok)
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };
    
    const userId = result.data!._id.toString()

    const accessToken = await jwtService.createToken(userId, result.data!.login);

    const tokenId = await this.createRefreshSession(userId)

    const refreshToken = await jwtService.createRefreshToken(userId, tokenId)

    return {
      status: HttpStatus.Ok,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<UserWithConfirmation> | null>> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user)
      return {
        status: HttpStatus.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      };

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
    if (!isPassCorrect)
      return {
        status: HttpStatus.BadRequest,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      };

    // Check if user is confirmed before allowing login
    if (!user.emailConfirmation?.isConfirmed) {
      return {
        status: HttpStatus.Unauthorized,
        data: null,
        errorMessage: 'Email not confirmed',
        extensions: [{ field: 'loginOrEmail', message: 'Please confirm your email before logging in' }],
      };
    }

    return {
      status: HttpStatus.Ok,
      data: user,
      extensions: [],
    };
  },

  async registerUser(
    login: string,
    email: string,
    password: string
  ): Promise<Result<{ confirmationCode: string } | null>> {
    // Check if user with this login already exists
    const existingUserByLogin = await usersRepository.findByLoginOrEmail(login);
    if (existingUserByLogin) {
      return {
        status: HttpStatus.BadRequest,
        data: null,
        errorMessage: 'User already exists',
        extensions: [{ field: 'login', message: 'User with this login already exists' }],
      };
    }

    // Check if user with this email already exists  
    const existingUserByEmail = await usersRepository.findByLoginOrEmail(email);
    if (existingUserByEmail) {
      return {
        status: HttpStatus.BadRequest,
        data: null,
        errorMessage: 'User already exists',
        extensions: [{ field: 'email', message: 'User with this email already exists' }],
      };
    }

    const passwordHash = await bcryptService.generateHash(password);
    const confirmationCode = uuid();

    const user: UserWithConfirmation = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: confirmationCode,
        isConfirmed: false
      }
    };

    await usersRepository.create(user);
    
    // Try to send email, but don't fail if it doesn't work
    try {
      await emailManager.sendEmailConfimationMessage(user);
    } catch (error) {
      console.log('Email sending failed, but registration continues:', error);
    }

    return {
      status: HttpStatus.NoContent,
      data: { confirmationCode },
      errorMessage: '',
      extensions: [],
    };
  },

  async confirmEmail(code: string): Promise<boolean> {
    try {
        const user = await usersRepository.findByConfirmationCode(code);
        
        if (user.emailConfirmation.isConfirmed) {
            return false; // Already confirmed
        }
        
        const result = await usersRepository.updateConfirmation(user._id);
        return result;
    } catch (error) {
        return false; // User not found or other error
    }
  },

  async resendConfirmationEmail(email: string): Promise<Result<null>> {
    const user = await usersRepository.findByLoginOrEmail(email);
    
    if (!user) {
        return {
            status: HttpStatus.BadRequest,
            data: null,
            errorMessage: 'User not found',
            extensions: [{ field: 'email', message: 'User with this email does not exist' }],
        };
    }

    // Check if user is already confirmed - this is the fix for the failing test
    if (user.emailConfirmation?.isConfirmed) {
        return {
            status: HttpStatus.BadRequest,
            data: null,
            errorMessage: 'Email already confirmed',
            extensions: [{ field: 'email', message: 'Email is already confirmed' }],
        };
    }

    // Generate new confirmation code
    const newConfirmationCode = uuid();
    
    // Update user with new confirmation code
    await usersRepository.updateConfirmationCode(user._id, newConfirmationCode);
    
    // Try to send email with new code
    try {
      const updatedUser = { ...user, emailConfirmation: { ...user.emailConfirmation, confirmationCode: newConfirmationCode } };
      await emailManager.sendEmailConfimationMessage(updatedUser);
    } catch (error) {
      console.log('Email sending failed, but code update continues:', error);
    }

    return {
        status: HttpStatus.NoContent,
        data: null,
        errorMessage: '',
        extensions: [],
    };
  },
  // Новые методы для auth flow
  async refreshTokens(oldRefreshToken: string): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
  try {
    // 1. Верифицировать старый refresh токен
    const payload = await jwtService.verifyRefreshToken(oldRefreshToken);
    if (!payload) {
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Invalid refresh token',
        extensions: [{ field: 'refreshToken', message: 'Invalid token' }],
        data: null,
      };
    }

    // 2. Валидировать сессию в БД
    const sessionValidation = await this.validateRefreshSession(payload.tokenId);
    if (!sessionValidation.isValid) {
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Session invalid',
        extensions: [{ field: 'refreshToken', message: sessionValidation.error || 'Session invalid' }],
        data: null,
      };
    }

    // 3. Отозвать старую сессию
    await this.invalidateRefreshSession(payload.tokenId);

    // 4. Создать новую сессию
    const newTokenId = await this.createRefreshSession(payload.userId);

    // 5. Создать новые токены
    const user = await usersRepository.findByIdOrFail(payload.userId);
    const accessToken = await jwtService.createToken(payload.userId, user.login);
    const refreshToken = await jwtService.createRefreshToken(payload.userId, newTokenId);

    return {
      status: HttpStatus.Ok,
      data: { accessToken, refreshToken },
      extensions: [],
    };

  } catch (error) {
    console.log('Refresh tokens failed:', error);
    return {
      status: HttpStatus.Unauthorized,
      errorMessage: 'Failed to refresh tokens',
      extensions: [{ field: 'refreshToken', message: 'Token refresh failed' }],
      data: null,
    };
  }
},

  async logout(refreshToken: string): Promise<Result<null>> {
  try {
    // 1. Верифицировать refresh токен
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Invalid refresh token',
        extensions: [{ field: 'refreshToken', message: 'Invalid token' }],
        data: null,
      };
    }

    // 2. Валидировать сессию в БД
    const sessionValidation = await this.validateRefreshSession(payload.tokenId);
    if (!sessionValidation.isValid) {
      // Даже если сессия невалидна, логаут считается успешным
      // (токен уже недействителен)
      return {
        status: HttpStatus.NoContent,
        data: null,
        extensions: [],
      };
    }

    // 3. Отозвать сессию
    const revoked = await this.invalidateRefreshSession(payload.tokenId);
    if (!revoked) {
      console.log('Failed to revoke session:', payload.tokenId);
    }

    return {
      status: HttpStatus.NoContent,
      data: null,
      extensions: [],
    };

  } catch (error) {
    console.log('Logout failed:', error);
    return {
      status: HttpStatus.Unauthorized,
      errorMessage: 'Logout failed',
      extensions: [{ field: 'refreshToken', message: 'Invalid token' }],
      data: null,
    };
  }
},

  async createRefreshSession(userId: string): Promise<string> {

    const tokenId = uuid()
    const expiresAt = add(new Date(),{ seconds: SETTINGS.REFRESH_TIME as number })

    const newSession = {
      userId: userId,
      tokenId: tokenId,
      expiresAt: expiresAt,
      isRevoked: false,
      createdAt: new Date(),
    } as RefreshTokenSession

    try {
      await refreshTokenSessionsRepository.create(newSession)
      return newSession.tokenId
    } catch (e: unknown) {
      console.log('Session creation faild:', e);
      throw e;
    }
  },

  async validateRefreshSession(tokenId: string): Promise<SessionValidationResult> {

    const session = await refreshTokenSessionsRepository.findByTokenId(tokenId)

    if (!session) {
      return {
        isValid: false,
        error: 'NOT_FOUND'
      }
    };

    if (session.isRevoked === true) {
      return {
        isValid: false,
        session: session,
        userId: session.userId,
        error: 'REVOKED'
      }
    };

    if (new Date() >= session.expiresAt) {
      return {
        isValid: false,
        session: session,
        userId: session.userId,
        error: 'EXPIRED',
      }
    };

    return {
      isValid: true,
      session: session,
      userId: session.userId
    }
   },

  async invalidateRefreshSession(tokenId: string): Promise<boolean> {
    try {
      return await refreshTokenSessionsRepository.updateToRevoked(tokenId);
    } catch (e: unknown) {
      console.log('Refresh token invalidation failed:', e);
      return false;
    }
  },

  async deleteExpiredSessions(): Promise<number> {
    try {
      return await refreshTokenSessionsRepository.deleteExpired()
    } catch (e: unknown) {
      console.log('Deleting expired sessions faild:', e)
      throw e;
    }
   },
};