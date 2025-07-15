import { Router } from 'express';
import { idValidationMiddleware } from "../../core/middlewares/validation/params-id.validation-middleware";
import { blogInputDtoValidation } from "./blog.input-dto-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/routers/guards/basic.guard.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from '../../core/middlewares/validation/queryPaginationSortingValidationMiddleware';
import { postSortField } from '../../posts/routers/input/postSortField';
import { blogSortField } from './input/blog.sort-field';
import { validateBlogExistsMiddleware } from '../../posts/routers/validation/validateBlogExistsMiddleware';
import { blogPostInputDtoValidation } from '../../posts/routers/validation/blogPostInputDtoValidation';
import { BlogsController } from './blogs.controller';
import { container } from '../../composition-root';
import { PostsController } from '../../posts/routers/posts.controller';

const blogsController = container.get(BlogsController)
const postsController = container.get(PostsController)

export const blogsRouter = Router()

blogsRouter
  .get(
    '/',
    paginationAndSortingValidation(blogSortField),
    inputValidationResultMiddleware,
    blogsController.getBlogListHandler.bind(blogsController)//getBlogListHandler
  ) // blogsController.getBlogs
  .get(
    '/:id', 
    idValidationMiddleware, 
    inputValidationResultMiddleware, 
    blogsController.getBlogHandler.bind(blogsController)//getBlogHandler

  )
  .post(
    '/', 
    superAdminGuardMiddleware, 
    blogInputDtoValidation, 
    inputValidationResultMiddleware, 
    blogsController.createBlogHandler.bind(blogsController)//createBlogHandler

  )
  .put(
    '/:id', 
    superAdminGuardMiddleware, 
    idValidationMiddleware, 
    blogInputDtoValidation, 
    inputValidationResultMiddleware, 
    blogsController.updateBlogHandler.bind(blogsController)//updateBlogHandler

  )
  .delete(
    '/:id', 
    superAdminGuardMiddleware, 
    idValidationMiddleware, 
    inputValidationResultMiddleware, 
    blogsController.deleteBlogHandler.bind(blogsController)//deleteBlogHandler

  )
  .get(
    '/:id/posts',
    idValidationMiddleware,
    paginationAndSortingValidation(postSortField),
    inputValidationResultMiddleware,
    blogsController.getBlogPostsListHandler.bind(blogsController)//getBlogPostsListHandler
  )
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    idValidationMiddleware,
    blogPostInputDtoValidation,
    validateBlogExistsMiddleware,
    inputValidationResultMiddleware,
    postsController.createPostHandler.bind(postsController)//createPostHandler
  );
