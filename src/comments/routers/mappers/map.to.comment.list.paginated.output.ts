import { WithId } from "mongodb";
import { Comment } from "../../../comments/domain/comment";
import { commentListPaginatedOutput } from "../output/comment.list.paginated.output";

export function mapToCommentListPaginatedOutput(
  comments: WithId<Comment>[],
  likesInfoMap: Map<string, { likesCount: number; dislikesCount: number; myStatus: "None" | "Like" | "Dislike" }>,
  meta: { pageNumber: number; pageSize: number; totalCount: number; },
): commentListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: comments.map((comment) => {
      const likesInfo = likesInfoMap.get(comment._id.toString()) || {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None" as const
      };
      
      return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo
      };
    }),
  };
};