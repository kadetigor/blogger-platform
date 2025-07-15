"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.CommentLikesRepository = void 0;
const inversify_1 = require("inversify");
const comment_like_schema_1 = require("../domain/comment.like.schema");
let CommentLikesRepository = class CommentLikesRepository {
    setLikeStatus(commentId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (status === "None") {
                // Remove the like/dislike
                yield comment_like_schema_1.CommentLikeModel.deleteOne({ commentId, userId });
                return;
            }
            // Upsert the like/dislike
            yield comment_like_schema_1.CommentLikeModel.findOneAndUpdate({ commentId, userId }, {
                $set: {
                    status,
                    createdAt: new Date()
                }
            }, { upsert: true });
        });
    }
    getUserLikeStatus(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield comment_like_schema_1.CommentLikeModel.findOne({ commentId, userId });
            return like ? like.status : "None";
        });
    }
    getLikesCount(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_like_schema_1.CommentLikeModel.countDocuments({ commentId, status: "Like" });
        });
    }
    getDislikesCount(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_like_schema_1.CommentLikeModel.countDocuments({ commentId, status: "Dislike" });
        });
    }
    deleteAllLikesForComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield comment_like_schema_1.CommentLikeModel.deleteMany({ commentId });
        });
    }
    getLikesInfo(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [likesCount, dislikesCount, myStatus] = yield Promise.all([
                this.getLikesCount(commentId),
                this.getDislikesCount(commentId),
                userId ? this.getUserLikeStatus(commentId, userId) : Promise.resolve("None")
            ]);
            return {
                likesCount,
                dislikesCount,
                myStatus
            };
        });
    }
};
exports.CommentLikesRepository = CommentLikesRepository;
exports.CommentLikesRepository = CommentLikesRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentLikesRepository);
