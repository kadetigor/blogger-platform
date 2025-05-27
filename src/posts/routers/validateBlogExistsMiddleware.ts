import { NextFunction, Request, Response } from 'express';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { HttpStatus } from '../../core/types/httpStatus';
import { createErrorMessages } from '../../core/middlewares/validation/input-validtion-result.middleware';

export async function validateBlogExistsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const blogId = req.params.id
    
    if (!blogId) {
      res.status(HttpStatus.BadRequest).json(
        createErrorMessages([
          {
            message: 'blogId is required',
            field: 'blogId',
          },
        ])
      );
      return;
    }

    // Check if blog exists
    const blog = await blogsRepository.findByIdOrFail(blogId);
    
    // Attach the blogName to the request body for later use
    req.body.blogName = blog.name;
    
    next();
  } catch (error) {
    res.status(HttpStatus.BadRequest).json(
      createErrorMessages([
        {
          message: 'Blog with provided blogId does not exist',
          field: 'blogId',
        },
      ])
    );
  }
}