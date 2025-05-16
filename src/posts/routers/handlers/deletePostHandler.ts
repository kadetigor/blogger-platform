import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { postsRepository } from '../../repositories/postsRepository';
import { errorsHandler } from '../../../core/errors/errorsHandler';

export async function deletePostHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    await postsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
