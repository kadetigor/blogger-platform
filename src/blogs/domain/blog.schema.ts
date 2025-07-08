import { Schema, model, Document, Types } from 'mongoose';
import { Blog } from './blog';

export interface BlogDocument extends Blog, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const blogSchema = new Schema<BlogDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isMembership: { type: Boolean, default: false }
});

export const BlogModel = model<BlogDocument>('Blog', blogSchema);