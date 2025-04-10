import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { blogsRepository } from '../../repositories/blogsRepository';
import { mapToBlogViewModel } from '../mappers/mapToBlogViewModel';

export async function getBlogHandler(req: Request, res: Response) {
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

    const blogViewModel = mapToBlogViewModel(blog);
    res.status(HttpStatus.Ok).send(blogViewModel);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
