import { Router } from 'express';
import { idValidationMiddleware } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { accessTokenGuard } from '../../auth/routers/guards/access.token.guard';
import { getCommentHandler } from './handlers/get.comment.handler';
import { deleteCommentHandler } from './handlers/delete.comment.handler';

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
        idValidationMiddleware,
        inputValidationResultMiddleware,
        deleteCommentHandler
    )
    .put('/:commentId')