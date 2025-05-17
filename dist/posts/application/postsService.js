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
exports.postsService = void 0;
const postsRepository_1 = require("../repositories/postsRepository");
const blogsRepository_1 = require("../../blogs/repositories/blogsRepository");
exports.postsService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return postsRepository_1.postsRepository.findMany(queryDto);
        });
    },
    findPostsbyBlog(queryDto, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`got to findPostsbyBlog`);
            yield blogsRepository_1.blogsRepository.findByIdOrFail(blogId);
            console.log(`recieved ${blogId} at findPostsbyBlog`);
            return postsRepository_1.postsRepository.findPostsbyBlog(queryDto, blogId);
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return postsRepository_1.postsRepository.findByIdOrFail(id);
        });
    },
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsRepository_1.blogsRepository.findByIdOrFail(dto.blogId);
            const newPost = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId,
                blogName: blog.name,
                createdAt: new Date(),
            };
            return postsRepository_1.postsRepository.create(newPost);
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postsRepository_1.postsRepository.update(id, dto);
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postsRepository_1.postsRepository.delete(id);
            return;
        });
    },
};
