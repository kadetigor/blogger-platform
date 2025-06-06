import { ObjectId, WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { commentCollection } from "../../db/mongoDb";
import { commentAttributes } from "../application/dtos/comment.attributes";
import { Comment } from '../domain/comment';

export const commentsRepository = {

  async findByIdOrFail(id: string): Promise<WithId<Comment>> {
    const res = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new repositoryNotFoundError('Comment does not exist')
    }
    return res;
  },

  async create(newComment: Comment): Promise<string> {
    const insertResult = await commentCollection.insertOne(newComment);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: commentAttributes): Promise<void> {
    const updateResult = await commentCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          content: dto.content,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new repositoryNotFoundError('Comment does not exist')
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await commentCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new repositoryNotFoundError('Comment does not exist')
    }

    return;
  }
};