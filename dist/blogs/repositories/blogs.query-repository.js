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
exports.BlogsQueryRepository = void 0;
const blog_schema_1 = require("../domain/blog.schema");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const inversify_1 = require("inversify");
let BlogsQueryRepository = class BlogsQueryRepository {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchNameTerm && searchNameTerm.trim() !== "") {
                filter.name = {
                    // case-insensitive "contains"
                    $regex: searchNameTerm,
                    $options: "i",
                };
            }
            // Execute both queries in parallel for better performance
            const [items, totalCount] = yield Promise.all([
                blog_schema_1.BlogModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .lean() // Use lean() for better performance when you don't need Mongoose document methods
                    .exec(),
                blog_schema_1.BlogModel.countDocuments(filter).exec()
            ]);
            return { items, totalCount };
        });
    }
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_schema_1.BlogModel.findById(id).exec();
            if (!blog) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Blog does not exist');
            }
            return blog;
        });
    }
    getBlogName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use select() to only fetch the name field for better performance
            const blog = yield blog_schema_1.BlogModel
                .findById(id)
                .select('name')
                .lean()
                .exec();
            if (!blog) {
                throw new Error('No blog with this id');
            }
            return blog.name;
        });
    }
};
exports.BlogsQueryRepository = BlogsQueryRepository;
exports.BlogsQueryRepository = BlogsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsQueryRepository);
;
