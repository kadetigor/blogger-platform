import { Blog } from "../domain/blog";
import { blogCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { blogAttributes } from "../application/dtos/blogAttributes";

export const blogsRepository = {

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const res = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new repositoryNotFoundError('Blog does not exist')
    }
    return res;
  },

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
