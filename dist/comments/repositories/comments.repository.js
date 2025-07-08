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
exports.commentsRepository = void 0;
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const comment_schema_1 = require("../domain/comment.schema");
exports.commentsRepository = {
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentModel.findById(id);
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Comment does not exist');
            }
            return result;
        });
    },
    create(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = new comment_schema_1.CommentModel(newComment);
            const savedComment = yield comment.save();
            return savedComment._id.toString();
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentModel.findByIdAndUpdate(id, {
                $set: {
                    content: dto.content,
                },
            });
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Comment does not exist');
            }
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comment_schema_1.CommentModel.findByIdAndDelete(id);
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Comment does not exist');
            }
            return;
        });
    }
};
