import { errorsHandler } from "../../../core/errors/errorsHandler";
import { sortDirection } from "../../../core/types/sortDirection";
import { usersQueryRepository } from "../../repositories/usersQueryRepository";
import { Request, Response } from "express";
import { mapToUsersListPaginatedOutput } from "../mappers/mapToUserListPaginatedOutput";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/queryPaginationSortingValidationMiddleware";
import { userQueryInput } from "../input/userQueryInput";
import { userSortField } from "../input/userSortField";

export async function getUserListHandler(
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
    
        const { items, totalCount } = await usersQueryRepository.findMany(queryInput)
        
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