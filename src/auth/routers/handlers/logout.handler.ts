import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/httpStatus";
import { securityDevicesService } from "../../devices/security-devices.service";

export async function logoutHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                res.sendStatus(HttpStatus.Unauthorized);
                return;
            }

            const deviceId = await authService.extractDeviceIdFromToken(refreshToken);

            if (!deviceId) {
                res.status(HttpStatus.Unauthorized).send();
                return
            }

            await securityDevicesService.deleteDevice(req.user!.id, deviceId)
            
            const result = await authService.logout(refreshToken)
            if (result.status !== HttpStatus.NoContent) {
                res.sendStatus(HttpStatus.Unauthorized);
                return;
            }

            res.clearCookie('refreshToken')
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            res.status(HttpStatus.Unauthorized);
        }
}