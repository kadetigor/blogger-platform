import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { resourceType } from "../../../core/types/resourceType";
import { postOutput } from "../output/postOutput";

export function mapToPostOutput(post: WithId<Post>): postOutput {
  return {
    data: {
      type: resourceType.Posts,
      id: post._id.toString(),
      attributes: {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      },
    },
  };
}
