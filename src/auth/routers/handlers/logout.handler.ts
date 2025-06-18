import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/httpStatus";

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