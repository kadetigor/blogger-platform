import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { postUpdateInput } from '../input/postUpdateInput';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsService } from '../../application/postsService';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, postUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await postsService.update(id, req.body.data.attributes);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
