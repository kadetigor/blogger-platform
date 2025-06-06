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
exports.getCommentHandler = getCommentHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const comments_query_repository_1 = require("../../repositories/comments.query.repository");
const map_to_comment_view_model_1 = require("../mappers/map.to.comment.view.model");
function getCommentHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const comment = yield comments_query_repository_1.commentsQueryRepository.findByIdOrFail(id);
            const commentViewModel = (0, map_to_comment_view_model_1.mapToCommentViewModel)(comment);
            res.status(httpStatus_1.HttpStatus.Ok).send(commentViewModel);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
