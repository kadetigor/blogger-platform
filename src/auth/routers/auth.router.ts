import { Router } from "express";
import { createUserHandler } from "../../users/routers/handlers/createUserHandler";
import { passwordValidation, userInputDtoValidation } from "../../users/routers/middleware/userInputDtoValidation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginOrEmailValidation } from "../../users/routers/middleware/login.or.email.validation";

export const authRouter = Router();

authRouter.post(
    '/',
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    createUserHandler
)