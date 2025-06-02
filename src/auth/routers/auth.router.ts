import { Router } from "express";
import { body } from "express-validator";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginHandler } from "./handlers/create.new.user.handler";

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