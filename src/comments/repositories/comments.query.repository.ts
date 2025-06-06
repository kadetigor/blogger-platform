import { Comment } from "../domain/comment";
import { commentCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { commentQueryInput } from "../routers/input/comment.query.input";

export const commentsQueryRepository = {

  async findMany(
    queryDto: commentQueryInput,
  ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const items = await commentCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findCommentsByPost(
    queryDto: commentQueryInput,
    postId: string,
  ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto;

    const filter = { postId: postId };
    const skip = (pageNumber - 1) * pageSize;
    const [ items, totalCount ] = await Promise.all([
      commentCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      commentCollection.countDocuments(filter),
    ]);
    return { items, totalCount };
  },

  async findByIdOrFail(id: string): Promise<WithId<Comment>> {
    const res = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new repositoryNotFoundError('Comment does not exist')
    }
    return res;
  }
};