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
exports.postsRepository = void 0;
const mongoDb_1 = require("../../db/mongoDb");
const mongodb_1 = require("mongodb");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
exports.postsRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            const items = yield mongoDb_1.postCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield mongoDb_1.postCollection.countDocuments(filter);
            return { items, totalCount };
        });
    },
    findPostsbyBlog(queryDto, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`recieved ${queryDto} and ${blogId} at findPostsbyBlog`);
            const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc', } = queryDto;
            console.log(`queryDto → pageNumber=${pageNumber}, pageSize=${pageSize}, sortBy=${sortBy}, sortDirection=${sortDirection}`);
            const filter = { blogId: blogId };
            const skip = (pageNumber - 1) * pageSize;
            const [items, totalCount] = yield Promise.all([
                mongoDb_1.postCollection
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .toArray(),
                mongoDb_1.postCollection.countDocuments(filter),
            ]);
            console.log(`got ${items} and ${totalCount} at findPostsbyBlog before returning them`);
            return { items, totalCount };
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield mongoDb_1.postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!res) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Post does not exist');
            }
            return res;
        });
    },
    create(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongoDb_1.postCollection.insertOne(newPost);
            return insertResult.insertedId.toString();
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongoDb_1.postCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Post does not exist');
            }
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield mongoDb_1.postCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Post does not exist');
            }
            return;
        });
    }
};
