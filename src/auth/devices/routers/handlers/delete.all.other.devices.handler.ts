import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpStatus";
import { authService } from "../../../application/auth.service";
import { securityDevicesService } from "../../security-devices.service";


export const deleteAllOtherDevicesHandler = async (req: Request, res: Response) => {
    try {
        // Get userId from authenticated request
        const userId = (req as any).userId;

        // Get current deviceId from refresh token
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(HttpStatus.Unauthorized).send();
            return
        }

        // Extract deviceId from the refresh token
        const currentDeviceId = await authService.extractDeviceIdFromToken(refreshToken);

        if (!currentDeviceId) {
            res.status(HttpStatus.Unauthorized).send();
            return
        }

        // Delete all other devices except current one
        await securityDevicesService.deleteAllOtherDevices(userId, currentDeviceId);
        res.status(HttpStatus.NoContent).send();
        return

    } catch (error) {
        console.error('Error in deleteAllOtherDevicesHandler:', error);
        res.status(HttpStatus.Unauthorized).send();
        return
    }
};