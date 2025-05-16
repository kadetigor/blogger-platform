import { Request, Response } from 'express';
import { postQueryInput } from '../input/postQueryInput';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/setDefaultSortAndPagination';
import { postsService } from '../../application/postsService';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { errorsHandler } from '../../../core/errors/errorsHandler';

export async function getPostListHandler(
  req: Request<{}, {}, {}, postQueryInput>, 
  res: Response) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query)

    const { items, totalCount } = await postsService.findMany(queryInput)
    
    const postsListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(postsListOutput);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
