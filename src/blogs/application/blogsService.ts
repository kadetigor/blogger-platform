import { blogsRepository } from "../repositories/blogsRepository";
import { Blog } from "../domain/blog";
import { blogAttributes } from "./dtos/blogAttributes";
import { WithId } from "mongodb";
import { blogQueryInput } from "../routers/input/blogQueryInput";

export const blogsService = {
  async findMany(
    queryDto: blogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return blogsRepository.findMany(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrFail(id);
  },

  async create(dto: blogAttributes): Promise<string> {
    console.log(`got into blogService with such Attributes ${dto}`)
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: true
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
