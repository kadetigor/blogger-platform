import {Blog} from "../types/blog";
import {db} from "../../db/db";
import {blogInputDto} from "../dto/blogsDto";

export const blogsRepository = {
    // Найти все посты
    findAll(): Blog[] {
        return db.blogs;
    },

    // Найти пост по ID
    findById(id: string): Blog | null {
        return db.blogs.find((d) => d.id === id) ?? null;
    },

    // Создать новый пост
    create(newDriver: Blog): Blog {
        db.blogs.push(newDriver);
        return newDriver;
    },

    // Обновить данные поста
    update(id: string, dto: blogInputDto): void {
        const Blog = db.blogs.find((d) => d.id === id);

        if (!Blog) {
            throw new Error('Blog not exist');
        }

        Blog.name = dto.name;
        Blog.description = dto.description;
        Blog.websiteUrl = dto.websiteUrl;
        return;
    },

    // Удалить пост
    delete(id: string): void {
        const index = db.blogs.findIndex((v) => v.id === id);

        if (index === -1) {
            throw new Error('Driver not exist');
        }

        db.blogs.splice(index, 1);
        return;
    },

    getBlogName(id: string): string {
        const blog = db.blogs.find((d) => d.id === id);

        if (!blog) {
            throw new Error('No blog with this id');
        }

        return blog.name;
    }
};