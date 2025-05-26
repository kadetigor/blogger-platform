import { Request, Response } from "express";
import { blogQueryInput } from "../input/blogQueryInput";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import { mapToBlogListPaginatedOutput } from "../mappers/mapToBlogListPaginatedOutput";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { blogsService } from "../../application/blogsService";
import { blogSortField } from "../input/blogSortField";
import { sortDirection } from "../../../core/types/sortDirection";

export async function getBlogListHandler(
  req: Request,
  res: Response,
) {
  try {
    const baseQueryInput = setDefaultSortAndPaginationIfNotExist(req.query as any);
    
    const queryInput: blogQueryInput = {
      pageNumber: baseQueryInput.pageNumber,
      pageSize: baseQueryInput.pageSize,
      sortBy: baseQueryInput.sortBy as blogSortField,
      sortDirection: baseQueryInput.sortDirection as sortDirection
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
