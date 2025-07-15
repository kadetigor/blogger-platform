import { WithId } from 'mongodb';
import { Post } from '../../domain/post';
import { postViewModel } from '../../types/post.view-model';

export function mapToPostViewModel(
    post: WithId<Post>, 
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: "None" | "Like" | "Dislike";
        newestLikes: Array<{
            addedAt: Date;
            userId: string;
            login: string;
        }>;
    }
): postViewModel {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: extendedLikesInfo
    };
}
