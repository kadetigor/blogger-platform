import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { authService } from "../../application/auth.service";
import { SETTINGS } from "../../../core/settings/settings";
import { securityDevicesService } from "../../devices/security-devices.service";
import { usersService } from "../../../users/application/usersService";

export async function loginHandler(
    req: Request<{}, {}, { loginOrEmail: string; password: string }>,
    res: Response,
): Promise<void> {
    try {
        const { loginOrEmail, password } = req.body;

        const headers = req.headers['user-agent'] as string;
        const ip = req.ip as string;

        const result = await authService.loginUser(loginOrEmail, password);

        if (result.status !== HttpStatus.Ok) {
            res.status(HttpStatus.Unauthorized).send(result.extensions);
            return;
        }

        const { accessToken, refreshToken, userId } = result.data!;

        await securityDevicesService.createDevice(userId, ip, headers);
        
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