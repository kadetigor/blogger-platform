import { Request, Response } from 'express';
import { postInputDto } from '../../dto/postInputDto';
import { HttpStatus } from '../../../core/types/httpStatus';
import { Post } from '../../types/post';
import { blogsRepository } from '../../../blogs/repositories/blogsRepository'
import { postsRepository } from '../../repositories/postsRepository';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel';


export async function createPostHandler(
  req: Request<{}, {}, postInputDto>,
  res: Response,
) {
  try {
    const blogName = await blogsRepository.getBlogName(req.body.blogId);

    const newPost: Post = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: blogName,
      createdAt: new Date,
    };
    const createdPost = await postsRepository.create(newPost);
    const postViewModel = mapToPostViewModel(createdPost);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    res.status(HttpStatus.InternalServerError);
  }
}
