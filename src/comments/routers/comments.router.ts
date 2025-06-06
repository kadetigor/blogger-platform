import { Router } from 'express';
import { idValidationMiddleware } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { accessTokenGuard } from '../../auth/routers/guards/access.token.guard';
import { getCommentHandler } from './handlers/get.comment.handler';
import { deleteCommentHandler } from './handlers/delete.comment.handler';
import { updateCommentHandler } from './handlers/update.comment.handler';
import { contentValidation } from './validation/comment.input.dto.validation';
import { commentIdValidationMiddleware } from './validation/comment.id.validation';

export const commentsRouter = Router({})

commentsRouter
    .get(
        '/id',
        idValidationMiddleware,
        inputValidationResultMiddleware,
        getCommentHandler,
    )
    .delete(
        '/:commentId',
        accessTokenGuard,
        commentIdValidationMiddleware,
        inputValidationResultMiddleware,
        deleteCommentHandler
    )
    .put(
        '/:commentId',
        accessTokenGuard,
        commentIdValidationMiddleware,
        contentValidation,
        inputValidationResultMiddleware,
        updateCommentHandler
    )