import "reflect-metadata";
import { inject, injectable } from "inversify";
import { UsersService } from "../application/usersService";
import { UsersRepository } from "../repositories/usersRepository";
import { mapToUserOutput } from "./mappers/mapToUserOutput";
import { HttpStatus } from "../../core/types/httpStatus";
import { errorsHandler } from "../../core/errors/errorsHandler";
import { Request, Response } from "express";
import { userQueryInput } from "./input/userQueryInput";
import { paginationAndSortingDefault } from "../../core/middlewares/validation/queryPaginationSortingValidationMiddleware";
import { sortDirection } from "../../core/types/sortDirection";
import { userSortField } from "./input/userSortField";
import { UsersQueryRepository } from "../repositories/usersQueryRepository";
import { mapToUsersListPaginatedOutput } from "./mappers/mapToUserListPaginatedOutput";


@injectable()
export class UsersController {

    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {}

    async createUserHandler(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const createUserId = await this.usersService.create(req.body);
            const createUser = await this.usersRepository.findByIdOrFail(createUserId);
            const userOutput = mapToUserOutput(createUser);

            res.status(HttpStatus.Created).send(userOutput);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async deleteUserHandler(
        req: Request<{ id: string }>,
        res: Response,
    ) {
        try {
            const id = req.params.id;
    
            await this.usersService.delete(id);
    
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getUserListHandler(
        req: Request,
        res: Response,
    ) {
        try {
            const queryInput: userQueryInput = {
          pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : paginationAndSortingDefault.pageNumber,
          pageSize: req.query.pageSize ? Number(req.query.pageSize) : paginationAndSortingDefault.pageSize,
          sortBy: (req.query.sortBy as userSortField) || paginationAndSortingDefault.sortBy,
          sortDirection: (req.query.sortDirection as sortDirection) || paginationAndSortingDefault.sortDirection,
          searchLoginTerm: typeof req.query.searchLoginTerm === "string" ? req.query.searchLoginTerm.trim() : "",
          searchEmailTerm: typeof req.query.searchEmailTerm === "string" ? req.query.searchEmailTerm.trim() : "",
          };
        
            const { items, totalCount } = await this.usersQueryRepository.findMany(queryInput)
            
            const usersListOutput = mapToUsersListPaginatedOutput(items, {
              pageNumber: queryInput.pageNumber,
              pageSize: queryInput.pageSize,
              totalCount,
            });
            res.send(usersListOutput);
        
          } catch (e: unknown) {
            errorsHandler(e, res);
          }
    }
}
