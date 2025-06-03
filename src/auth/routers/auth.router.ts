import { Router, Response } from "express";
import { body } from "express-validator";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginHandler } from "./handlers/create.new.user.handler";
import { accessTokenGuard } from "./guards/access.token.guard";
import { RequestWithUserId } from "../../core/types/requests";
import { IdType } from "../../core/types/id";
import { HttpStatus } from "../../core/types/httpStatus";
import { usersQueryRepository } from "../../users/repositories/usersQueryRepository";

export const authRouter = Router();

const loginOrEmailValidation = body('loginOrEmail')
    .exists().withMessage('loginOrEmail is required')
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