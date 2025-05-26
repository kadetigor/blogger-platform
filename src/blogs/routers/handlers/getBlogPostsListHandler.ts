import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsService } from '../../../posts/application/postsService';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { postQueryInput } from '../../../posts/routers/input/postQueryInput';

export async function getBlogPostsListHandler(
  req: Request<{ id: string }>,
  res: Response,
) {

  try {
    const blogId = req.params.id;
    const queryInput = req.query as any;

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
