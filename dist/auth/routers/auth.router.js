"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
require("reflect-metadata");
const express_validator_1 = require("express-validator");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const access_token_guard_1 = require("./guards/access.token.guard");
const userInputDtoValidation_1 = require("../../users/routers/middleware/userInputDtoValidation");
const refresh_token_guard_1 = require("./guards/refresh.token.guard");
const rate_limiter_middleware_1 = require("../../core/middlewares/rate.limiter.middleware");
const auth_controller_1 = require("./auth.controller");
const composition_root_1 = require("../../composition-root");
const authController = composition_root_1.container.get(auth_controller_1.AuthController);
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
], input_validtion_result_middleware_1.inputValidationResultMiddleware, authController.loginHandler.bind(authController) //loginHandler
);
exports.authRouter.get('/me', access_token_guard_1.accessTokenGuard, authController.getInfoOnCurrentUser.bind(authController));
exports.authRouter.post('/registration', authRateLimit, userInputDtoValidation_1.userInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, authController.registrationHandler.bind(authController) //registrationHandler
);
exports.authRouter.post('/registration-confirmation', authRateLimit, (0, express_validator_1.body)('code')
    .exists().withMessage('Code is required')
    .isString().withMessage('Code must be a string')
    .trim().notEmpty().withMessage('Code cannot be empty'), input_validtion_result_middleware_1.inputValidationResultMiddleware, authController.confirmEmailHandler.bind(authController) //confirmEmailHandler
);
exports.authRouter.post('/registration-email-resending', authRateLimit, (0, express_validator_1.body)('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .trim(), input_validtion_result_middleware_1.inputValidationResultMiddleware, authController.resendConfirmEmailHandler.bind(authController) //resendConfirmEmailHandler
);
exports.authRouter.post('/refresh-token', refresh_token_guard_1.refreshTokenGuard, authController.refreshTokenHandler.bind(authController) //refreshTokenHandler
);
exports.authRouter.post('/logout', refresh_token_guard_1.refreshTokenGuard, authController.logoutHandler.bind(authController) //logoutHandler
);
exports.authRouter.post('/password-recovery', authRateLimit, (0, express_validator_1.body)('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .trim(), input_validtion_result_middleware_1.inputValidationResultMiddleware, authController.passwordRecoveryEmailHandler.bind(authController) //passwordRecoveryEmailHandler
);
exports.authRouter.post(// Used to confirm password recovery
'/new-password', authRateLimit, (0, express_validator_1.body)('newPassword')
    .exists().withMessage('New Password is required')
    .isString().withMessage('New Password should be a string')
    .trim().isLength({ min: 6, max: 20 }).withMessage('Length of the New Password should be no less then 6 characters and no more then 20 characters'), (0, express_validator_1.body)('recoveryCode')
    .exists().withMessage('Recovery code is required')
    .isString().withMessage('Recovery code should be a string'), input_validtion_result_middleware_1.inputValidationResultMiddleware, authController.confirmPasswordResetHandler.bind(authController) //confirmPasswordResetHandler
);
