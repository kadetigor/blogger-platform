import { Router, Response } from "express";
import { body } from "express-validator";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginHandler } from "./handlers/login.user.handler";
import { accessTokenGuard } from "./guards/access.token.guard";
import { RequestWithUserId } from "../../core/types/requests";
import { IdType } from "../../core/types/id";
import { HttpStatus } from "../../core/types/httpStatus";
import { usersQueryRepository } from "../../users/repositories/usersQueryRepository";
import { userInputDtoValidation } from "../../users/routers/middleware/userInputDtoValidation";
import { registrationHandler } from "./handlers/register.new.user.handler";
import { confirmEmailHandler } from "./handlers/confirm.email.handler";
import { resendConfirmEmailHandler } from "./handlers/resend.email.confirm.email.handler";
import { refreshTokenHandler } from "./handlers/refresh.token.handler";
import { logoutHandler } from "./handlers/logout.handler";
import { refreshTokenGuard } from "./guards/refresh.token.guard";
import { createRateLimitMiddleware } from "../../core/middlewares/rate.limiter.middleware";

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

authRouter.get('/debug/rate-limit', (req, res) => {
  // Access the rate limiter instance through the global variable
  const rateLimiter = (global as any).__rateLimiter;
  
  if (!rateLimiter) {
    res.status(404).json({ error: 'Rate limiter not found. Make sure to use the debug version of the rate limiter.' });
    return;
  }
  
  res.json(rateLimiter.getDebugInfo());
});

authRouter.post(
  '/login',
  authRateLimit,
  [
    loginOrEmailValidation,
    passwordValidation,
  ],
  inputValidationResultMiddleware,
  loginHandler
);

authRouter.get(
  '/me',
  accessTokenGuard,
  async (req: RequestWithUserId<IdType>, res: Response): Promise<void> => {
    const userId = req.user?.id as string;
    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    try {
      const user = await usersQueryRepository.findByIdOrFail(userId);
      
      // Return only the required fields: userId, login, email
      const meResponse = {
        userId: user._id.toString(),
        login: user.login,
        email: user.email
      };
      
      res.status(HttpStatus.Ok).send(meResponse);
    } catch (error) {
      res.sendStatus(HttpStatus.NotFound);
    }
  },
);

authRouter.post(
  '/registration',
  authRateLimit,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationHandler
)

authRouter.post(
  '/registration-confirmation',
  authRateLimit,
  body('code')
    .exists().withMessage('Code is required')
    .isString().withMessage('Code must be a string')
    .trim().notEmpty().withMessage('Code cannot be empty'),
  inputValidationResultMiddleware,
  confirmEmailHandler
);

authRouter.post(
  '/registration-email-resending',
  authRateLimit,
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .trim(),
  inputValidationResultMiddleware,
  resendConfirmEmailHandler
);

authRouter.post(
  '/refresh-token',
  refreshTokenGuard,
  refreshTokenHandler
);

authRouter.post(
  '/logout',
  refreshTokenGuard,
  logoutHandler
)
