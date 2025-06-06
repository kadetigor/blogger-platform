import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { commentsService } from '../../application/comments.service';
import { commentsQueryRepository } from '../../repositories/comments.query.repository';

export async function updateCommentHandler(
  req: Request<{ commentId: string }>,
  res: Response,
) {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const user = req.user;

    if (!user) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    // Check if comment exists and user is the owner
    const comment = await commentsQueryRepository.findByIdOrFail(commentId);
    
    if (comment.commentatorInfo.userId !== user.id) {
      res.sendStatus(HttpStatus.Forbidden);
      return;
    }

    await commentsService.update(commentId, { content });
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}