import { Request, Response } from 'express';
import { postInputDto } from '../../dto/postInputDto';
import { HttpStatus } from '../../../core/types/httpStatus';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel';
import { postsService } from '../../application/postsService';
import { errorsHandler } from '../../../core/errors/errorsHandler';



export async function createPostHandler(
  req: Request<{ id: string }, {}, postInputDto>,
  res: Response,
): Promise<void> {
  const blogId = req.params.id
  try {
    const createdPostId = await postsService.create({...req.body, blogId});
    const createdPost = await postsService.findByIdOrFail(createdPostId);

    const postViewModel = mapToPostViewModel(createdPost);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
