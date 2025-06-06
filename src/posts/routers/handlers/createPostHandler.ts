import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel';
import { postsService } from '../../application/postsService';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsRepository } from '../../repositories/postsRepository';



export async function createPostHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const blogId = req.body.blogId
  try {
    
    const createdPostId = await postsService.create({...req.body, blogId});
    const createdPost = await postsRepository.findByIdOrFail(createdPostId);
    const postViewModel = mapToPostViewModel(createdPost);

    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
