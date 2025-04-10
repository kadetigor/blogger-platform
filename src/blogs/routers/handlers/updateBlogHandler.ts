import { Request, Response } from "express";
import { blogInputDto } from "../../dto/blogsDto";
import { HttpStatus } from "../../../core/types/httpStatus";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { blogsRepository } from "../../repositories/blogsRepository";

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, blogInputDto>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }
    await blogsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}
