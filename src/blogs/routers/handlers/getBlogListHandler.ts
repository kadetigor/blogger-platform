import { Request, Response } from "express";
import { blogQueryInput } from "../input/blogQueryInput";
import { mapToBlogListPaginatedOutput } from "../mappers/mapToBlogListPaginatedOutput";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { blogsService } from "../../application/blogsService";
import { blogSortField } from "../input/blogSortField";
import { sortDirection } from "../../../core/types/sortDirection";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/queryPaginationSortingValidationMiddleware";

export async function getBlogListHandler(
  req: Request,
  res: Response,
) {
  try {
    const queryInput: blogQueryInput = {
      pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : paginationAndSortingDefault.pageNumber,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : paginationAndSortingDefault.pageSize,
      sortBy: (req.query.sortBy as blogSortField) || paginationAndSortingDefault.sortBy,
      sortDirection: (req.query.sortDirection as sortDirection) || paginationAndSortingDefault.sortDirection,
      searchNameTerm: typeof req.query.searchNameTerm === "string" ? req.query.searchNameTerm.trim() : ""
    };

    const { items, totalCount } = await blogsService.findMany(queryInput);

    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(blogsListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
