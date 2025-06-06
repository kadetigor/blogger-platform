import { commentsRepository } from "../repositories/comments.repository";
import { Comment } from "../domain/comment"
import { commentAttributes } from "./dtos/comment.attributes";
import { postsRepository } from "../../posts/repositories/postsRepository";

export const commentsService = {

  async create(dto: commentAttributes): Promise<string> {

    const post = await postsRepository.findByIdOrFail(dto.blogId);

    const newComment: Comment = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };
    return commentsRepository.create(newComment);
  },

  async update(id: string, dto: commentAttributes): Promise<void> {
    await commentsRepository.update(id, dto)
    return;
  },

  async delete(id: string): Promise<void> {
    await commentsRepository.delete(id);
    return;
  },
}
