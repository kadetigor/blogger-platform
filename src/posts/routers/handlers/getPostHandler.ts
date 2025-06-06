import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsQueryRepository } from '../../repositories/postsQueryRepository';

export async function getPostHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const post = await postsQueryRepository.findByIdOrFail(id);
    const postViewModel = mapToPostViewModel(post);
    res.status(HttpStatus.Ok).send(postViewModel);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
