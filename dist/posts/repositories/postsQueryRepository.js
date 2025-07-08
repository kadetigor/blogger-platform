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
exports.postsQueryRepository = void 0;
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const post_schema_1 = require("../domain/post.schema");
exports.postsQueryRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            const [items, totalCount] = yield Promise.all([
                post_schema_1.PostModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .lean() // Use lean() for better performance when you don't need Mongoose document methods
                    .exec(),
                post_schema_1.PostModel.countDocuments(filter).exec()
            ]);
            return { items, totalCount };
        });
    },
    findPostsbyBlog(queryDto, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = queryDto;
            const filter = { blogId: blogId };
            const skip = (pageNumber - 1) * pageSize;
            const [items, totalCount] = yield Promise.all([
                post_schema_1.PostModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .lean()
                    .exec(),
                post_schema_1.PostModel.countDocuments(filter).exec(),
            ]);
            return { items, totalCount };
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_schema_1.PostModel.findById(id).exec();
            if (!post) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Post does not exist');
            }
            return post;
        });
    }
};
