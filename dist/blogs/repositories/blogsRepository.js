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
const blog_schema_1 = require("../domain/blog.schema");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
exports.blogsRepository = {
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_schema_1.BlogModel.findById(id);
            if (!blog) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not exist');
            }
            return blog;
        });
    },
    create(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = new blog_schema_1.BlogModel(newBlog);
            const savedBlog = yield blog.save();
            return savedBlog._id.toString();
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blog_schema_1.BlogModel.findByIdAndUpdate(id, {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl
            }, { runValidators: true });
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not exist');
            }
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blog_schema_1.BlogModel.findByIdAndDelete(id);
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not exist');
            }
        });
    }
};
