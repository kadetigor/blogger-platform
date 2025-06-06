import { WithId } from "mongodb";
import { Comment } from "../../../comments/domain/comment";
import { commentListPaginatedOutput } from "../output/comment.list.paginated.output";

export function mapToCommentListPaginatedOutput(
  comment: WithId<Comment>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number; },
): commentListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: comment.map((comment) => ({
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: [{
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      }],
      createdAt: comment.createdAt,
    })),
  };
};