import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { usersService } from "../../../users/application/usersService";
import { usersRepository } from "../../../users/repositories/usersRepository";
import { mapToUserOutput } from "../../../users/routers/mappers/mapToUserOutput";

export async function createNewUserHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const createUserId = await usersService.create(req.body);
        const createUser = await usersRepository.findByIdOrFail(createUserId);
        const userOutput = mapToUserOutput(createUser);

        res.status(HttpStatus.NoContent).send(userOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}