"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const getBlogHandler_1 = require("./handlers/getBlogHandler");
const createBlogHandler_1 = require("./handlers/createBlogHandler");
const deleteBlogHandler_1 = require("./handlers/deleteBlogHandler");
const getBlogListHandler_1 = require("./handlers/getBlogListHandler");
const updateBlogHandler_1 = require("./handlers/updateBlogHandler");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const blogInputDtoValidationMiddleware_1 = require("./blogInputDtoValidationMiddleware");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const postSortField_1 = require("../../posts/routers/input/postSortField");
const getBlogPostsListHandler_1 = require("../../posts/routers/handlers/getBlogPostsListHandler");
const postInputDtoValidationMiddleware_1 = require("../../posts/routers/postInputDtoValidationMiddleware");
const createPostHandler_1 = require("../../posts/routers/handlers/createPostHandler");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter
    .get('/', getBlogListHandler_1.getBlogListHandler) // blogsController.getBlogs
    .get('/:id', params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, getBlogHandler_1.getBlogHandler)
    .post('/', super_admin_guard_middleware_1.superAdminGuardMiddleware, blogInputDtoValidationMiddleware_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, createBlogHandler_1.createBlogHandler)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, blogInputDtoValidationMiddleware_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, updateBlogHandler_1.updateBlogHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, deleteBlogHandler_1.deleteBlogHandler)
    .get('/:id/posts', params_id_validation_middleware_1.idValidationMiddleware, (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(postSortField_1.postSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, getBlogPostsListHandler_1.getBlogPostsListHandler)
    .post('/:id/posts', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, postInputDtoValidationMiddleware_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, createPostHandler_1.createPostHandler);
