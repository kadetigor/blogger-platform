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
exports.PostsController = void 0;
const inversify_1 = require("inversify");
const posts_repository_1 = require("../../repositories/posts.repository");
const posts_service_1 = require("../../application/posts.service");
const post_likes_repository_1 = require("../../repositories/post.likes.repository");
const posts_query_repository_1 = require("../../repositories/posts.query-repository");
const mapToPostViewModel_1 = require("../mappers/mapToPostViewModel");
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const setDefaultSortAndPagination_1 = require("../../../core/helpers/setDefaultSortAndPagination");
const mapToPostListPaginatedOutput_1 = require("../../../blogs/routers/mappers/mapToPostListPaginatedOutput");
let PostsController = class PostsController {
    constructor(postsRepository, postsQueryRepository, postsService, postsLikeRepository) {
        this.postsRepository = postsRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.postsService = postsService;
        this.postsLikeRepository = postsLikeRepository;
    }
    createPostHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.body.blogId;
            try {
                const createdPostId = yield this.postsService.create(Object.assign(Object.assign({}, req.body), { blogId }));
                const createdPost = yield this.postsRepository.findByIdOrFail(createdPostId);
                const postViewModel = (0, mapToPostViewModel_1.mapToPostViewModel)(createdPost);
                res.status(httpStatus_1.HttpStatus.Created).send(postViewModel);
            }
            catch (e) {
                return (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    deletePostHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.postsRepository.delete(id);
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getPostHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const post = yield this.postsQueryRepository.findByIdOrFail(id);
                const postViewModel = (0, mapToPostViewModel_1.mapToPostViewModel)(post);
                res.status(httpStatus_1.HttpStatus.Ok).send(postViewModel);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getPostListHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const baseQueryInput = (0, setDefaultSortAndPagination_1.setDefaultSortAndPaginationIfNotExist)(req.query);
                const queryInput = {
                    pageNumber: baseQueryInput.pageNumber,
                    pageSize: baseQueryInput.pageSize,
                    sortBy: baseQueryInput.sortBy,
                    sortDirection: baseQueryInput.sortDirection
                };
                const { items, totalCount } = yield this.postsQueryRepository.findMany(queryInput);
                const postsListOutput = (0, mapToPostListPaginatedOutput_1.mapToPostListPaginatedOutput)(items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                });
                res.send(postsListOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    updatePostHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('got to updatePostHandler');
            try {
                const id = req.params.id;
                yield this.postsService.update(id, req.body);
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
};
exports.PostsController = PostsController;
exports.PostsController = PostsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_repository_1.PostsRepository)),
    __param(1, (0, inversify_1.inject)(posts_query_repository_1.PostsQueryRepository)),
    __param(2, (0, inversify_1.inject)(posts_service_1.PostsService)),
    __param(3, (0, inversify_1.inject)(post_likes_repository_1.PostLikeRepository)),
    __metadata("design:paramtypes", [posts_repository_1.PostsRepository,
        posts_query_repository_1.PostsQueryRepository,
        posts_service_1.PostsService,
        post_likes_repository_1.PostLikeRepository])
], PostsController);
