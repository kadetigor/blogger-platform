import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { postQueryInput } from "../routers/input/postQueryInput";
import { PostDocument, PostModel } from "../domain/post.schema";
import { injectable } from "inversify";

@injectable()
export class PostsQueryRepository {

  async findMany(
    queryDto: postQueryInput,
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const [items, totalCount] = await Promise.all([
      PostModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean() // Use lean() for better performance when you don't need Mongoose document methods
        .exec(),
      PostModel.countDocuments(filter).exec()
    ]);

    return { items, totalCount };
  }

  async findPostsbyBlog(
    queryDto: postQueryInput,
    blogId: string,
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto;

    const filter = { blogId: blogId };
    const skip = (pageNumber - 1) * pageSize;

    const [ items, totalCount ] = await Promise.all([
      PostModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      PostModel.countDocuments(filter).exec(),
    ]);
    return { items, totalCount };
  }

  async findByIdOrFail(id: string): Promise<PostDocument> {
    const post = await PostModel.findById(id).exec();

    if (!post) {
      throw new repositoryNotFoundError('Post does not exist')
    }
    return post;
  }
};

