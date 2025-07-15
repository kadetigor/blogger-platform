// src/comments/domain/comment.like.schema.ts
import { Schema, model, Document, Types } from 'mongoose';
import { CommentLike } from './comment.like';

export interface CommentLikeDocument extends CommentLike, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const commentLikeSchema = new Schema<CommentLikeDocument>({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, enum: ["Like", "Dislike"], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create compound index for efficient queries
commentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const CommentLikeModel = model<CommentLikeDocument>('CommentLike', commentLikeSchema);