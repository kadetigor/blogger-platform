"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostOutput = mapToPostOutput;
const resourceType_1 = require("../../../core/types/resourceType");
function mapToPostOutput(comment) {
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
                createdAt: comment.createdAt
            },
        },
    };
}
