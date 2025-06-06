import { WithId } from 'mongodb';
import { Comment } from '../../domain/comment';
import { commentViewModel } from '../../types/comment.view.model';

export function mapToCommentViewModel(comment: WithId<Comment>): commentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin
    },
    createdAt: comment.createdAt,
  };
}