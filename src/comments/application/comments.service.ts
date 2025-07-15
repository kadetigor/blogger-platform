// src/comments/application/comments.service.ts
import { CommentsRepository } from "../repositories/comments.repository";
import { Comment, myStatus } from "../domain/comment"
import { commentAttributes } from "./dtos/comment.attributes";
import { commentUpdateDto } from "./dtos/comment.update.dto";
import { inject, injectable } from "inversify";
import { CommentLikesRepository } from "../repositories/comment.likes.repository";

@injectable()
export class CommentsService {

  constructor(
    @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
    @inject(CommentLikesRepository) protected commentLikesRepository: CommentLikesRepository,
  ) {}

  async create(dto: commentAttributes): Promise<string> {

    const newComment: Comment = {
      content: dto.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: dto.userLogin,
      },
      postId: dto.postId,
      createdAt: new Date(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatus.None
      } 
    };
    return this.commentsRepository.create(newComment);
  }

  async update(id: string, dto: commentUpdateDto): Promise<void> {
    await this.commentsRepository.update(id, dto)
    return;
  }

  async delete(id: string): Promise<void> {
    await this.commentsRepository.delete(id);
    return;
  }

  async updateLikeInfo(commentId: string, userId: string, status: "Like" | "Dislike" | "None"): Promise<void> {
    // First check if comment exists
    await this.commentsRepository.findByIdOrFail(commentId);
    
    // Then update the like status
    await this.commentLikesRepository.setLikeStatus(commentId, userId, status);
  }
}