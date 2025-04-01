"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogHandler = createBlogHandler;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../../repositories/blogsRepository");
const httpStatus_1 = require("../../../core/types/httpStatus");
function createBlogHandler(req, res) {
    const newBlog = {
        id: (db_1.db.posts.length ? db_1.db.posts[db_1.db.posts.length - 1].id + 1 : 1).toString(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    };
    blogsRepository_1.blogsRepository.create(newBlog);
    res.status(httpStatus_1.HttpStatus.Created).send(newBlog);
}
