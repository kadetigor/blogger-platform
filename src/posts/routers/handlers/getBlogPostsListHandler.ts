import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsService } from '../../application/postsService';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { postQueryInput } from '../input/postQueryInput';

export async function getBlogPostsListHandler(
  req: Request<{ id: string }, {}, {}, postQueryInput>,
  res: Response,
) {
  try {
    const blogId = req.params.id;
    const queryInput = req.query;

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
