"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const comment_1 = require("./comment");
const commentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    postId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likesInfo: {
        likesCount: { type: Number, required: true },
        dislikesCount: { type: Number, required: true },
        myStatus: { type: String, enum: Object.values(comment_1.myStatus), default: comment_1.myStatus.None, required: true }
    }
});
exports.CommentModel = (0, mongoose_1.model)('Comment', commentSchema);
