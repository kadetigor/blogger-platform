"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsListHandler = getBlogsListHandler;
const blogsRepository_1 = require("../../repositories/blogsRepository");
function getBlogsListHandler(req, res) {
    const blogs = blogsRepository_1.blogsRepository.findAll();
    res.send(blogs);
}
