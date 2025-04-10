import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { blogsRepository } from "../../repositories/blogsRepository";

export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ message: 'Blog not found', field: 'id' }]),
        );
      return;
    }
    await blogsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
