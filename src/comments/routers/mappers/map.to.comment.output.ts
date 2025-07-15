import { WithId } from "mongodb";
import { Comment } from '../../domain/comment';
import { resourceType } from "../../../core/types/resourceType";
import { commentOutput } from "../output/comment.output";

export function mapToCommentOutput(comment: WithId<Comment>, likesInfo: {
  likesCount: number;
  dislikesCount: number;
  myStatus: "None" | "Like" | "Dislike";
}): commentOutput {
  return {
    data: {
      type: resourceType.Comments,
      id: comment._id.toString(),
      attributes: {
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: likesInfo
      },
    },
  };
}