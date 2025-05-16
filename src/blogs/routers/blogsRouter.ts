import { Router } from 'express';
import { getBlogHandler } from "./handlers/getBlogHandler";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
import { getBlogListHandler } from "./handlers/getBlogListHandler";
import { updateBlogHandler } from "./handlers/updateBlogHandler";
import { idValidationMiddleware } from "../../core/middlewares/validation/params-id.validation-middleware";
import { blogInputDtoValidation } from "./blogInputDtoValidationMiddleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from '../../core/middlewares/validation/queryPaginationSortingValidationMiddleware';
import { postSortField } from '../../posts/routers/input/postSortField';
import { getBlogPostsListHandler } from '../../posts/routers/handlers/getBlogPostsListHandler';

export const blogsRouter = Router()

blogsRouter
  .get('/', getBlogListHandler) // blogsController.getBlogs
  .get('/:id', idValidationMiddleware, inputValidationResultMiddleware, getBlogHandler)
  .post('/', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, createBlogHandler)
  .put('/:id', superAdminGuardMiddleware, idValidationMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, updateBlogHandler)
  .delete('/:id', superAdminGuardMiddleware, idValidationMiddleware, inputValidationResultMiddleware, deleteBlogHandler)
  .get(
    '/:id/posts',
    idValidationMiddleware,
    paginationAndSortingValidation(postSortField),
    inputValidationResultMiddleware,
    getBlogPostsListHandler,
  );
