"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostListPaginatedOutput = mapToPostListPaginatedOutput;
const resourceType_1 = require("../../../core/types/resourceType");
function mapToPostListPaginatedOutput(posts, meta) {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
            totalCount: meta.totalCount,
        },
        data: posts.map((post) => ({
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
        })),
    };
}
;
