"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostLikeModel = void 0;
const mongoose_1 = require("mongoose");
const postLikeSchema = new mongoose_1.Schema({
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ["Like", "Dislike"], required: true },
    createdAt: { type: Date, default: Date.now }
});
postLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
exports.PostLikeModel = (0, mongoose_1.model)('PostLike', postLikeSchema);
