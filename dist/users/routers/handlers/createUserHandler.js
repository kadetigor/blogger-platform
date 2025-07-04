"use strict";
/* import { usersService } from "../../application/usersService";
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { mapToUserOutput } from "../mappers/mapToUserOutput";
import { usersRepository } from "../../repositories/usersRepository";

export async function createUserHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const createUserId = await usersService.create(req.body);
        const createUser = await usersRepository.findByIdOrFail(createUserId);
        const userOutput = mapToUserOutput(createUser);

        res.status(HttpStatus.Created).send(userOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
} */ 
