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
exports.blogsRepository = void 0;
const mongoDb_1 = require("../../db/mongoDb");
const mongodb_1 = require("mongodb");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
exports.blogsRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            const items = yield mongoDb_1.blogCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield mongoDb_1.blogCollection.countDocuments(filter);
            return { items, totalCount };
        });
    },
    // async findById(id: string): Promise<WithId<Blog> | null> {
    //  return blogCollection.findOne({ _id: new ObjectId(id) });
    // },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield mongoDb_1.blogCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!res) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not exist');
            }
            return res;
        });
    },
    create(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongoDb_1.blogCollection.insertOne(newBlog);
            return insertResult.insertedId.toString();
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongoDb_1.blogCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl,
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not Exist');
            }
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield mongoDb_1.blogCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not exist');
            }
            return;
        });
    },
    getBlogName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogResult = yield mongoDb_1.blogCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blogResult) {
                throw new Error('No blog with this id');
            }
            return blogResult.name;
        });
    }
};
