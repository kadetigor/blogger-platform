import { Schema, model, Document, Types } from 'mongoose';
import { Post } from './post';

export interface PostDocument extends Post, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const postSchema = new Schema<PostDocument>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const PostModel = model<PostDocument>('Post', postSchema);