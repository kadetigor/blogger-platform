import { Request, Response } from "express";
import { blogCreateInput } from "../input/blogCreateInput";
import { blogsService } from "../../application/blogsService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { mapToBlogOutput } from "../mappers/mapToBlogOutput";
import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function createBlogHandler(
  req: Request<{}, {}, blogCreateInput>,
  res: Response,
) {
  try {
    const createdBlogId = await blogsService.create(
      req.body.data.attributes,
    );

    const createdBlog = await blogsService.findByIdOrFail(createdBlogId);

    const blogOutput = mapToBlogOutput(createdBlog);

    res.status(HttpStatus.Created).send(blogOutput);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
