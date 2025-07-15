"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.PostsService = void 0;
const posts_repository_1 = require("../repositories/posts.repository");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
const inversify_1 = require("inversify");
const post_likes_repository_1 = require("../repositories/post.likes.repository");
let PostsService = class PostsService {
    constructor(postsRepository, postsLikeRepository, blogsRepository) {
        this.postsRepository = postsRepository;
        this.postsLikeRepository = postsLikeRepository;
        this.blogsRepository = blogsRepository;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsRepository.findByIdOrFail(dto.blogId);
            const newPost = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId,
                blogName: blog.name,
                createdAt: new Date(),
            };
            return this.postsRepository.create(newPost);
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postsRepository.update(id, dto);
            return;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postsRepository.delete(id);
            return;
        });
    }
    updateLikeInfo(postId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postsRepository.findByIdOrFail(postId);
            yield this.postsLikeRepository.setLikeStatus(postId, userId, status);
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_repository_1.PostsRepository)),
    __param(1, (0, inversify_1.inject)(post_likes_repository_1.PostLikeRepository)),
    __param(2, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __metadata("design:paramtypes", [posts_repository_1.PostsRepository,
        post_likes_repository_1.PostLikeRepository,
        blogs_repository_1.BlogsRepository])
], PostsService);
