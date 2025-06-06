"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const access_token_guard_1 = require("../../auth/routers/guards/access.token.guard");
const get_comment_handler_1 = require("./handlers/get.comment.handler");
const delete_comment_handler_1 = require("./handlers/delete.comment.handler");
const update_comment_handler_1 = require("./handlers/update.comment.handler");
const comment_input_dto_validation_1 = require("./validation/comment.input.dto.validation");
const comment_id_validation_1 = require("./validation/comment.id.validation");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter
    .get('/:id', params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, get_comment_handler_1.getCommentHandler)
    .delete('/:commentId', access_token_guard_1.accessTokenGuard, comment_id_validation_1.commentIdValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, delete_comment_handler_1.deleteCommentHandler)
    .put('/:commentId', access_token_guard_1.accessTokenGuard, comment_id_validation_1.commentIdValidationMiddleware, comment_input_dto_validation_1.contentValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, update_comment_handler_1.updateCommentHandler);
