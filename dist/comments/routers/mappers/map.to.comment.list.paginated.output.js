"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCommentListPaginatedOutput = mapToCommentListPaginatedOutput;
function mapToCommentListPaginatedOutput(comments, meta) {
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: comments.map((comment) => ({
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
        })),
    };
}
;
