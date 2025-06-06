import { Request, Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { commentsRepository } from '../../repositories/comments.repository';
import { mapToCommentViewModel } from '../mappers/map.to.comment.view.model';
import { HttpStatus } from '../../../core/types/httpStatus';
import { errorsHandler } from '../../../core/errors/errorsHandler';

export async function createCommentHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const postId = req.params.id; // Get postId from URL params
        const { content } = req.body;
        const user = req.user; // This should be populated by accessTokenGuard

        if (!user) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }

        const createdCommentId = await commentsService.create({
            content,
            userId: user.id,
            userLogin: user.login,
            postId
        });

        const createdComment = await commentsRepository.findByIdOrFail(createdCommentId);
        const commentViewModel = mapToCommentViewModel(createdComment);

        res.status(HttpStatus.Created).send(commentViewModel);
    } catch (e: unknown) {
        return errorsHandler(e, res);
    }
}