"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const userSortField_1 = require("./input/userSortField");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
const userInputDtoValidation_1 = require("./middleware/userInputDtoValidation");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const getUserListHandler_1 = require("./handlers/getUserListHandler");
const createUserHandler_1 = require("./handlers/createUserHandler");
const deleteUserHandler_1 = require("./handlers/deleteUserHandler");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter
    .get('/', super_admin_guard_middleware_1.superAdminGuardMiddleware, (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(userSortField_1.userSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, getUserListHandler_1.getUserListHandler)
    .post('/', super_admin_guard_middleware_1.superAdminGuardMiddleware, userInputDtoValidation_1.userInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, createUserHandler_1.createUserHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, deleteUserHandler_1.deleteUserHandler);
