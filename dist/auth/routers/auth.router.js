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
const login_user_handler_1 = require("./handlers/login.user.handler");
const access_token_guard_1 = require("./guards/access.token.guard");
const httpStatus_1 = require("../../core/types/httpStatus");
const usersQueryRepository_1 = require("../../users/repositories/usersQueryRepository");
const userInputDtoValidation_1 = require("../../users/routers/middleware/userInputDtoValidation");
const register_new_user_handler_1 = require("./handlers/register.new.user.handler");
const confirm_email_handler_1 = require("./handlers/confirm.email.handler");
const resend_email_confirm_email_handler_1 = require("./handlers/resend.email.confirm.email.handler");
const refresh_token_handler_1 = require("./handlers/refresh.token.handler");
const logout_handler_1 = require("./handlers/logout.handler");
const refresh_token_guard_1 = require("./guards/refresh.token.guard");
const rate_limiter_middleware_1 = require("../../core/middlewares/rate.limiter.middleware");
const authRateLimit = (0, rate_limiter_middleware_1.createRateLimitMiddleware)(5, 10 * 1000);
exports.authRouter = (0, express_1.Router)();
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .exists().withMessage('email')
    .isString().withMessage('loginOrEmail should be a string')
    .trim().notEmpty().withMessage('loginOrEmail should not be empty');
const passwordValidation = (0, express_validator_1.body)('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password should be a string')
    .trim().notEmpty().withMessage('Password should not be empty');
exports.authRouter.post('/login', authRateLimit, [
    loginOrEmailValidation,
    passwordValidation,
], input_validtion_result_middleware_1.inputValidationResultMiddleware, login_user_handler_1.loginHandler);
exports.authRouter.get('/me', access_token_guard_1.accessTokenGuard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
        return;
    }
    try {
        const user = yield usersQueryRepository_1.usersQueryRepository.findByIdOrFail(userId);
        // Return only the required fields: userId, login, email
        const meResponse = {
            userId: user._id.toString(),
            login: user.login,
            email: user.email
        };
        res.status(httpStatus_1.HttpStatus.Ok).send(meResponse);
    }
    catch (error) {
        res.sendStatus(httpStatus_1.HttpStatus.NotFound);
    }
}));
exports.authRouter.post('/registration', authRateLimit, userInputDtoValidation_1.userInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, register_new_user_handler_1.registrationHandler);
exports.authRouter.post('/registration-confirmation', authRateLimit, (0, express_validator_1.body)('code')
    .exists().withMessage('Code is required')
    .isString().withMessage('Code must be a string')
    .trim().notEmpty().withMessage('Code cannot be empty'), input_validtion_result_middleware_1.inputValidationResultMiddleware, confirm_email_handler_1.confirmEmailHandler);
exports.authRouter.post('/registration-email-resending', authRateLimit, (0, express_validator_1.body)('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .trim(), input_validtion_result_middleware_1.inputValidationResultMiddleware, resend_email_confirm_email_handler_1.resendConfirmEmailHandler);
exports.authRouter.post('/refresh-token', refresh_token_guard_1.refreshTokenGuard, refresh_token_handler_1.refreshTokenHandler);
exports.authRouter.post('/logout', refresh_token_guard_1.refreshTokenGuard, logout_handler_1.logoutHandler);
