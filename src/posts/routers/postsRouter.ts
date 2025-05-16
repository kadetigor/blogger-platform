import { Router } from 'express';
import { postInputDtoValidation } from "./postInputDtoValidationMiddleware";
import { updatePostHandler } from "./handlers/updatePostHandler";
import { createPostHandler } from "./handlers/createPostHandler";
import { getPostHandler } from "./handlers/getPostHandler"
import { getPostListHandler } from "./handlers/getPostListHandler";
import { idValidationMiddleware } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { deletePostHandler } from "./handlers/deletePostHandler";
import { postSortField } from './input/postSortField';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/queryPaginationSortingValidationMiddleware';

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
