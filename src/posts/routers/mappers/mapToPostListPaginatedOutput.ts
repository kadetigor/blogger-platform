import { WithId } from "mongodb";
import { resourceType } from "../../../core/types/resourceType";
import { postDataOutput } from '../output/postDataOutput'
import { Post } from "../../domain/post";
import { postListPaginatedOutput } from "../output/postListPaginatedOutput";

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): postListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: posts.map(
      (post): postDataOutput => ({
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
      }),
    ),
  };
};
