import { injectable } from "inversify";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { commentUpdateDto } from "../application/dtos/comment.update.dto";
import { Comment, myStatus } from '../domain/comment';
import { CommentDocument, CommentModel } from "../domain/comment.schema";


@injectable()
export class CommentsRepository {

  async findByIdOrFail(id: string): Promise<CommentDocument> {
    const result = await CommentModel.findById(id);

    if (!result) {
      throw new repositoryNotFoundError('Comment does not exist')
    }
    return result;
  }

  async create(newComment: Comment): Promise<string> {
    const comment = new CommentModel(newComment);
    const savedComment = await comment.save();
    return savedComment._id.toString()
  }

  async update(id: string, dto: commentUpdateDto): Promise<void> {
    const result = await CommentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          content: dto.content,
        },
      },
    );

    if (!result) {
      throw new repositoryNotFoundError('Comment does not exist')
    }

    return;
  }

  async delete(id: string): Promise<void> {
    const result = await CommentModel.findByIdAndDelete(id)

    if (!result) {
      throw new repositoryNotFoundError('Comment does not exist')
    }

    return;
  }

  async updateLikeInfo(id: string, status: string): Promise<void> {
    const result = await CommentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          likesInfo: {
            myStatus: status
          },
        },
      },
    );

    if (!result) {
      throw new repositoryNotFoundError('Comment does not exist')
    }

    return;
  }
};