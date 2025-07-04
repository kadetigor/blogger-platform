"use strict";
/* import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/httpStatus";

export async function confirmPasswordResetHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const code = req.body.recoveryCode
        const newPassword = req.body.newPassword

        const result = await authService.confirmPasswordRecovery(code, newPassword);
        
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
} */ 
