"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../../db/db");
exports.blogsRepository = {
    // Найти все посты
    findAll() {
        return db_1.db.blogs;
    },
    // Найти пост по ID
    findById(id) {
        var _a;
        return (_a = db_1.db.blogs.find((d) => d.id === id)) !== null && _a !== void 0 ? _a : null;
    },
    // Создать новый пост
    create(newDriver) {
        db_1.db.blogs.push(newDriver);
        return newDriver;
    },
    // Обновить данные поста
    update(id, dto) {
        const Blog = db_1.db.blogs.find((d) => d.id === id);
        if (!Blog) {
            throw new Error('Blog not exist');
        }
        Blog.name = dto.name;
        Blog.description = dto.description;
        Blog.websiteUrl = dto.websiteUrl;
        return;
    },
    // Удалить пост
    delete(id) {
        const index = db_1.db.blogs.findIndex((v) => v.id === id);
        if (index === -1) {
            throw new Error('Blog not exist');
        }
        db_1.db.blogs.splice(index, 1);
        return;
    },
    getBlogName(id) {
        const blog = db_1.db.blogs.find((d) => d.id === id);
        if (!blog) {
            throw new Error('No blog with this id');
        }
        return blog.name;
    }
};
