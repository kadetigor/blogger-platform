import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/httpStatus";
import { SETTINGS } from "../../../core/settings/settings";
import { jwtService } from "../../adapters/jwt.adapter";
import { securityDevicesService } from "../../devices/security-devices.service";

export async function refreshTokenHandler(
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

        const deviceId = await authService.extractDeviceIdFromToken(refreshToken);

          if (!deviceId) {
            res.status(HttpStatus.Unauthorized).send();
            return
          }
        
        await securityDevicesService.updateDeviceActivity(deviceId);
        
        const result = await authService.refreshTokens(refreshToken)
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