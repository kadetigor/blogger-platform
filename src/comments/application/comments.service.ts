import { commentsRepository } from "../repositories/comments.repository";
import { Comment } from "../domain/comment"
import { commentAttributes } from "./dtos/comment.attributes";
import { commentUpdateDto } from "./dtos/comment.update.dto";

export const commentsService = {

  async create(dto: commentAttributes): Promise<string> {

    const newComment: Comment = {
      content: dto.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: dto.userLogin,
      },
      postId: dto.postId,
      createdAt: new Date(),
    };
    return commentsRepository.create(newComment);
  },

  async update(id: string, dto: commentUpdateDto): Promise<void> {
    await commentsRepository.update(id, dto)
    return;
  },

  async delete(id: string): Promise<void> {
    await commentsRepository.delete(id);
    return;
  },
}
