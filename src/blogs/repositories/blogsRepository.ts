import { Blog } from "../domain/blog";
import { blogCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { blogAttributes } from "../application/dtos/blogAttributes";
import { blogQueryInput } from "../routers/input/blogQueryInput";

export const blogsRepository = {

  async findMany(
    queryDto: blogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
  },

  // async findById(id: string): Promise<WithId<Blog> | null> {
  //  return blogCollection.findOne({ _id: new ObjectId(id) });
  // },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    console.log(`got to findByIdOrFail with ${id}`)
    const res = await blogCollection.findOne({ _id: new ObjectId(id) });
    console.log(`recieved ${res}`)
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

  async getBlogName(id: string): Promise<string> {
    const blogResult = await blogCollection.findOne({_id: new ObjectId(id)});

    if(!blogResult) {
        throw new Error('No blog with this id')
    }

    return blogResult.name;
  }
};
