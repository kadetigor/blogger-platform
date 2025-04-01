import { Post } from "../types/post";
import { db } from "../../db/db";
import { PostInputDto } from '../dto/postInputDto'
import { blogsRepository } from '../../blogs/repositories/blogsRepository';

export const postsRepository = {
    // Найти все посты
    findAll(): Post[] {
        return db.posts;
    },

    // Найти пост по ID
    findById(id: string): Post | null {
        return db.posts.find((p) => p.id === id) ?? null;
    },

    // Создать новый пост
    create(newPost: Post): Post {
        db.posts.push(newPost);
        return newPost;
    },

    // Обновить данные поста
    update(id: string, dto: PostInputDto): void {
        const post = db.posts.find((a) => a.id === id);

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
    delete(id: string): void {
        const index = db.posts.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new Error('Post not exist');
        }

        db.posts.splice(index, 1);
        return;
    },
};