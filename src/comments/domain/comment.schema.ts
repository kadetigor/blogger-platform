import { Schema, model, Document, Types } from 'mongoose';
import { Comment } from './comment';

export interface CommentDocument extends Comment, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const commentSchema = new Schema<CommentDocument>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true }
  },
  postId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const CommentModel = model<CommentDocument>('Comment', commentSchema);