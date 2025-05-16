import { Request, Response } from 'express';
import { postQueryInput } from '../input/postQueryInput';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/setDefaultSortAndPagination';
import { postsService } from '../../application/postsService';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postSortField } from '../input/postSortField';
import { sortDirection } from '../../../core/types/sortDirection';

export async function getPostListHandler(
  req: Request, 
  res: Response,
) {
  try {
    const baseQueryInput = setDefaultSortAndPaginationIfNotExist(req.query as any)
    
    const queryInput: postQueryInput = {
      pageNumber: baseQueryInput.pageNumber,
      pageSize: baseQueryInput.pageSize,
      sortBy: baseQueryInput.sortBy as unknown as postSortField,
      sortDirection: baseQueryInput.sortDirection as sortDirection
    };

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
