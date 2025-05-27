import { Blog } from "../domain/blog";
import { blogCollection } from "../../db/mongoDb";
import { ObjectId, WithId, Filter } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { blogAttributes } from "../application/dtos/blogAttributes";
import { blogQueryInput } from "../routers/input/blogQueryInput";

export const blogsRepository = {

  async create(newBlog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: blogAttributes): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new repositoryNotFoundError('Blog does not Exist')
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new repositoryNotFoundError('Blog does not exist')
    }

    return;
  },
};
