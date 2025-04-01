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
const blogInputDtoValidationMiddleware_1 = require("../validation/blogInputDtoValidationMiddleware");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter
    .get('/', getBlogListHandler_1.getBlogsListHandler) // blogsController.getBlogs
    .get('/:id', params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, getBlogHandler_1.getBlogHandler)
    .post('/', super_admin_guard_middleware_1.superAdminGuardMiddleware, blogInputDtoValidationMiddleware_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, createBlogHandler_1.createBlogHandler)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, blogInputDtoValidationMiddleware_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, updateBlogHandler_1.updateBlogHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, deleteBlogHandler_1.deleteBlogHandler);
