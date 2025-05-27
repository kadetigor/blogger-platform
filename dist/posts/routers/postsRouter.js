"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const postInputDtoValidationMiddleware_1 = require("./postInputDtoValidationMiddleware");
const updatePostHandler_1 = require("./handlers/updatePostHandler");
const createPostHandler_1 = require("./handlers/createPostHandler");
const getPostHandler_1 = require("./handlers/getPostHandler");
const getPostListHandler_1 = require("./handlers/getPostListHandler");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const deletePostHandler_1 = require("./handlers/deletePostHandler");
const postSortField_1 = require("./input/postSortField");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('/', (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(postSortField_1.postSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, getPostListHandler_1.getPostListHandler)
    .get('/:id', params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, getPostHandler_1.getPostHandler)
    .post('/', super_admin_guard_middleware_1.superAdminGuardMiddleware, postInputDtoValidationMiddleware_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, createPostHandler_1.createPostHandler)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, postInputDtoValidationMiddleware_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, updatePostHandler_1.updatePostHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, deletePostHandler_1.deletePostHandler);
