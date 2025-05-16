import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { mapToBlogOutput } from '../mappers/mapToBlogOutput';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { blogsService } from '../../application/blogsService';

export async function getBlogHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const blog = await blogsService.findByIdOrFail(id);

    const blogOutput = mapToBlogOutput(blog);
    res.status(HttpStatus.Ok).send(blogOutput);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
