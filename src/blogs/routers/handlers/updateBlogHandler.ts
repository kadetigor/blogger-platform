import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { blogUpdateInput } from "../input/blogUpdateInput";
import { blogsService } from "../../application/blogsService";
import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, blogUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await blogsService.update(id, req.body.data.attributes);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
