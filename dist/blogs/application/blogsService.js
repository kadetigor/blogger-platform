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
exports.blogsService = void 0;
const blogs_repository_1 = require("../repositories/blogs.repository");
exports.blogsService = {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl,
                createdAt: new Date(),
                isMembership: false
            };
            return blogs_repository_1.blogsRepository.create(newBlog);
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield blogs_repository_1.blogsRepository.update(id, dto);
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield blogs_repository_1.blogsRepository.delete(id);
            return;
        });
    },
};
