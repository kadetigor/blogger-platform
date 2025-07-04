import { Request, Response } from "express";
import 'reflect-metadata';
import { JwtService } from "../adapters/jwt.adapter";
import { RefreshTokenSessionsRepository } from "../repositories/refresh.token.sessions.repository";
import { BcryptService } from "../adapters/bcrypt.adapter";
import { SecurityDevicesService } from "../devices/security-devices.service";
import { SecurityDeviceRepository } from "../devices/security-device.repository";
import { UsersRepository } from "../../users/repositories/usersRepository";
import { AuthService } from "../application/auth.service";
import { inject } from "inversify";
import { errorsHandler } from "../../core/errors/errorsHandler";
import { HttpStatus } from "../../core/types/httpStatus";
import { SETTINGS } from "../../core/settings/settings";
import { RequestWithUserId } from "../../core/types/requests";
import { IdType } from "../../core/types/id";
import { UsersQueryRepository } from "../../users/repositories/usersQueryRepository";


export class AuthController {
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(RefreshTokenSessionsRepository) protected refreshTokenSessionsRepository: RefreshTokenSessionsRepository,
        @inject(BcryptService) protected bcryptService: BcryptService,
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
        @inject(SecurityDeviceRepository) protected securityDeviceRepository: SecurityDeviceRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(AuthService) protected authService: AuthService,
    ) {}

    async confirmEmailHandler(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const result = await this.authService.confirmEmail(req.body.code);
            
            if (result.status !== HttpStatus.NoContent) {
                res.status(result.status).json({
                    errorsMessages: result.extensions
                });
                return;
            }
            
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async confirmPasswordResetHandler(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const code = req.body.recoveryCode
            const newPassword = req.body.newPassword

            const result = await this.authService.confirmPasswordRecovery(code, newPassword);
            
            if (result.status !== HttpStatus.NoContent) {
                res.status(result.status).json({
                    errorsMessages: result.extensions
                });
                return;
            }
            
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async loginHandler(
        req: Request<{}, {}, { loginOrEmail: string; password: string }>,
        res: Response,
    ): Promise<void> {
        try {
            const { loginOrEmail, password } = req.body;

            const headers = req.headers['user-agent'] as string;
            const ip = req.ip as string;

            const result = await this.authService.loginUser(loginOrEmail, password);

            if (result.status !== HttpStatus.Ok) {
                res.status(HttpStatus.Unauthorized).send(result.extensions);
                return;
            }

            const { accessToken, refreshToken, userId, deviceId } = result.data!;

            await this.securityDevicesService.createDeviceWithId(userId, deviceId, ip, headers);
            
            res.cookie('refreshToken', refreshToken, {
                maxAge: (SETTINGS.REFRESH_TIME as number) * 1000,
                httpOnly: true, 
                secure: true, 
                sameSite: 'strict'
            });
            
            res.status(HttpStatus.Ok).send({ accessToken: accessToken});
        } catch (e: unknown) {
            res.status(HttpStatus.InternalServerError);
        }
    }

    async logoutHandler(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            // Get refresh token from cookies
            const refreshToken = req.cookies.refreshToken;
            
            if (!refreshToken) {
                res.status(HttpStatus.Unauthorized).send();
                return;
            }

            // Verify refresh token to get payload
            const payload = await this.jwtService.verifyRefreshToken(refreshToken);
            if (!payload) {
                res.status(HttpStatus.Unauthorized).send();
                return;
            }

            // Logout through auth service (this will invalidate the refresh token session)
            const result = await this.authService.logout(refreshToken);
            
            if (result.status !== HttpStatus.NoContent) {
                res.status(result.status).json({ errorsMessages: result.extensions });
                return;
            }

            // Delete the device from security devices collection
            // This is important for the tests that check device list after logout
            try {
                await this.securityDeviceRepository.deleteByDeviceId(payload.deviceId);
            } catch (error) {
                console.error('Failed to delete device during logout:', error);
                // Continue with logout even if device deletion fails
            }

            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });

            // Return 204 No Content on successful logout
            res.status(HttpStatus.NoContent).send();
            return;
        } catch (error) {
            console.error('Error in logoutHandler:', error);
            res.status(HttpStatus.InternalServerError).send();
            return;
        }
    }

    async passwordRecoveryEmailHandler(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { email } = req.body;
            const result = await this.authService.sendPasswordRecoveryEmail(email);
            
            if (result.status !== HttpStatus.NoContent) {
                res.status(result.status).json({
                    errorsMessages: result.extensions
                });
                return;
            }
            
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async refreshTokenHandler(
        req: Request,
        res: Response,
    ):Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                res.status(HttpStatus.Unauthorized).json({
                    errorsMessages: [{ field: 'refreshToken', message: 'Refresh token required' }]
                });
                return;
            }
    
            const deviceId = await this.authService.extractDeviceIdFromToken(refreshToken);
    
              if (!deviceId) {
                res.status(HttpStatus.Unauthorized).send();
                return
              }
            
            await this.securityDevicesService.updateDeviceActivity(deviceId);
            
            const result = await this.authService.refreshTokens(refreshToken)
            if (result.status !== HttpStatus.Ok) {
                res.status(result.status).json({ errorsMessages: result.extensions });
                return;
            }
    
            const { accessToken, refreshToken: newRefreshToken } = result.data!;
    
            res.cookie('refreshToken', newRefreshToken, {
                maxAge: (SETTINGS.REFRESH_TIME as number) * 1000,
                httpOnly: true, 
                secure: true, 
                sameSite: 'strict'
            });
            res.status(HttpStatus.Ok).send({ accessToken: accessToken});
        } catch (e: unknown) {
            res.status(HttpStatus.InternalServerError);
        }
    }

    async registrationHandler(
        req: Request,
        res: Response,
    ): Promise<any> {
        try {
            const { login, email, password } = req.body;
            const result = await this.authService.registerUser(login, email, password);
            
            if (result.status !== HttpStatus.NoContent) {
            res.status(result.status).json({
                errorsMessages: result.extensions
            });
            return;
            }
            res.sendStatus(HttpStatus.NoContent);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async resendConfirmEmailHandler(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { email } = req.body;
            const result = await this.authService.resendConfirmationEmail(email);
            
            if (result.status !== HttpStatus.NoContent) {
                res.status(result.status).json({
                    errorsMessages: result.extensions
                });
                return;
            }
            
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getInfoOnCurrentUser(req: RequestWithUserId<IdType>, res: Response): Promise<void> {
        const userId = req.user?.id as string;
        if (!userId) {
          res.sendStatus(HttpStatus.Unauthorized);
          return;
        }
    
        try {
          const user = await this.usersQueryRepository.findByIdOrFail(userId);
          
          // Return only the required fields: userId, login, email
          const meResponse = {
            userId: user._id.toString(),
            login: user.login,
            email: user.email
          };
          
          res.status(HttpStatus.Ok).send(meResponse);
        } catch (error) {
          res.sendStatus(HttpStatus.NotFound);
        }
      }
}