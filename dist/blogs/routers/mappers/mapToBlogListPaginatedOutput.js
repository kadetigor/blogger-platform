"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogListPaginatedOutput = mapToBlogListPaginatedOutput;
function mapToBlogListPaginatedOutput(blogs, meta) {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: blogs.map((blog) => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        })),
    };
}
