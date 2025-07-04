"use strict";
/* import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpStatus";
import { AuthService } from "../../../application/auth.service";
import { SecurityDevicesService } from "../../security-devices.service";
import { RefreshTokenSessionsRepository } from "../../../repositories/refresh.token.sessions.repository";

export const deleteAllOtherDevicesHandler = async (req: Request, res: Response) => {
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
        const currentDeviceId = await authService.extractDeviceIdFromToken(refreshToken);

        if (!currentDeviceId) {
            res.status(HttpStatus.Unauthorized).send();
            return;
        }

        // Delete all other devices except current one
        await securityDevicesService.deleteAllOtherDevices(userId, currentDeviceId);

        // IMPORTANT: Also delete all refresh token sessions for other devices
        // This ensures refresh tokens for deleted devices become invalid
        await refreshTokenSessionsRepository.deleteAllUserSessionsExceptOne(userId, currentDeviceId);

        res.status(HttpStatus.NoContent).send();
        return;

    } catch (error) {
        console.error('Error in deleteAllOtherDevicesHandler:', error);
        res.status(HttpStatus.InternalServerError).send();
        return;
    }
}; */ 
