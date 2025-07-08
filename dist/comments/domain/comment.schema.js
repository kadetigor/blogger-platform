"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    postId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.CommentModel = (0, mongoose_1.model)('Comment', commentSchema);
