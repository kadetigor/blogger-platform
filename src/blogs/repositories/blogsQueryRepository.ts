import { Filter, ObjectId, WithId } from "mongodb";
import { blogQueryInput } from "../routers/input/blogQueryInput";
import { Blog } from "../domain/blog";
import { blogCollection } from "../../db/mongoDb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const blogsQueryRepository = {

  async findMany(
    queryDto: blogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm
    } = queryDto

    const skip = (pageNumber - 1) * pageSize;
    const filter: Filter<Blog> = {};
    if (searchNameTerm && searchNameTerm.trim() !== "") {
      filter.name = {
        // case-insensitive “contains”
        $regex: searchNameTerm,
        $options: "i",
      };
    }

    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const res = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new repositoryNotFoundError('Blog does not exist')
    }
    return res;
  },

  async getBlogName(id: string): Promise<string> {
    const blogResult = await blogCollection.findOne({_id: new ObjectId(id)});

    if(!blogResult) {
        throw new Error('No blog with this id')
    }

    return blogResult.name;
  }
};