import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { authService } from "../../application/auth.service";

export async function confirmEmailHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const result = await authService.confirmEmail(req.body.code)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}