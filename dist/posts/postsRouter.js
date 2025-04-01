"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsController = exports.postsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.postsRouter = (0, express_1.Router)();
exports.postsController = {
    getPosts: (req, res) => {
        const posts = db_1.db.posts;
        res.send(db_1.db.posts);
    }
};
exports.postsRouter
    .get('/posts')
    .get('/posts/:id')
    .post('/posts')
    .put('/posts/:id');
