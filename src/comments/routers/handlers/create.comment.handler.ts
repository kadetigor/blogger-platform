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
    const postId = req.body.postId
    try {
        const createdCommentId = await commentsService.create({...req.body, postId});
        const createdComment = await commentsRepository.findByIdOrFail(createdCommentId);
        const commentViewModel = mapToCommentViewModel(createdComment);

        res.status(HttpStatus.Created).send(commentViewModel);
    } catch (e: unknown) {
        return errorsHandler(e, res);
    }
}