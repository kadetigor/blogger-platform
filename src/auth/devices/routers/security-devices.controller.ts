import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { AuthService } from "../../application/auth.service";
import { SecurityDevicesService } from "../security-devices.service";
import { RefreshTokenSessionsRepository } from "../../repositories/refresh.token.sessions.repository";
import { inject } from "inversify";
import { JwtService } from "../../adapters/jwt.adapter";
import { BcryptService } from "../../adapters/bcrypt.adapter";
import { UsersRepository } from "../../../users/repositories/usersRepository";
import { SecurityDeviceRepository } from "../security-device.repository";
import { mapToDeviceViewModel } from "../map.to.device.view.model";

export class ScurityDevicesController {

    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(RefreshTokenSessionsRepository) protected refreshTokenSessionsRepository: RefreshTokenSessionsRepository,
        @inject(BcryptService) protected bcryptService: BcryptService,
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
        @inject(SecurityDeviceRepository) protected securityDeviceRepository: SecurityDeviceRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(AuthService) protected authService: AuthService,
    ) {}

    async deleteAllOtherDevicesHandler(req: Request, res: Response) {
        try {
            // Get userId from authenticated request
            const userId = (req as any).userId;

            // Get current deviceId from refresh token
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(HttpStatus.Unauthorized).send();
                return;
            }

            // Extract deviceId from the refresh token
            const currentDeviceId = await this.authService.extractDeviceIdFromToken(refreshToken);

            if (!currentDeviceId) {
                res.status(HttpStatus.Unauthorized).send();
                return;
            }

            // Delete all other devices except current one
            await this.securityDevicesService.deleteAllOtherDevices(userId, currentDeviceId);

            // IMPORTANT: Also delete all refresh token sessions for other devices
            // This ensures refresh tokens for deleted devices become invalid
            await this.refreshTokenSessionsRepository.deleteAllUserSessionsExceptOne(userId, currentDeviceId);

            res.status(HttpStatus.NoContent).send();
            return;

        } catch (error) {
            console.error('Error in deleteAllOtherDevicesHandler:', error);
            res.status(HttpStatus.InternalServerError).send();
            return;
        }
    }

    async deleteDeviceHandler(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const deviceIdToDelete = req.params.id;
    
            // Check if device exists
            const device = await this.securityDeviceRepository.findByDeviceId(deviceIdToDelete);
            if (!device) {
                res.status(HttpStatus.NotFound).send();
                return;
            }
    
            // Check ownership
            if (device.userId !== userId) {
                res.status(HttpStatus.Forbidden).send();
                return;
            }
    
            // Delete the device
            await this.securityDeviceRepository.deleteByDeviceId(deviceIdToDelete);
    
            // IMPORTANT: Also invalidate all refresh token sessions for this device
            // This ensures the refresh token becomes invalid after device deletion
            await this.refreshTokenSessionsRepository.deleteByDeviceId(deviceIdToDelete);
    
            res.status(HttpStatus.NoContent).send();
            return;
        } catch (error) {
            console.error('Error in deleteDeviceHandler:', error);
            res.status(HttpStatus.InternalServerError).send();
            return;
        }
    }

    async getDevicesHandler(
        req: Request,
        res: Response,
    ) {
        try {
            // Get userId from authenticated request
            const userId = (req as any).userId;
            
            const devices = await this.securityDevicesService.getAllUserDevices(userId);
    
            if (!devices || devices.length === 0) {
                res.status(HttpStatus.Ok).json([]);
                return;
            }
    
            const devicesViewModels = devices.map(device => mapToDeviceViewModel(device));
            res.status(HttpStatus.Ok).json(devicesViewModels);
            return;
        } catch (e: unknown) {
            console.error('Error in getDevicesHandler:', e);
            res.status(HttpStatus.InternalServerError).send();
            return;
        }
    }
}