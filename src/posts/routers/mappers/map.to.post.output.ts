import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { resourceType } from "../../../core/types/resourceType";
import { postOutput } from "../output/post.output";

export function mapToPostOutput(
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
): postOutput {
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
                extendedLikesInfo: extendedLikesInfo
            },
        },
    };
}
