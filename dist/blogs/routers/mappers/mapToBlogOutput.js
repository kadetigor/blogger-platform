"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogOutput = mapToBlogOutput;
const resourceType_1 = require("../../../core/types/resourceType");
function mapToBlogOutput(blog) {
    return {
        data: {
            type: resourceType_1.resourceType.Blogs,
            id: blog._id.toString(),
            attributes: {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            },
        },
    };
}
