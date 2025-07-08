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
exports.commentsQueryRepository = void 0;
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const comment_schema_1 = require("../domain/comment.schema");
exports.commentsQueryRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            const [items, totalCount] = yield Promise.all([
                comment_schema_1.CommentModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .lean()
                    .exec(),
                comment_schema_1.CommentModel.countDocuments(filter).exec()
            ]);
            return { items, totalCount };
        });
    },
    findCommentsByPost(queryDto, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = queryDto;
            const filter = { postId: postId };
            const skip = (pageNumber - 1) * pageSize;
            const [items, totalCount] = yield Promise.all([
                comment_schema_1.CommentModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .lean()
                    .exec(),
                comment_schema_1.CommentModel.countDocuments(filter).exec(),
            ]);
            return { items, totalCount };
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentModel.findById(id).exec();
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Comment does not exist');
            }
            return result;
        });
    }
};
