import { Request, Response } from 'express';
import { postInputDto } from '../../dto/postInputDto';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { postsRepository } from '../../repositories/postsRepository';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, postInputDto>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const post = await postsRepository.findById(id);

    if (!post) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Post not found' }])
        );
      return;

    }

    await postsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}
