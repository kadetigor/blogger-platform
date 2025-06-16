import { Request, Response } from "express"
import { authService } from "../../application/auth.service"
import { errorsHandler } from "../../../core/errors/errorsHandler"


export async function resendConfirmEmailHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const result = await authService.confirmEmail(req.body.code)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}