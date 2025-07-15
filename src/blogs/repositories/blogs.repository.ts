import { BlogModel, BlogDocument } from '../domain/blog.schema';
import { repositoryNotFoundError } from '../../core/errors/repositoryNotFoundError';
import { blogAttributes } from '../application/dtos/blog.attributes';
import { Blog } from '../domain/blog';
import { injectable } from 'inversify';

@injectable()
export class BlogsRepository {

  async findByIdOrFail(id: string): Promise<BlogDocument> {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      throw new repositoryNotFoundError('Blog does not exist');
    }
    return blog;
  }

  async create(newBlog: Blog): Promise<string> {
    const blog = new BlogModel(newBlog);
    const savedBlog = await blog.save();
    return savedBlog._id.toString();
  }

  async update(id: string, dto: blogAttributes): Promise<void> {
    const result = await BlogModel.findByIdAndUpdate(
      id,
      {
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl
      },
      { runValidators: true }
    );

    if (!result) {
      throw new repositoryNotFoundError('Blog does not exist');
    }
  }

  async delete(id: string): Promise<void> {
    const result = await BlogModel.findByIdAndDelete(id);
    if (!result) {
      throw new repositoryNotFoundError('Blog does not exist');
    }
  }
};
