"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentLikeModel = void 0;
// src/comments/domain/comment.like.schema.ts
const mongoose_1 = require("mongoose");
const commentLikeSchema = new mongoose_1.Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ["Like", "Dislike"], required: true },
    createdAt: { type: Date, default: Date.now }
});
// Create compound index for efficient queries
commentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });
exports.CommentLikeModel = (0, mongoose_1.model)('CommentLike', commentLikeSchema);
