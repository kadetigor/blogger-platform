import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { usersRepository } from "../../../users/repositories/usersRepository";
import { bcryptService } from "../../adapters/bcrypt.service";
import { userCollection } from "../../../db/mongoDb";

export async function loginHandler(
    req: Request<{}, {}, { loginOrEmail: string; password: string }>,
    res: Response,
): Promise<void> {
    try {
        const { loginOrEmail, password } = req.body;

        // Find user by login or email
        const user = await userCollection.findOne({
            $or: [
                { login: loginOrEmail },
                { email: loginOrEmail }
            ]
        });

        // If user not found or password doesn't match
        if (!user || !(await bcryptService.checkPassword(password, user.passwordHash))) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }

        // Login successful
        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}