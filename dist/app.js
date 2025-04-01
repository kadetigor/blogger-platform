"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const blogsRouter_1 = require("./blogs/routers/blogsRouter");
const postsRouter_1 = require("./posts/routers/postsRouter");
const testingRouter_1 = require("./testing/routers/testingRouter");
const paths_1 = require("./core/paths/paths");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.get('/', (req, res) => {
    res.status(200).send('Hello my blogger-platform');
});
exports.app.use(paths_1.POSTS_PATH, postsRouter_1.postsRouter);
exports.app.use(paths_1.BLOGS_PATH, blogsRouter_1.blogsRouter);
exports.app.use(paths_1.TESTING_PATH, testingRouter_1.testingRouter);
