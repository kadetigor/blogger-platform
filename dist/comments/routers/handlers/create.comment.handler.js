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
exports.createCommentHandler = createCommentHandler;
const comments_service_1 = require("../../application/comments.service");
const comments_repository_1 = require("../../repositories/comments.repository");
const map_to_comment_view_model_1 = require("../mappers/map.to.comment.view.model");
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
function createCommentHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postId = req.params.id; // Get postId from URL params
            const { content } = req.body;
            const user = req.user; // This should be populated by accessTokenGuard
            if (!user) {
                res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
                return;
            }
            const createdCommentId = yield comments_service_1.commentsService.create({
                content,
                userId: user.id,
                userLogin: user.login,
                postId
            });
            const createdComment = yield comments_repository_1.commentsRepository.findByIdOrFail(createdCommentId);
            const commentViewModel = (0, map_to_comment_view_model_1.mapToCommentViewModel)(createdComment);
            res.status(httpStatus_1.HttpStatus.Created).send(commentViewModel);
        }
        catch (e) {
            return (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
