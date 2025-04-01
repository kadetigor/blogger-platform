"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db/db");
exports.postsRepository = {
    // Найти все посты
    findAll() {
        return db_1.db.posts;
    },
    // Найти пост по ID
    findById(id) {
        var _a;
        return (_a = db_1.db.posts.find((d) => d.id === id)) !== null && _a !== void 0 ? _a : null;
    },
    // Создать новый пост
    create(newDriver) {
        db_1.db.posts.push(newDriver);
        return newDriver;
    },
    // Обновить данные поста
    update(id, dto) {
        const post = db_1.db.posts.find((d) => d.id === id);
        if (!post) {
            throw new Error('Post not exist');
        }
        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId;
        return;
    },
    // Удалить пост
    delete(id) {
        const index = db_1.db.posts.findIndex((v) => v.id === id);
        if (index === -1) {
            throw new Error('Driver not exist');
        }
        db_1.db.posts.splice(index, 1);
        return;
    },
};
