import { Router } from "express";
import 'reflect-metadata';
import { paginationAndSortingValidation } from "../../core/middlewares/validation/queryPaginationSortingValidationMiddleware";
import { userSortField } from "./input/userSortField";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from "../../auth/routers/guards/basic.guard.middleware";
import { userInputDtoValidation } from "./middleware/userInputDtoValidation";
import { idValidationMiddleware } from "../../core/middlewares/validation/params-id.validation-middleware";
import { container } from "../../composition-root";
import { UsersController } from "./users.controller";

const usersController = container.get(UsersController)

export const usersRouter = Router({})

usersRouter
    .get(
        '/',
        superAdminGuardMiddleware,
        paginationAndSortingValidation(userSortField),
        inputValidationResultMiddleware,
        usersController.getUserListHandler.bind(usersController)// getUserListHandler
    )
    .post(
        '/',
        superAdminGuardMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        usersController.createUserHandler.bind(usersController)// createUserHandler

    )
    .delete(
        '/:id',
        superAdminGuardMiddleware,
        idValidationMiddleware,
        inputValidationResultMiddleware,
        usersController.deleteUserHandler.bind(usersController)// deleteUserHandler
    )

