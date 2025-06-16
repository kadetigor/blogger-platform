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

    const me = await usersQueryRepository.findByIdOrFail(userId);
    res.status(HttpStatus.Ok).send(me);
    return;
  },
);

authRouter.post(
  '/registration',
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationHandler
)

authRouter.post(
  '/registration-confirmation',
  confirmEmailHandler
)

authRouter.post(
  '/registration-email-resending',
  loginOrEmailValidation,
  inputValidationResultMiddleware,
  resendConfirmEmailHandler
)