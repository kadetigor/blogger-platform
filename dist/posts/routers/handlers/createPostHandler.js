"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = createPostHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const blogsRepository_1 = require("../../../blogs/repositories/blogsRepository");
const postsRepository_1 = require("../../repositories/postsRepository");
const mapToPostViewModel_1 = require("../mappers/mapToPostViewModel");
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogName = yield blogsRepository_1.blogsRepository.getBlogName(req.body.blogId);
            const newPost = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
                blogName: blogName,
                createdAt: new Date,
            };
            const createdPost = yield postsRepository_1.postsRepository.create(newPost);
            const postViewModel = (0, mapToPostViewModel_1.mapToPostViewModel)(createdPost);
            res.status(httpStatus_1.HttpStatus.Created).send(postViewModel);
        }
        catch (e) {
            res.status(httpStatus_1.HttpStatus.InternalServerError);
        }
    });
}
