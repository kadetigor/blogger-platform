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
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const create_new_user_handler_1 = require("./handlers/create.new.user.handler");
const access_token_guard_1 = require("./guards/access.token.guard");
const httpStatus_1 = require("../../core/types/httpStatus");
const usersQueryRepository_1 = require("../../users/repositories/usersQueryRepository");
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
exports.authRouter.get('/me', access_token_guard_1.accessTokenGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
        return;
    }
    const me = yield usersQueryRepository_1.usersQueryRepository.findByIdOrFail(userId);
    res.status(httpStatus_1.HttpStatus.Ok).send(me);
    return;
}));
