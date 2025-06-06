import { Router } from 'express';
import { postInputDtoValidation } from "./postInputDtoValidationMiddleware";
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
    contentValidation,
    inputValidationResultMiddleware,
    createCommentHandler
  )
  .get(
    '/:id/comments',
    idValidationMiddleware,
    inputValidationResultMiddleware,
    getCommentListHandler
  )
