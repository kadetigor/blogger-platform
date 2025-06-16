import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { HttpStatus } from "../../../core/types/httpStatus";

export async function resendConfirmEmailHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const { email } = req.body;
        const result = await authService.resendConfirmationEmail(email);
        
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