import { postsRepository } from "../repositories/postsRepository";
import { Post } from "../domain/post";
import { postAttributes } from "./dtos/postAttributes";
import { blogsRepository } from "../../blogs/repositories/blogsRepository";

export const postsService = {

  async create(dto: postAttributes): Promise<string> {

    const blog = await blogsRepository.findByIdOrFail(dto.blogId);
    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };
    return postsRepository.create(newPost);
  },

  async update(id: string, dto: postAttributes): Promise<void> {
    await postsRepository.update(id, dto)
    return;
  },

  async delete(id: string): Promise<void> {
    await postsRepository.delete(id);
    return;
  },
}
