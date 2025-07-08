import { Schema, model, Document, Types } from 'mongoose';
import { Comment, myStatus } from './comment';

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
  createdAt: { type: Date, default: Date.now },
  likesInfo: {
    likesCount: { type: Number, required: true},
    dislikesCount: { type: Number, required: true},
    myStatus: { type: String, enum: Object.values(myStatus), default: myStatus.None, required: true}
  } 
});

export const CommentModel = model<CommentDocument>('Comment', commentSchema);