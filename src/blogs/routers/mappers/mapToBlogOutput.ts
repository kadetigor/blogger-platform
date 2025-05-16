import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import { blogOutput } from '../output/blogOutput';
import { resourceType } from '../../../core/types/resourceType';

export function mapToBlogOutput(blog: WithId<Blog>): blogOutput {
  return {
    data: {
      type: resourceType.Blogs,
      id: blog._id.toString(),
      attributes: {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      },
    },
  };
}
