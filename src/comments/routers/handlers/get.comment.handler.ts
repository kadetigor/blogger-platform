import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { commentsQueryRepository } from '../../repositories/comments.query.repository';
import { mapToCommentViewModel } from '../mappers/map.to.comment.view.model';

export async function getCommentHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const comment = await commentsQueryRepository.findByIdOrFail(id);
    const commentViewModel = mapToCommentViewModel(comment);
    res.status(HttpStatus.Ok).send(commentViewModel);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}