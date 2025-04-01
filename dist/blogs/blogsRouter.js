"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = exports.blogsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsController = {
    getBlogs: (req, res) => {
        const blogs = db_1.db.blogs;
        res.send(db_1.db.blogs);
    }
};
exports.blogsRouter
    .get('/blogs', nameValidation, inputValidationResultMiddleware, getBlogsHandler) // blogsController.getBlogs
    .get('/blogs/:id', nameValidation, inputValidationResultMiddleware, getBlogByIdHandler)
    .post('/blogs', exports.blogsController.uploadBlog)
    .put('/blogs/:id', exports.blogsController.updateBlog)
    .delete('/blogs/:id', exports.blogsController.deleteBlogById);
