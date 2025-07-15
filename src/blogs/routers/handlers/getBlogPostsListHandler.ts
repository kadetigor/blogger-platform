import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { postsService } from '../../../posts/application/posts.service';
import { mapToPostListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput';
import { postQueryInput } from '../../../posts/routers/input/postQueryInput';
import { postSortField } from '../../../posts/routers/input/postSortField';
import { sortDirection } from '../../../core/types/sortDirection';
import { paginationAndSortingDefault } from '../../../core/middlewares/validation/queryPaginationSortingValidationMiddleware';
import { postsQueryRepository } from '../../../posts/repositories/posts.query-repository';
import { repositoryNotFoundError } from '../../../core/errors/repositoryNotFoundError';
import { blogsQueryRepository } from '../../repositories/blogsQueryRepository';
import { HttpStatus } from '../../../core/types/httpStatus';

export async function getBlogPostsListHandler(
  req: Request,
  res: Response,
) {
  try {
    const blogId = req.params.id;

    const blog = await blogsQueryRepository.findByIdOrFail(blogId);

    if (!blog) {
      throw new repositoryNotFoundError('Blog does not exist');
    }
    
    const queryInput: postQueryInput = {
      pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : paginationAndSortingDefault.pageNumber,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : paginationAndSortingDefault.pageSize,
      sortBy: (req.query.sortBy as postSortField) || paginationAndSortingDefault.sortBy,
      sortDirection: (req.query.sortDirection as sortDirection) || paginationAndSortingDefault.sortDirection
    };

    const { items, totalCount } = await postsQueryRepository.findPostsbyBlog(
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
