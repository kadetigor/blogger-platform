import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { commentQueryInput } from "../routers/input/comment.query.input";
import { CommentDocument, CommentModel } from "../domain/comment.schema";

export const commentsQueryRepository = {

  async findMany(
    queryDto: commentQueryInput,
  ): Promise<{ items: CommentDocument[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const [items, totalCount] = await Promise.all([
    CommentModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec(),
    CommentModel.countDocuments(filter).exec()
    ]);

    return { items, totalCount };
  },

  async findCommentsByPost(
    queryDto: commentQueryInput,
    postId: string,
  ): Promise<{ items: CommentDocument[]; totalCount: number }> {

    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto;

    const filter = { postId: postId };

    const skip = (pageNumber - 1) * pageSize;

    const [ items, totalCount ] = await Promise.all([
      CommentModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      CommentModel.countDocuments(filter).exec(),
    ]);
    return { items, totalCount };
  },

  async findByIdOrFail(id: string): Promise<CommentDocument> {
    const result = await CommentModel.findById(id).exec();

    if (!result) {
      throw new repositoryNotFoundError('Comment does not exist')
    }
    return result;
  }
};