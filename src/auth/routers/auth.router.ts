import { Router } from "express";
import { passwordValidation } from "../../users/routers/middleware/userInputDtoValidation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginOrEmailValidation } from "../../users/routers/middleware/login.or.email.validation";
import { createNewUserHandler } from "./handlers/create.new.user.handler";

export const authRouter = Router();

authRouter.post(
    '/',
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    createNewUserHandler
)