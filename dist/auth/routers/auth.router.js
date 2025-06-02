"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const create_new_user_handler_1 = require("./handlers/create.new.user.handler");
exports.authRouter = (0, express_1.Router)();
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .exists().withMessage('loginOrEmail is required')
    .isString().withMessage('loginOrEmail should be a string')
    .trim().notEmpty().withMessage('loginOrEmail should not be empty');
const passwordValidation = (0, express_validator_1.body)('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password should be a string')
    .trim().notEmpty().withMessage('Password should not be empty');
exports.authRouter.post('/login', [
    loginOrEmailValidation,
    passwordValidation,
], input_validtion_result_middleware_1.inputValidationResultMiddleware, create_new_user_handler_1.loginHandler);
