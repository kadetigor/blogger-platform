import { Request, Response } from 'express';
import { postInputDto } from '../../dto/postInputDto';
import { HttpStatus } from '../../../core/types/httpStatus';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel';
import { postsService } from '../../application/postsService';
import { errorsHandler } from '../../../core/errors/errorsHandler';



export async function createPostHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const blogId = req.body.blogId
  console.log(`recived blogId ${blogId}`)
  try {
    const createdPostId = await postsService.create({...req.body, blogId});
    console.log(`created post ID ${createdPostId}`)

    const createdPost = await postsService.findByIdOrFail(createdPostId);

    console.log(`created post ${createdPost}`)

    const postViewModel = mapToPostViewModel(createdPost);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
