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
exports.updateCommentHandler = updateCommentHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const comments_service_1 = require("../../application/comments.service");
const comments_query_repository_1 = require("../../repositories/comments.query.repository");
function updateCommentHandler(req, res) {
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
            const comment = yield comments_query_repository_1.commentsQueryRepository.findByIdOrFail(commentId);
            if (comment.commentatorInfo.userId !== user.id) {
                res.sendStatus(httpStatus_1.HttpStatus.Forbidden);
                return;
            }
            yield comments_service_1.commentsService.update(commentId, { content });
            res.sendStatus(httpStatus_1.HttpStatus.NoContent);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
