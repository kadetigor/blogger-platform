import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { authService } from "../../application/auth.service";

export async function loginHandler(
    req: Request<{}, {}, { loginOrEmail: string; password: string }>,
    res: Response,
): Promise<void> {
    try {
        const { loginOrEmail, password } = req.body;

        const result = await authService.loginUser(loginOrEmail, password);

        if (result.status !== HttpStatus.Ok) {
            res.status(HttpStatus.Unauthorized).send(result.extensions);
            return;
        }

        // Login successful
        res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });
    } catch (e: unknown) {
        res.status(HttpStatus.InternalServerError);
    }
}