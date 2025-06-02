import { Router } from "express";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/queryPaginationSortingValidationMiddleware";
import { userSortField } from "./input/userSortField";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from "../../auth/routers/guards/basic.guard.middleware";
import { userInputDtoValidation } from "./middleware/userInputDtoValidation";
import { idValidationMiddleware } from "../../core/middlewares/validation/params-id.validation-middleware";
import { getUserListHandler } from "./handlers/getUserListHandler";
import { createUserHandler } from "./handlers/createUserHandler";
import { deleteUserHandler } from "./handlers/deleteUserHandler";

export const usersRouter = Router({})

usersRouter
    .get(
        '/',
        superAdminGuardMiddleware,
        paginationAndSortingValidation(userSortField),
        inputValidationResultMiddleware,
        getUserListHandler
    )
    .post(
        '/',
        superAdminGuardMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        createUserHandler

    )
    .delete(
        '/:id',
        superAdminGuardMiddleware,
        idValidationMiddleware,
        inputValidationResultMiddleware,
        deleteUserHandler
    )

