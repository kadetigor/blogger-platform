"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const blog_schema_1 = require("../../blogs/domain/blog.schema");
const httpStatus_1 = require("../../core/types/httpStatus");
const post_schema_1 = require("../../posts/domain/post.schema");
const user_schema_1 = require("../../users/domain/user.schema");
const comment_schema_1 = require("../../comments/domain/comment.schema");
const comment_like_schema_1 = require("../../comments/domain/comment.like.schema");
const refresh_token_session_schema_1 = require("../../auth/domain/refresh.token.session.schema");
const security_device_schema_1 = require("../../auth/devices/security.device.schema");
const post_like_schema_1 = require("../../posts/domain/post.like.schema");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        post_schema_1.PostModel.deleteMany({}),
        post_like_schema_1.PostLikeModel.deleteMany({}),
        blog_schema_1.BlogModel.deleteMany({}),
        user_schema_1.UserModel.deleteMany({}),
        comment_schema_1.CommentModel.deleteMany({}),
        comment_like_schema_1.CommentLikeModel.deleteMany({}),
        refresh_token_session_schema_1.RefreshTokenSessionModel.deleteMany({}),
        security_device_schema_1.SecurityDeviceModel.deleteMany({})
    ]);
    res.sendStatus(httpStatus_1.HttpStatus.NoContent);
}));
