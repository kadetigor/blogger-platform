import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsService } from '../../../posts/application/postsService';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { postQueryInput } from '../../../posts/routers/input/postQueryInput';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/setDefaultSortAndPagination';
import { postSortField } from '../../../posts/routers/input/postSortField';
import { sortDirection } from '../../../core/types/sortDirection';

export async function getBlogPostsListHandler(
  req: Request,
  res: Response,
) {

  try {
    const blogId = req.params.id;
    // Properly handle the query parameters with defaults
    const baseQueryInput = setDefaultSortAndPaginationIfNotExist(req.query as any);
    
    const queryInput: postQueryInput = {
      pageNumber: baseQueryInput.pageNumber,
      pageSize: baseQueryInput.pageSize,
      sortBy: baseQueryInput.sortBy as postSortField,
      sortDirection: baseQueryInput.sortDirection as sortDirection
    };

    const { items, totalCount } = await postsService.findPostsbyBlog(
      queryInput,
      blogId,
    );
                      

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber || 1,
      pageSize: queryInput.pageSize || 10,
      totalCount,
    });
    res.send(postListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
