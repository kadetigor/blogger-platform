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
exports.commentsService = void 0;
const comments_repository_1 = require("../repositories/comments.repository");
const postsRepository_1 = require("../../posts/repositories/postsRepository");
exports.commentsService = {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postsRepository_1.postsRepository.findByIdOrFail(dto.blogId);
            const newComment = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId,
                blogName: blog.name,
                createdAt: new Date(),
            };
            return comments_repository_1.commentsRepository.create(newComment);
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield comments_repository_1.commentsRepository.update(id, dto);
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield comments_repository_1.commentsRepository.delete(id);
            return;
        });
    },
};
