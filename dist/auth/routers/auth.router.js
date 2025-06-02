"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userInputDtoValidation_1 = require("../../users/routers/middleware/userInputDtoValidation");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const login_or_email_validation_1 = require("../../users/routers/middleware/login.or.email.validation");
const create_new_user_handler_1 = require("./handlers/create.new.user.handler");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/', [
    (0, express_validator_1.body)('loginOrEmail').custom(login_or_email_validation_1.loginOrEmailValidator),
    userInputDtoValidation_1.passwordValidation,
], input_validtion_result_middleware_1.inputValidationResultMiddleware, create_new_user_handler_1.createNewUserHandler);
