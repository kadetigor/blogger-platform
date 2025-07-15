import { PostsRepository } from "../repositories/posts.repository";
import { Post } from "../domain/post";
import { postAttributes } from "./dtos/post.attributes";
import { blogsRepository } from "../../blogs/repositories/blogsRepository";
import { inject, injectable } from "inversify";
import { PostLikeRepository } from "../repositories/post.likes.repository";

@injectable()
export class PostsService {

  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(PostLikeRepository) protected postsLikeRepository: PostLikeRepository,
    //@inject(BlogsReposito)
  ) {}

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
    return this.postsRepository.create(newPost);
  }

  async update(id: string, dto: postAttributes): Promise<void> {
    await this.postsRepository.update(id, dto)
    return;
  }

  async delete(id: string): Promise<void> {
    await this.postsRepository.delete(id);
    return;
  }
}
