"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const postInputDtoValidationMiddleware_1 = require("./validation/postInputDtoValidationMiddleware");
const updatePostHandler_1 = require("./handlers/updatePostHandler");
const createPostHandler_1 = require("./handlers/createPostHandler");
const getPostHandler_1 = require("./handlers/getPostHandler");
const getPostListHandler_1 = require("./handlers/getPostListHandler");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const basic_guard_middleware_1 = require("../../auth/routers/guards/basic.guard.middleware");
const deletePostHandler_1 = require("./handlers/deletePostHandler");
const postSortField_1 = require("./input/postSortField");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const access_token_guard_1 = require("../../auth/routers/guards/access.token.guard");
const comment_input_dto_validation_1 = require("../../comments/routers/validation/comment.input.dto.validation");
const create_comment_handler_1 = require("../../comments/routers/handlers/create.comment.handler");
const get_comment_list_handler_1 = require("../../comments/routers/handlers/get.comment.list.handler");
const post_exists_validation_1 = require("./validation/post.exists.validation");
const comment_sort_field_1 = require("../../comments/routers/input/comment.sort.field");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('/', (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(postSortField_1.postSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, getPostListHandler_1.getPostListHandler)
    .get('/:id', params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, getPostHandler_1.getPostHandler)
    .post('/', basic_guard_middleware_1.superAdminGuardMiddleware, postInputDtoValidationMiddleware_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, createPostHandler_1.createPostHandler)
    .put('/:id', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, postInputDtoValidationMiddleware_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, updatePostHandler_1.updatePostHandler)
    .delete('/:id', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, deletePostHandler_1.deletePostHandler)
    .post('/:id/comments', access_token_guard_1.accessTokenGuard, params_id_validation_middleware_1.idValidationMiddleware, post_exists_validation_1.validatePostExistsMiddleware, comment_input_dto_validation_1.contentValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, create_comment_handler_1.createCommentHandler)
    .get('/:id/comments', params_id_validation_middleware_1.idValidationMiddleware, post_exists_validation_1.validatePostExistsMiddleware, (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(comment_sort_field_1.commentSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, get_comment_list_handler_1.getCommentListHandler);
