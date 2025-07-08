import { FilterQuery } from "mongoose";
import { blogQueryInput } from "../routers/input/blogQueryInput";
import { BlogModel, BlogDocument } from "../domain/blog.schema";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const blogsQueryRepository = {

  async findMany(
    queryDto: blogQueryInput,
  ): Promise<{ items: BlogDocument[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: FilterQuery<BlogDocument> = {};
    
    if (searchNameTerm && searchNameTerm.trim() !== "") {
      filter.name = {
        // case-insensitive "contains"
        $regex: searchNameTerm,
        $options: "i",
      };
    }

    // Execute both queries in parallel for better performance
    const [items, totalCount] = await Promise.all([
      BlogModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean() // Use lean() for better performance when you don't need Mongoose document methods
        .exec(),
      BlogModel.countDocuments(filter).exec()
    ]);

    return { items, totalCount };
  },

  async findByIdOrFail(id: string): Promise<BlogDocument> {
    const blog = await BlogModel.findById(id).exec();
    
    if (!blog) {
      throw new repositoryNotFoundError('Blog does not exist');
    }
    
    return blog;
  },

  async getBlogName(id: string): Promise<string> {
    // Use select() to only fetch the name field for better performance
    const blog = await BlogModel
      .findById(id)
      .select('name')
      .lean()
      .exec();

    if (!blog) {
      throw new Error('No blog with this id');
    }

    return blog.name;
  }
};