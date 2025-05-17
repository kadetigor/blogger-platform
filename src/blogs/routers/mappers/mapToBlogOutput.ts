import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import { blogDataOutput } from '../output/blogDataOutput';

export function mapToBlogOutput(blog: WithId<Blog>): blogDataOutput {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
    }
};

