import { Post } from "../domain/post";
import { postCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { postQueryInput } from "../routers/input/postQueryInput";

export const postsQueryRepository = {

  async findMany(
    queryDto: postQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const items = await postCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findPostsbyBlog(
    queryDto: postQueryInput,
    blogId: string,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto;

    const filter = { blogId: blogId };
    const skip = (pageNumber - 1) * pageSize;
    const [ items, totalCount ] = await Promise.all([
      postCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);
    return { items, totalCount };
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new repositoryNotFoundError('Post does not exist')
    }
    return res;
  }
};

