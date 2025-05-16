"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostOutput = mapToPostOutput;
const resourceType_1 = require("../../../core/types/resourceType");
function mapToPostOutput(post) {
    return {
        data: {
            type: resourceType_1.resourceType.Posts,
            id: post._id.toString(),
            attributes: {
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            },
        },
    };
}
