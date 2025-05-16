import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { postsRepository } from '../../repositories/postsRepository';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel';
import { errorsHandler } from '../../../core/errors/errorsHandler';

export async function getPostHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const post = await postsRepository.findByIdOrFail(id);
    const postViewModel = mapToPostViewModel(post);
    res.status(HttpStatus.Ok).send(postViewModel);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
