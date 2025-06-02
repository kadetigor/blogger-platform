import { Router } from "express";
import { body } from "express-validator";
import { passwordValidation } from "../../users/routers/middleware/userInputDtoValidation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginOrEmailValidator } from "../../users/routers/middleware/login.or.email.validation";
import { createNewUserHandler } from "./handlers/create.new.user.handler";

export const authRouter = Router();

authRouter.post(
    '/',
    [
        body('loginOrEmail').custom(loginOrEmailValidator),
        passwordValidation,
    ],
    inputValidationResultMiddleware,
    createNewUserHandler
)