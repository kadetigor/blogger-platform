import { Request, Response } from 'express';
import { postInputDto } from '../../dto/postInputDto';
import { HttpStatus } from '../../../core/types/httpStatus';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel';
import { postsService } from '../../application/postsService';
import { errorsHandler } from '../../../core/errors/errorsHandler';



export async function createPostHandler(
  req: Request<{}, {}, postInputDto>,
  res: Response,
): Promise<void> {
  try {
    // A) get the new ID
    const createdPostId = await postsService.create(req.body);

    // B) fetch the full post (now with blogName)
    const createdPost = await postsService.findByIdOrFail(createdPostId);

    // C) map & send
    const postViewModel = mapToPostViewModel(createdPost);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
