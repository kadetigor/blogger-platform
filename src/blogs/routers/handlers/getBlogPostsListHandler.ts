import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsService } from '../../../posts/application/postsService';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { postQueryInput } from '../../../posts/routers/input/postQueryInput';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/setDefaultSortAndPagination';

export async function getBlogPostsListHandler(
  req: Request,
  res: Response,
) {

  try {
    const blogId = req.params.id;
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await postsService.findPostsbyBlog(
      queryInput,
      blogId,
    );
                      

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(postListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
