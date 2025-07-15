// src/comments/routers/comments.router.ts
import { Router } from 'express';
import { idValidationMiddleware } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { accessTokenGuard } from '../../auth/routers/guards/access.token.guard';
import { contentValidation } from './validation/comment.input.dto.validation';
import { commentIdValidationMiddleware } from './validation/comment.id.validation';
import { container } from '../../composition-root';
import { CommentsController } from './comments.controller';
import { body } from 'express-validator';
import { optionalAccessTokenGuard } from '../../auth/routers/guards/optional.access.token.guard';

const commentsController = container.get(CommentsController)

const likeQueryValidation = body('likeStatus')
    .exists()
    .withMessage('likeStatus is Required')
    .isString()
    .withMessage('likeStatus must be a String')
    .isIn(['None', 'Like', 'Dislike'])
    .withMessage('likeStatus contains invalid value')

export const commentsRouter = Router({})

commentsRouter
    .get(
        '/:id',
        optionalAccessTokenGuard,
        idValidationMiddleware,
        inputValidationResultMiddleware,
        commentsController.getCommentHandler.bind(commentsController) //getCommentHandler,
    )
    .delete(
        '/:commentId',
        accessTokenGuard,
        commentIdValidationMiddleware,
        inputValidationResultMiddleware,
        commentsController.deleteCommentHandler.bind(commentsController)//deleteCommentHandler
    )
    .put(
        '/:commentId',
        accessTokenGuard,
        commentIdValidationMiddleware,
        contentValidation,
        inputValidationResultMiddleware,
        commentsController.updateCommentHandler.bind(commentsController)//updateCommentHandler
    )
    .put(
        '/:commentId/like-status',
        accessTokenGuard,
        commentIdValidationMiddleware,
        likeQueryValidation,
        inputValidationResultMiddleware,
        commentsController.updateLikeHandler.bind(commentsController)
    )