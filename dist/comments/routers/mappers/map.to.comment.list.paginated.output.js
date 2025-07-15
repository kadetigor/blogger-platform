"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCommentListPaginatedOutput = mapToCommentListPaginatedOutput;
function mapToCommentListPaginatedOutput(comments, likesInfoMap, meta) {
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: comments.map((comment) => {
            const likesInfo = likesInfoMap.get(comment._id.toString()) || {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
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
}
;
