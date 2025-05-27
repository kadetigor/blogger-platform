import { blogsService } from "../../../blogs/application/blogsService";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { HttpStatus } from "../../../core/types/httpStatus";
import { Request, Response } from "express";

export async function deleteUserHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;

        await blogsService.delete(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}