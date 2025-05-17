import { Post } from "../domain/post";
import { postAttributes } from '../application/dtos/postAttributes';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { postCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { postQueryInput } from "../routers/input/postQueryInput";

export const postsRepository = {

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

    console.log(`recieved ${queryDto} and ${blogId} at findPostsbyBlog`)

    const {
      pageNumber    = 1,
      pageSize      = 10,
      sortBy        = 'createdAt',
      sortDirection = 'desc',
    } = queryDto;
    

    console.log(
      `queryDto → pageNumber=${pageNumber}, pageSize=${pageSize}, sortBy=${sortBy}, sortDirection=${sortDirection}`
    );

    const filter = { blogId: blogId };
    const skip = (pageNumber - 1) * pageSize;
    const [items, totalCount] = await Promise.all([
      postCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);
    console.log(`got ${items} and ${totalCount} at findPostsbyBlog before returning them`)
    return { items, totalCount };
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new repositoryNotFoundError('Post does not exist')
    }
    return res;
  },

  async create(newPost: Post): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: postAttributes): Promise<void> {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new repositoryNotFoundError('Post does not exist')
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new repositoryNotFoundError('Post does not exist')
    }

    return;
  }
};

