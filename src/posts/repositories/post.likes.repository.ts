import { injectable } from "inversify";
import { PostLikeModel } from "../domain/post.like.schema";
import { PipelineStage } from "mongoose";

@injectable()
export class PostLikeRepository {
    async setLikeStatus(postId: string, userId: string, status: "Like" | "Dislike" | "None"):Promise<void> {
        if (status === "None"){
            await PostLikeModel.deleteOne({ postId, userId })
            return;
        }

        await PostLikeModel.findOneAndUpdate(
            { postId, userId },

            {
                $set: {
                    status,
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
    }

    async getUserLikeStatus(postId: string, userId: string): Promise<"Like" | "Dislike" | "None"> {
        const like = await PostLikeModel.findOne({ postId, userId });
        return like ? like.status : "None";
    }

    async getLikesCount(postId: string): Promise<number> {
        return await PostLikeModel.countDocuments({ postId, status: "Like" });
    }

    async getDislikesCount(postId: string): Promise<number> {
        return await PostLikeModel.countDocuments({ postId, status: "Dislike" });
    }

    async deleteAllLikesForPost(postId: string): Promise<void> {
        await PostLikeModel.deleteMany({ postId });
    }

    async findNewestLikes(postId: string): Promise<Array<{
        addedAt: Date;
        userId: string;
        login: string;
    }>> {
        const pipeline: PipelineStage[] = [
            // Match likes for this post
            {
                $match: {
                    postId: postId,
                    status: "Like"
                }
            },
            // Sort by newest first
            {
                $sort: { createdAt: -1 }
            },
            // Limit to 3
            {
                $limit: 3
            },
            // Join with users collection
            {
                $lookup: {
                    from: 'users',  // MongoDB collection name (usually lowercase plural)
                    let: { userId: '$userId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$userId' }]
                                }
                            }
                        },
                        {
                            $project: {
                                login: 1
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            // Unwind the user array (convert from array to object)
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Final projection
            {
                $project: {
                    addedAt: '$createdAt',
                    userId: '$userId',
                    login: { $ifNull: ['$user.login', 'Unknown'] }
                }
            }
        ];

        const result = await PostLikeModel.aggregate<{
            addedAt: Date;
            userId: string;
            login: string;
        }>(pipeline);
        
        return result;
    }

    async getExtendedLikesInfo(postId: string, userId?: string): Promise<{
        likesCount: number;
        dislikesCount: number;
        myStatus: "Like" | "Dislike" | "None";
        newestLikes: Array<{ addedAt: Date; userId: string; login: string; }>
    }> {
        const [likesCount, dislikesCount, myStatus, newestLikes] = await Promise.all([
            this.getLikesCount(postId),
            this.getDislikesCount(postId),
            userId ? this.getUserLikeStatus(postId, userId) : Promise.resolve("None" as const),
            this.findNewestLikes(postId),
        ]);

        return {
            likesCount,
            dislikesCount,
            myStatus,
            newestLikes
        };
    }
}