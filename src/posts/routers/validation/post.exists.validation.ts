import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { PostsQueryRepository } from '../../repositories/posts.query-repository';

const postsQueryRepository = new PostsQueryRepository();

export async function validatePostExistsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = req.params.id;
    
    if (!postId) {
      res.status(HttpStatus.BadRequest).json(
        createErrorMessages([
          {
            message: 'postId is required',
            field: 'postId',
          },
        ])
      );
      return;
    }

    // Check if post exists
    await postsQueryRepository.findByIdOrFail(postId);
    
    next();
  } catch (error) {
    res.status(HttpStatus.NotFound).json(
      createErrorMessages([
        {
          message: 'Post with provided postId does not exist',
          field: 'postId',
        },
      ])
    );
  }
}