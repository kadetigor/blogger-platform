import { Router } from 'express';
import { postInputDtoValidation } from "./validation/postInputDtoValidationMiddleware";
import { updatePostHandler } from "./handlers/updatePostHandler";
import { createPostHandler } from "./handlers/createPostHandler";
import { getPostHandler } from "./handlers/getPostHandler"
import { getPostListHandler } from "./handlers/getPostListHandler";
import { idValidationMiddleware } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from "../../auth/routers/guards/basic.guard.middleware";
import { deletePostHandler } from "./handlers/deletePostHandler";
import { postSortField } from './input/postSortField';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/queryPaginationSortingValidationMiddleware';
import { accessTokenGuard } from '../../auth/routers/guards/access.token.guard';
import { contentValidation } from '../../comments/routers/validation/comment.input.dto.validation';
import { createCommentHandler } from '../../comments/routers/handlers/create.comment.handler';
import { getCommentListHandler } from '../../comments/routers/handlers/get.comment.list.handler';
import { validatePostExistsMiddleware } from './validation/post.exists.validation';
import { commentSortField } from '../../comments/routers/input/comment.sort.field';

export const postsRouter = Router({})

postsRouter
  .get(
    '/',
    paginationAndSortingValidation(postSortField),
    inputValidationResultMiddleware,
    getPostListHandler
  )
  .get(
    '/:id',
    idValidationMiddleware,
    inputValidationResultMiddleware,
    getPostHandler
  )
  .post(
    '/',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidationMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidationMiddleware,
    inputValidationResultMiddleware,
    deletePostHandler
  )
  .post(
    '/:id/comments',
    accessTokenGuard,
    idValidationMiddleware,
    validatePostExistsMiddleware,
    contentValidation,
    inputValidationResultMiddleware,
    createCommentHandler
  )
  .get(
    '/:id/comments',
    idValidationMiddleware,
    validatePostExistsMiddleware,
    paginationAndSortingValidation(commentSortField),
    inputValidationResultMiddleware,
    getCommentListHandler
  )
