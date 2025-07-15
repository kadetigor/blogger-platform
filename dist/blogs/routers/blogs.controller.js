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
exports.BlogsController = void 0;
const inversify_1 = require("inversify");
const blogs_repository_1 = require("../repositories/blogs.repository");
const blogs_service_1 = require("../application/blogs.service");
const blogs_query_repository_1 = require("../repositories/blogs.query-repository");
const errorsHandler_1 = require("../../core/errors/errorsHandler");
const httpStatus_1 = require("../../core/types/httpStatus");
const map_to_blog_output_1 = require("./mappers/map.to.blog.output");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const map_to_blog_list_paginated_output_1 = require("./mappers/map.to.blog.list.paginated.output");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const posts_query_repository_1 = require("../../posts/repositories/posts.query-repository");
const map_to_post_list_paginated_output_1 = require("./mappers/map.to.post.list.paginated.output");
let BlogsController = class BlogsController {
    constructor(blogsRepository, blogsQueryRepository, blogsService, postsQueryRepository) {
        this.blogsRepository = blogsRepository;
        this.blogsQueryRepository = blogsQueryRepository;
        this.blogsService = blogsService;
        this.postsQueryRepository = postsQueryRepository;
    }
    createBlogHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdBlogId = yield this.blogsService.create(req.body);
                const createdBlog = yield this.blogsRepository.findByIdOrFail(createdBlogId);
                const blogOutput = (0, map_to_blog_output_1.mapToBlogOutput)(createdBlog);
                res.status(httpStatus_1.HttpStatus.Created).send(blogOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    deleteBlogHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.blogsService.delete(id);
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getBlogHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const blog = yield this.blogsQueryRepository.findByIdOrFail(id);
                const blogOutput = (0, map_to_blog_output_1.mapToBlogOutput)(blog);
                res.status(httpStatus_1.HttpStatus.Ok).send(blogOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getBlogListHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryInput = {
                    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageNumber,
                    pageSize: req.query.pageSize ? Number(req.query.pageSize) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageSize,
                    sortBy: req.query.sortBy || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortBy,
                    sortDirection: req.query.sortDirection || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortDirection,
                    searchNameTerm: typeof req.query.searchNameTerm === "string" ? req.query.searchNameTerm.trim() : ""
                };
                const { items, totalCount } = yield this.blogsQueryRepository.findMany(queryInput);
                const blogsListOutput = (0, map_to_blog_list_paginated_output_1.mapToBlogListPaginatedOutput)(items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                });
                res.send(blogsListOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getBlogPostsListHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = req.params.id;
                const blog = yield this.blogsQueryRepository.findByIdOrFail(blogId);
                if (!blog) {
                    throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not exist');
                }
                const queryInput = {
                    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageNumber,
                    pageSize: req.query.pageSize ? Number(req.query.pageSize) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageSize,
                    sortBy: req.query.sortBy || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortBy,
                    sortDirection: req.query.sortDirection || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortDirection
                };
                const { items, totalCount } = yield this.postsQueryRepository.findPostsbyBlog(queryInput, blogId);
                const postListOutput = (0, map_to_post_list_paginated_output_1.mapToPostListPaginatedOutput)(items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                });
                res.send(postListOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    updateBlogHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.blogsService.update(id, req.body);
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
};
exports.BlogsController = BlogsController;
exports.BlogsController = BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __param(1, (0, inversify_1.inject)(blogs_query_repository_1.BlogsQueryRepository)),
    __param(2, (0, inversify_1.inject)(blogs_service_1.BlogsService)),
    __param(3, (0, inversify_1.inject)(posts_query_repository_1.PostsQueryRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        blogs_query_repository_1.BlogsQueryRepository,
        blogs_service_1.BlogsService,
        posts_query_repository_1.PostsQueryRepository])
], BlogsController);
