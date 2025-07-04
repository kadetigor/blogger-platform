import { WithId } from 'mongodb';
import 'reflect-metadata';
import { JwtService } from '../adapters/jwt.adapter';
import { BcryptService } from '../adapters/bcrypt.adapter';
import { HttpStatus } from '../../core/types/httpStatus';
import { Result } from '../../core/result/result.type';
import { UsersRepository } from '../../users/repositories/usersRepository';
import { emailManager } from '../../email/managers/email.manager';
import { v4 as uuid } from 'uuid';
import { UserWithConfirmation } from '../../email/user.with.confirmation.type';
import { RefreshTokenSession } from "../domain/refresh.token.session";
import { RefreshTokenSessionsRepository } from "../repositories/refresh.token.sessions.repository";
import { add } from 'date-fns'
import { SETTINGS } from '../../core/settings/settings';
import { SessionValidationResult } from '../types/refresh.token.types';
import { SecurityDevicesService } from '../devices/security-devices.service';
import { repositoryNotFoundError } from '../../core/errors/repositoryNotFoundError';
import { inject } from 'inversify';

export class AuthService {

  constructor(
    @inject(JwtService) protected jwtService: JwtService,
    @inject(RefreshTokenSessionsRepository) protected refreshTokenSessionsRepository: RefreshTokenSessionsRepository,
    @inject(BcryptService) protected bcryptService: BcryptService,
    @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
    @inject(UsersRepository) protected usersRepository: UsersRepository,
  ) {}

  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string, refreshToken: string, userId: string, deviceId: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== HttpStatus.Ok)
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };
    
    const userId = result.data!._id.toString();
    const accessToken = await this.jwtService.createToken(userId, result.data!.login);
    
    const deviceId = uuid();
    const tokenId = await this.createRefreshSession(userId, deviceId);
    
    const refreshToken = await this.jwtService.createRefreshToken(userId, tokenId, deviceId);

    return {
      status: HttpStatus.Ok,
      data: { accessToken, refreshToken, userId, deviceId },
      extensions: []
    };
  }

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<UserWithConfirmation> | null>> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Wrong credentials',
        extensions: [{ field: 'loginOrEmail', message: 'Login or email is wrong' }],
        data: null,
      };
    }

    const isPasswordCorrect = await this.bcryptService.checkPassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Wrong credentials',
        extensions: [{ field: 'password', message: 'Password is wrong' }],
        data: null,
      };
    }

    return {
      status: HttpStatus.Ok,
      data: user,
      extensions: [],
    };
  }

  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<Result<{ id: string } | null>> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findByLoginOrEmail(login) || 
                        await this.usersRepository.findByLoginOrEmail(email);
    
    if (existingUser) {
      const field = existingUser.login === login ? 'login' : 'email';
      return {
        status: HttpStatus.BadRequest,
        errorMessage: 'User already exists',
        extensions: [{ field, message: `${field} already exists` }],
        data: null,
      };
    }

    // Hash password
    const passwordHash = await this.bcryptService.generateHash(password);
    
    // Generate confirmation code
    const confirmationCode = uuid();
    
    // Create user with confirmation info
    const user: UserWithConfirmation = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode,
        isConfirmed: false,
      },
    };

    // Save user
    const userId = await this.usersRepository.create(user);
    
    if (!userId) {
      return {
        status: HttpStatus.InternalServerError,
        errorMessage: 'Failed to create user',
        extensions: [],
        data: null,
      };
    }

    // Send confirmation email
    try {
      await emailManager.sendEmailConfimationMessage(user);
    } catch (error) {
      console.log('Email sending failed, but user was created:', error);
    }

    return {
      status: HttpStatus.NoContent,
      data: { id: userId },
      extensions: [],
    };
  }

  async confirmEmail(code: string): Promise<Result<null>> {
    try {
      const user = await this.usersRepository.findByConfirmationCode(code);
      
      // Check if already confirmed
      if (user!.emailConfirmation?.isConfirmed) {
        return {
          status: HttpStatus.BadRequest,
          errorMessage: 'Email already confirmed',
          extensions: [{ field: 'code', message: 'Email is already confirmed' }],
          data: null,
        };
      }

      // Confirm email
      const confirmed = await this.usersRepository.updateConfirmation(user!._id);
      
      if (!confirmed) {
        return {
          status: HttpStatus.InternalServerError,
          errorMessage: 'Failed to confirm email',
          extensions: [],
          data: null,
        };
      }

      return {
        status: HttpStatus.NoContent,
        data: null,
        extensions: [],
      };
    } catch (error) {
      // Handle repositoryNotFoundError when confirmation code doesn't exist
      if (error instanceof repositoryNotFoundError) {
        return {
          status: HttpStatus.BadRequest,
          errorMessage: 'Invalid confirmation code',
          extensions: [{ field: 'code', message: 'Confirmation code is invalid' }],
          data: null,
        };
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  async resendConfirmationEmail(email: string): Promise<Result<null>> {
    const user = await this.usersRepository.findByLoginOrEmail(email);
    
    if (!user) {
        return {
            status: HttpStatus.BadRequest,
            data: null,
            errorMessage: 'User not found',
            extensions: [{ field: 'email', message: 'User with this email does not exist' }],
        };
    }

    // Check if user is already confirmed
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
    await this.usersRepository.updateConfirmationCode(user._id, newConfirmationCode);
    
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
  }

  async refreshTokens(oldRefreshToken: string): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
    try {
      // 1. Verify old refresh token
      const payload = await this.jwtService.verifyRefreshToken(oldRefreshToken);
      if (!payload) {
        return {
          status: HttpStatus.Unauthorized,
          errorMessage: 'Invalid refresh token',
          extensions: [{ field: 'refreshToken', message: 'Invalid token' }],
          data: null,
        };
      }

      // 2. Validate session in DB
      const sessionValidation = await this.validateRefreshSession(payload.tokenId);
      if (!sessionValidation.isValid) {
        return {
          status: HttpStatus.Unauthorized,
          errorMessage: 'Session invalid',
          extensions: [{ field: 'refreshToken', message: sessionValidation.error || 'Session invalid' }],
          data: null,
        };
      }

      // 3. Revoke old session
      await this.invalidateRefreshSession(payload.tokenId);

      // 4. Create new session with same deviceId
      const newTokenId = await this.createRefreshSession(payload.userId, payload.deviceId);

      // 5. Create new tokens
      const user = await this.usersRepository.findByIdOrFail(payload.userId);
      const accessToken = await this.jwtService.createToken(payload.userId, user.login);
      const refreshToken = await this.jwtService.createRefreshToken(payload.userId, newTokenId, payload.deviceId);

      // 6. Update device activity
      await this.securityDevicesService.updateDeviceActivity(payload.deviceId);

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
  }

  async logout(refreshToken: string): Promise<Result<null>> {
    try {
      // 1. Verify refresh token
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      if (!payload) {
        return {
          status: HttpStatus.Unauthorized,
          errorMessage: 'Invalid refresh token',
          extensions: [{ field: 'refreshToken', message: 'Invalid token' }],
          data: null,
        };
      }

      // 2. Validate session in DB
      const sessionValidation = await this.validateRefreshSession(payload.tokenId);
      if (!sessionValidation.isValid) {
        // Even if session is invalid, logout is considered successful
        return {
          status: HttpStatus.NoContent,
          data: null,
          extensions: [],
        };
      }

      // 3. Revoke session
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
        status: HttpStatus.InternalServerError,
        errorMessage: 'Logout failed',
        extensions: [],
        data: null,
      };
    }
  }

  async createRefreshSession(userId: string, deviceId: string): Promise<string> {
    const tokenId = uuid();
    const session: RefreshTokenSession = {
      userId,
      tokenId,
      deviceId,
      isRevoked: false,
      createdAt: new Date(),
      expiresAt: add(new Date(), { seconds: SETTINGS.REFRESH_TIME as number })
    };
    
    await this.refreshTokenSessionsRepository.createSession(session);
    return tokenId;
  }

  async validateRefreshSession(tokenId: string): Promise<SessionValidationResult> {
    const session = await this.refreshTokenSessionsRepository.findSessionByTokenId(tokenId);
    
    if (!session) {
      return { isValid: false, error: 'NOT_FOUND' };
    }
    
    if (session.isRevoked) {
      return { isValid: false, error: 'REVOKED' };
    }
    
    if (session.expiresAt < new Date()) {
      return { isValid: false, error: 'EXPIRED' };
    }
    
    return { isValid: true };
  }

  async invalidateRefreshSession(tokenId: string): Promise<boolean> {
    return await this.refreshTokenSessionsRepository.invalidateSession(tokenId);
  }

  async extractDeviceIdFromToken(refreshToken: string): Promise<string | null> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      return payload?.deviceId || null;
    } catch (error) {
      return null;
    }
  }

  async isEmailAlreadyConfirmed(email: string): Promise<boolean> {
    try {
      const user = await this.usersRepository.findByLoginOrEmail(email);
      return user?.emailConfirmation?.isConfirmed || false;
    } catch (error) {
      return false;
    }
  }

  async sendPasswordRecoveryEmail(email: string): Promise<Result<null>> {
    const user = await this.usersRepository.findByLoginOrEmail(email);

    if(!user) {
      return {
        status: HttpStatus.NoContent,
        data: null,
        errorMessage: '',
        extensions: [],
      };
    }

    const newConfirmationCode = uuid();

    await this.usersRepository.updateConfirmationCode(user._id, newConfirmationCode);

    try {
      const updatedUser = { ...user, emailConfirmation: { ...user.emailConfirmation, confirmationCode: newConfirmationCode } }
      await emailManager.sendPasswordRecoveryEmail(updatedUser);
    } catch (error) {
      console.log('Email sending failed, but code update continues:', error);
    }

    return {
        status: HttpStatus.NoContent,
        data: null,
        errorMessage: '',
        extensions: [],
    };
  }

  async confirmPasswordRecovery(code: string, password: string): Promise<Result<null>> {
    try {
      const user = await this.usersRepository.findByConfirmationCode(code)

      if (!user) {
        return {
          status: HttpStatus.BadRequest,
          errorMessage: 'Invalid recovery code',
          extensions: [{
            message: 'Invalid recovery code',
            field: 'recoveryCode'
          }],
          data: null,
        };
      }

      const newPasswordHash = await this.bcryptService.generateHash(password);

      await this.usersRepository.updatePassword(user._id, newPasswordHash)

      await this.usersRepository.clearRecoveryCode(user._id);

      if (!user) {
        return {
          status: HttpStatus.InternalServerError,
          errorMessage: 'Failed to update password',
          extensions: [],
          data: null,
        };
      }
      
      return {
        status: HttpStatus.NoContent,
        extensions: [],
        data: null
      };

    } catch (error) {
      throw error;
    }
  }
};