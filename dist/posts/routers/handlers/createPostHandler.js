"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = createPostHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../../../blogs/repositories/blogsRepository");
const postsRepository_1 = require("../../repositories/postsRepository");
function createPostHandler(req, res) {
    const blogName = blogsRepository_1.blogsRepository.getBlogName(req.body.blogId);
    const newPost = {
        id: (db_1.db.posts.length ? db_1.db.posts[db_1.db.posts.length - 1].id + 1 : 1).toString(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blogName
    };
    postsRepository_1.postsRepository.create(newPost);
    res.status(httpStatus_1.HttpStatus.Created).send(newPost);
}
