import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsService } from '../../application/postsService';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { postQueryInput } from '../input/postQueryInput';

export async function getBlogPostsListHandler(
  req: Request,
  res: Response,
) {
  // Debug
  console.log('got to getBlogPostsListHandler')

  try {
    const blogId = req.params.id;
    const queryInput = req.query as any;

    const { items, totalCount } = await postsService.findPostsbyBlog(
      queryInput,
      blogId,
    );
    
    // Debug
    console.log({ items, totalCount })                         

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
