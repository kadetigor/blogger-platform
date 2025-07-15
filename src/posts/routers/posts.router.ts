import { Router } from 'express';
import { postInputDtoValidation } from "./validation/postInputDtoValidationMiddleware";
import { idValidationMiddleware } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from "../../auth/routers/guards/basic.guard.middleware";
import { postSortField } from './input/postSortField';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/queryPaginationSortingValidationMiddleware';
import { accessTokenGuard } from '../../auth/routers/guards/access.token.guard';
import { optionalAccessTokenGuard } from '../../auth/routers/guards/optional.access.token.guard';
import { contentValidation } from '../../comments/routers/validation/comment.input.dto.validation';
import { validatePostExistsMiddleware } from './validation/post.exists.validation';
import { commentSortField } from '../../comments/routers/input/comment.sort.field';
import { container } from '../../composition-root';
import { CommentsController } from '../../comments/routers/comments.controller';
import { PostsController } from './posts.controller';

const postsController = container.get(PostsController)
const commentsController = container.get(CommentsController)

export const postsRouter = Router({})

postsRouter
  .get(
    '/',
    paginationAndSortingValidation(postSortField),
    inputValidationResultMiddleware,
    postsController.getPostListHandler.bind(postsController)//getPostListHandler
  )
  .get(
    '/:id',
    idValidationMiddleware,
    inputValidationResultMiddleware,
    postsController.getPostHandler.bind(postsController)//getPostHandler
  )
  .post(
    '/',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.createPostHandler.bind(postsController)//createPostHandler
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidationMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.updatePostHandler.bind(postsController)//updatePostHandler
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidationMiddleware,
    inputValidationResultMiddleware,
    postsController.deletePostHandler.bind(postsController)//deletePostHandler
  )
  .post(
    '/:id/comments',
    accessTokenGuard,
    idValidationMiddleware,
    validatePostExistsMiddleware,
    contentValidation,
    inputValidationResultMiddleware,
    commentsController.createCommentHandler.bind(commentsController)//createCommentHandler
  )
  .get(
    '/:id/comments',
    optionalAccessTokenGuard,
    idValidationMiddleware,
    validatePostExistsMiddleware,
    paginationAndSortingValidation(commentSortField),
    inputValidationResultMiddleware,
    commentsController.getCommentListHandler.bind(commentsController)//getCommentListHandler
  )