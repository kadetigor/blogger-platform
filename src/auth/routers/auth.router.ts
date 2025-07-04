import { Router, Response } from "express";
import 'reflect-metadata';
import { body } from "express-validator";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { accessTokenGuard } from "./guards/access.token.guard";
import { userInputDtoValidation } from "../../users/routers/middleware/userInputDtoValidation";
import { refreshTokenGuard } from "./guards/refresh.token.guard";
import { createRateLimitMiddleware } from "../../core/middlewares/rate.limiter.middleware";
import { AuthController } from "./auth.controller";
import { container } from "../../composition-root";

const authController = container.get(AuthController)

const authRateLimit = createRateLimitMiddleware(5, 10 * 1000);

export const authRouter = Router();

const loginOrEmailValidation = body('loginOrEmail')
  .exists().withMessage('email')
  .isString().withMessage('loginOrEmail should be a string')
  .trim().notEmpty().withMessage('loginOrEmail should not be empty');

const passwordValidation = body('password')
  .exists().withMessage('Password is required')
  .isString().withMessage('Password should be a string')
  .trim().notEmpty().withMessage('Password should not be empty');

authRouter.post(
  '/login',
  authRateLimit,
  [
    loginOrEmailValidation,
    passwordValidation,
  ],
  inputValidationResultMiddleware,
  authController.loginHandler.bind(authController)//loginHandler
);

authRouter.get(
  '/me',
  accessTokenGuard,
  authController.getInfoOnCurrentUser.bind(authController)
);

authRouter.post(
  '/registration',
  authRateLimit,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  authController.registrationHandler.bind(authController)//registrationHandler
)

authRouter.post(
  '/registration-confirmation',
  authRateLimit,
  body('code')
    .exists().withMessage('Code is required')
    .isString().withMessage('Code must be a string')
    .trim().notEmpty().withMessage('Code cannot be empty'),
  inputValidationResultMiddleware,
  authController.confirmEmailHandler.bind(authController)//confirmEmailHandler
);

authRouter.post(
  '/registration-email-resending',
  authRateLimit,
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .trim(),
  inputValidationResultMiddleware,
  authController.resendConfirmEmailHandler.bind(authController)//resendConfirmEmailHandler
);

authRouter.post(
  '/refresh-token',
  refreshTokenGuard,
  authController.refreshTokenHandler.bind(authController)//refreshTokenHandler
);

authRouter.post(
  '/logout',
  refreshTokenGuard,
  authController.logoutHandler.bind(authController)//logoutHandler
)

authRouter.post(
  '/password-recovery',
  authRateLimit,
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .trim(),
  inputValidationResultMiddleware,
  authController.passwordRecoveryEmailHandler.bind(authController)//passwordRecoveryEmailHandler
)

authRouter.post( // Used to confirm password recovery
  '/new-password',
  authRateLimit,
  body('newPassword')
    .exists().withMessage('New Password is required')
    .isString().withMessage('New Password should be a string')
    .trim().isLength({ min: 6, max: 20}).withMessage('Length of the New Password should be no less then 6 characters and no more then 20 characters'),
  body('recoveryCode')
    .exists().withMessage('Recovery code is required')
    .isString().withMessage('Recovery code should be a string'),
  inputValidationResultMiddleware,
  authController.confirmPasswordResetHandler.bind(authController)//confirmPasswordResetHandler
)