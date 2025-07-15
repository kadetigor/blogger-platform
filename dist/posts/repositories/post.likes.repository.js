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
exports.PostLikeRepository = void 0;
const inversify_1 = require("inversify");
const post_like_schema_1 = require("../domain/post.like.schema");
let PostLikeRepository = class PostLikeRepository {
    setLikeStatus(postId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (status === "None") {
                yield post_like_schema_1.PostLikeModel.deleteOne({ postId, userId });
                return;
            }
            yield post_like_schema_1.PostLikeModel.findOneAndUpdate({ postId, userId }, {
                $set: {
                    status,
                    createdAt: new Date()
                }
            }, { upsert: true });
        });
    }
    getUserLikeStatus(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield post_like_schema_1.PostLikeModel.findOne({ postId, userId });
            return like ? like.status : "None";
        });
    }
    getLikesCount(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_like_schema_1.PostLikeModel.countDocuments({ postId, status: "Like" });
        });
    }
    getDislikesCount(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_like_schema_1.PostLikeModel.countDocuments({ postId, status: "Dislike" });
        });
    }
    deleteAllLikesForPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield post_like_schema_1.PostLikeModel.deleteMany({ postId });
        });
    }
    findNewestLikes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                // Match likes for this post
                {
                    $match: {
                        postId: postId,
                        status: "Like"
                    }
                },
                // Sort by newest first
                {
                    $sort: { createdAt: -1 }
                },
                // Limit to 3
                {
                    $limit: 3
                },
                // Join with users collection
                {
                    $lookup: {
                        from: 'users', // MongoDB collection name (usually lowercase plural)
                        let: { userId: '$userId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', { $toObjectId: '$$userId' }]
                                    }
                                }
                            },
                            {
                                $project: {
                                    login: 1
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                // Unwind the user array (convert from array to object)
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Final projection
                {
                    $project: {
                        addedAt: '$createdAt',
                        userId: '$userId',
                        login: { $ifNull: ['$user.login', 'Unknown'] }
                    }
                }
            ];
            const result = yield post_like_schema_1.PostLikeModel.aggregate(pipeline);
            return result;
        });
    }
    getExtendedLikesInfo(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [likesCount, dislikesCount, myStatus, newestLikes] = yield Promise.all([
                this.getLikesCount(postId),
                this.getDislikesCount(postId),
                userId ? this.getUserLikeStatus(postId, userId) : Promise.resolve("None"),
                this.findNewestLikes(postId),
            ]);
            return {
                likesCount,
                dislikesCount,
                myStatus,
                newestLikes
            };
        });
    }
};
exports.PostLikeRepository = PostLikeRepository;
exports.PostLikeRepository = PostLikeRepository = __decorate([
    (0, inversify_1.injectable)()
], PostLikeRepository);
