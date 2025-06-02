import { Post } from "../domain/post";
import { postAttributes } from '../application/dtos/postAttributes';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { postCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { postQueryInput } from "../routers/input/postQueryInput";

export const postsRepository = {

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

