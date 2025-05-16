import { blogListPaginatedOutput } from "../output/blogListPaginatedOutput";
import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { resourceType } from "../../../core/types/resourceType";
import { blogDataOutput } from "../output/blogDataOutput";


export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): blogListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: blogs.map(
      (blog): blogDataOutput => ({
        type: resourceType.Blogs,
        id: blog._id.toString(),
        attributes: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
          createdAt: blog.createdAt,
          isMembership: blog.isMembership
        },
      }),
    ),
  };
}
