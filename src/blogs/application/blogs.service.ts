import { BlogsRepository } from "../repositories/blogs.repository";
import { Blog } from "../domain/blog";
import { blogAttributes } from "./dtos/blog.attributes";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsService {
  
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
  ){}

  async create(dto: blogAttributes): Promise<string> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false
    };
    return this.blogsRepository.create(newBlog);
  }

  async update(id: string, dto: blogAttributes): Promise<void> {
    await this.blogsRepository.update(id, dto)
    return;
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.delete(id);
    return;
  }
}
