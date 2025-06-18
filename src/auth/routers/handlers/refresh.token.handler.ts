import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/httpStatus";
import { SETTINGS } from "../../../core/settings/settings";

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
        
        const result = await authService.refreshTokens(refreshToken)
        if (result.status !== HttpStatus.Ok) {
            res.status(result.status).json({ errorsMessages: result.extensions });
            return;
        }
        res.cookie('refreshToken', result.data!.refreshToken, {
            maxAge: (SETTINGS.REFRESH_TIME as number) * 1000,
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict'
        });
        res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken});
    } catch (e: unknown) {
        res.status(HttpStatus.InternalServerError);
    }
}