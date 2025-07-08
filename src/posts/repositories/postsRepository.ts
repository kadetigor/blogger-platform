import { Post } from "../domain/post";
import { postAttributes } from '../application/dtos/postAttributes';
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { PostDocument, PostModel } from "../domain/post.schema";

export const postsRepository = {

  async findByIdOrFail(id: string): Promise<PostDocument> {
    const post = await PostModel.findById(id);
    if (!post) {
      throw new repositoryNotFoundError('Post does not exist')
    }
    return post;
  },

  async create(newPost: Post): Promise<string> {
    const post = new PostModel(newPost);
    const savedPost = await post.save() as PostDocument;
    return savedPost._id.toString();
  },

  async update(id: string, dto: postAttributes): Promise<void> {
    const result = await PostModel.findByIdAndUpdate(
      id,
      {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId,
      },
      { runValidators: true }
    );

    if (!result) {
      throw new repositoryNotFoundError('Post does not exist')
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const result = await PostModel.findByIdAndDelete(id)
    if (!result) {
      throw new repositoryNotFoundError('Post does not exist')
    }

    return;
  }
};

