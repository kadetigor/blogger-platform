import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/postsRepository';
import { HttpStatus } from '../../../core/types/httpStatus';
import { mapToPostViewModel } from '../mappers/mapToPostViewModel'

export async function getPostListHandler(req: Request, res: Response) {
  try {
    const posts = await postsRepository.findAll();
    const postViewModel = posts.map(mapToPostViewModel);
    res.send(postViewModel);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
