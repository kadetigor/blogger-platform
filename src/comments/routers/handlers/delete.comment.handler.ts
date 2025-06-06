import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { commentsRepository } from '../../repositories/comments.repository';

export async function deleteCommentHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    await commentsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
