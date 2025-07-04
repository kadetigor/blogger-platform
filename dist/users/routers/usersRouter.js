"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
require("reflect-metadata");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const userSortField_1 = require("./input/userSortField");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const basic_guard_middleware_1 = require("../../auth/routers/guards/basic.guard.middleware");
const userInputDtoValidation_1 = require("./middleware/userInputDtoValidation");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const composition_root_1 = require("../../composition-root");
const users_controller_1 = require("./users.controller");
const usersController = composition_root_1.container.get(users_controller_1.UsersController);
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter
    .get('/', basic_guard_middleware_1.superAdminGuardMiddleware, (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(userSortField_1.userSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, usersController.getUserListHandler.bind(usersController) // getUserListHandler
)
    .post('/', basic_guard_middleware_1.superAdminGuardMiddleware, userInputDtoValidation_1.userInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, usersController.createUserHandler.bind(usersController) // createUserHandler
)
    .delete('/:id', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, usersController.deleteUserHandler.bind(usersController) // deleteUserHandler
);
