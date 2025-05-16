import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { postsRepository } from '../../repositories/postsRepository';

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const post = await postsRepository.findByIdOrFail(id);

    if (!post) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Post not found' }]),
        );
      return;
    }

    await postsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
