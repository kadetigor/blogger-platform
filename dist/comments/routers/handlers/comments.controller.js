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
exports.CommentsController = void 0;
const inversify_1 = require("inversify");
const comments_service_1 = require("../../application/comments.service");
const comments_repository_1 = require("../../repositories/comments.repository");
const map_to_comment_view_model_1 = require("../mappers/map.to.comment.view.model");
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const comments_query_repository_1 = require("../../repositories/comments.query.repository");
const setDefaultSortAndPagination_1 = require("../../../core/helpers/setDefaultSortAndPagination");
const map_to_comment_list_paginated_output_1 = require("../mappers/map.to.comment.list.paginated.output");
let CommentsController = class CommentsController {
    constructor(commentsService, commentsRepository, commentsQueryRepository) {
        this.commentsService = commentsService;
        this.commentsRepository = commentsRepository;
        this.commentsQueryRepository = commentsQueryRepository;
    }
    createCommentHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id; // Get postId from URL params
                const { content } = req.body;
                const user = req.user; // This should be populated by accessTokenGuard
                if (!user) {
                    res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
                    return;
                }
                const createdCommentId = yield this.commentsService.create({
                    content,
                    userId: user.id,
                    userLogin: user.login,
                    postId
                });
                const createdComment = yield this.commentsRepository.findByIdOrFail(createdCommentId);
                const commentViewModel = (0, map_to_comment_view_model_1.mapToCommentViewModel)(createdComment);
                res.status(httpStatus_1.HttpStatus.Created).send(commentViewModel);
            }
            catch (e) {
                return (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    deleteCommentHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = req.params.commentId;
                const user = req.user;
                if (!user) {
                    res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
                    return;
                }
                // Check if comment exists and user is the owner
                const comment = yield this.commentsQueryRepository.findByIdOrFail(commentId);
                if (comment.commentatorInfo.userId !== user.id) {
                    res.sendStatus(httpStatus_1.HttpStatus.Forbidden);
                    return;
                }
                yield this.commentsService.delete(commentId);
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getCommentHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const comment = yield this.commentsQueryRepository.findByIdOrFail(id);
                const commentViewModel = (0, map_to_comment_view_model_1.mapToCommentViewModel)(comment);
                res.status(httpStatus_1.HttpStatus.Ok).send(commentViewModel);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getCommentListHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id; // Get postId from URL params
                const baseQueryInput = (0, setDefaultSortAndPagination_1.setDefaultSortAndPaginationIfNotExist)(req.query);
                const queryInput = {
                    pageNumber: baseQueryInput.pageNumber,
                    pageSize: baseQueryInput.pageSize,
                    sortBy: baseQueryInput.sortBy,
                    sortDirection: baseQueryInput.sortDirection
                };
                const { items, totalCount } = yield this.commentsQueryRepository.findCommentsByPost(queryInput, postId);
                const commentsListOutput = (0, map_to_comment_list_paginated_output_1.mapToCommentListPaginatedOutput)(items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                });
                res.send(commentsListOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    updateCommentHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = req.params.commentId;
                const { content } = req.body;
                const user = req.user;
                if (!user) {
                    res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
                    return;
                }
                // Check if comment exists and user is the owner
                const comment = yield this.commentsQueryRepository.findByIdOrFail(commentId);
                if (comment.commentatorInfo.userId !== user.id) {
                    res.sendStatus(httpStatus_1.HttpStatus.Forbidden);
                    return;
                }
                yield this.commentsService.update(commentId, { content });
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
};
exports.CommentsController = CommentsController;
exports.CommentsController = CommentsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_service_1.CommentsService)),
    __param(1, (0, inversify_1.inject)(comments_repository_1.CommentsRepository)),
    __param(2, (0, inversify_1.inject)(comments_query_repository_1.commentsQueryRepository)),
    __metadata("design:paramtypes", [comments_service_1.CommentsService,
        comments_repository_1.CommentsRepository,
        comments_query_repository_1.commentsQueryRepository])
], CommentsController);
