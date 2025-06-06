import { Request, Response } from 'express';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/setDefaultSortAndPagination';
import { errorsHandler } from '../../../core/errors/errorsHandler';
import { sortDirection } from '../../../core/types/sortDirection';
import { commentQueryInput } from '../input/comment.query.input';
import { commentSortField } from '../input/comment.sort.field';
import { commentsQueryRepository } from '../../repositories/comments.query.repository';
import { mapToCommentListPaginatedOutput } from '../mappers/map.to.comment.list.paginated.output';

export async function getCommentListHandler(
  req: Request, 
  res: Response,
) {
  try {
    const postId = req.params.id; // Get postId from URL params
    const baseQueryInput = setDefaultSortAndPaginationIfNotExist(req.query as any)
    
    const queryInput: commentQueryInput = {
      pageNumber: baseQueryInput.pageNumber,
      pageSize: baseQueryInput.pageSize,
      sortBy: baseQueryInput.sortBy as commentSortField,
      sortDirection: baseQueryInput.sortDirection as sortDirection
    };

    const { items, totalCount } = await commentsQueryRepository.findCommentsByPost(queryInput, postId)
    
    const commentsListOutput = mapToCommentListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(commentsListOutput);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}