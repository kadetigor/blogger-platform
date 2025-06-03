import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { usersRepository } from "../../../users/repositories/usersRepository";
import { bcryptService } from "../../adapters/bcrypt.service";
import { userCollection } from "../../../db/mongoDb";
import { authService } from "../../application/auth.service";

export async function loginHandler(
    req: Request<{}, {}, { loginOrEmail: string; password: string }>,
    res: Response,
): Promise<void> {
    try {
        const { loginOrEmail, password } = req.body;

        const result = await authService.loginUser(loginOrEmail, password);

        if (result.status !== HttpStatus.Ok) {
            res.sendStatus(HttpStatus.Unauthorized).send(result.extensions);
            return;
        }

        // Login successful
        res.sendStatus(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}