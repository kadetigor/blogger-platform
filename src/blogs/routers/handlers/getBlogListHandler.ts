import { Request, Response } from "express";
import { blogQueryInput } from "../input/blogQueryInput";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import { mapToBlogListPaginatedOutput } from "../mappers/mapToBlogListPaginatedOutput";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { blogsService } from "../../application/blogsService";

export async function getBlogListHandler(
  req: Request<{}, {}, {}, blogQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

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
