"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCommentOutput = mapToCommentOutput;
const resourceType_1 = require("../../../core/types/resourceType");
function mapToCommentOutput(comment, likesInfo) {
    return {
        data: {
            type: resourceType_1.resourceType.Comments,
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
