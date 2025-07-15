import { injectable } from "inversify";
import { CommentLike } from "../domain/comment.like";
import { CommentLikeModel } from "../domain/comment.like.schema";

@injectable()
export class CommentLikesRepository {
    async setLikeStatus(commentId: string, userId: string, status: "Like" | "Dislike" | "None"): Promise<void> {
        if (status === "None") {
            // Remove the like/dislike
            await CommentLikeModel.deleteOne({ commentId, userId });
            return;
        }

        // Upsert the like/dislike
        await CommentLikeModel.findOneAndUpdate(
            { commentId, userId },
            { 
                $set: { 
                    status,
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
    }

    async getUserLikeStatus(commentId: string, userId: string): Promise<"Like" | "Dislike" | "None"> {
        const like = await CommentLikeModel.findOne({ commentId, userId });
        return like ? like.status : "None";
    }

    async getLikesCount(commentId: string): Promise<number> {
        return await CommentLikeModel.countDocuments({ commentId, status: "Like" });
    }

    async getDislikesCount(commentId: string): Promise<number> {
        return await CommentLikeModel.countDocuments({ commentId, status: "Dislike" });
    }

    async deleteAllLikesForComment(commentId: string): Promise<void> {
        await CommentLikeModel.deleteMany({ commentId });
    }

    async getLikesInfo(commentId: string, userId?: string): Promise<{
        likesCount: number;
        dislikesCount: number;
        myStatus: "Like" | "Dislike" | "None";
    }> {
        const [likesCount, dislikesCount, myStatus] = await Promise.all([
            this.getLikesCount(commentId),
            this.getDislikesCount(commentId),
            userId ? this.getUserLikeStatus(commentId, userId) : Promise.resolve("None" as const)
        ]);

        return {
            likesCount,
            dislikesCount,
            myStatus
        };
    }
}