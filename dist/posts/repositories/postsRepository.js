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
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const post_schema_1 = require("../domain/post.schema");
exports.postsRepository = {
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_schema_1.PostModel.findById(id);
            if (!post) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Post does not exist');
            }
            return post;
        });
    },
    create(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = new post_schema_1.PostModel(newPost);
            const savedPost = yield post.save();
            return savedPost._id.toString();
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_schema_1.PostModel.findByIdAndUpdate(id, {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId,
            }, { runValidators: true });
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Post does not exist');
            }
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_schema_1.PostModel.findByIdAndDelete(id);
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Post does not exist');
            }
            return;
        });
    }
};
