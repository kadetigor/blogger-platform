import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/httpStatus";

export async function confirmEmailHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const result = await authService.confirmEmail(req.body.code);
        
        if (!result) {
            res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{
                    message: "Invalid or expired confirmation code",
                    field: "code"
                }]
            });
            return;
        }
        
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}