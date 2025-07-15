import { Schema, model, Document, Types } from 'mongoose';
import { PostLike } from "./post.like";

export interface PostLikeDocument extends PostLike, Document<Types.ObjectId> {
    _id: Types.ObjectId;
}

const postLikeSchema = new Schema<PostLikeDocument>({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, enum: ["Like", "Dislike"], required: true},
    createdAt: {type: Date, default: Date.now}
})

postLikeSchema.index({ postId: 1, userId: 1 }, { unique: true })

export const PostLikeModel = model<PostLikeDocument>('PostLike', postLikeSchema)