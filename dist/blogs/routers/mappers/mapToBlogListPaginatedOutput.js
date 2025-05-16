"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogListPaginatedOutput = mapToBlogListPaginatedOutput;
const resourceType_1 = require("../../../core/types/resourceType");
function mapToBlogListPaginatedOutput(blogs, meta) {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
            totalCount: meta.totalCount,
        },
        data: blogs.map((blog) => ({
            type: resourceType_1.resourceType.Blogs,
            id: blog._id.toString(),
            attributes: {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            },
        })),
    };
}
