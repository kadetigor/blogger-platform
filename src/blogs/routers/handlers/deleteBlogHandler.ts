import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { blogsService } from "../../application/blogsService";
import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function deleteBlogHandler(
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
