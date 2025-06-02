import { blogsRepository } from "../repositories/blogsRepository";
import { Blog } from "../domain/blog";
import { blogAttributes } from "./dtos/blogAttributes";

export const blogsService = {
  
  async create(dto: blogAttributes): Promise<string> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false
    };
    return blogsRepository.create(newBlog);
  },

  async update(id: string, dto: blogAttributes): Promise<void> {
    await blogsRepository.update(id, dto)
    return;
  },

  async delete(id: string): Promise<void> {
    await blogsRepository.delete(id);
    return;
  },
}
