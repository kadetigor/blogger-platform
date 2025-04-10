import {Blog} from "../types/blog";
import { blogCollection } from "../../db/mongoDb";
import {blogInputDto} from "../dto/blogsDto";
import { ObjectId, WithId } from "mongodb";

export const blogsRepository = {
    // Найти все блоги
    async findAll(): Promise<WithId<Blog>[]> {
        return blogCollection.find().toArray();
    },

    // Найти блог по ID
    async findById(id: string): Promise<WithId<Blog> | null> {
        return blogCollection.findOne({_id: new ObjectId(id)})
    },

    // Создать новый блог
    async create(newBlog: Blog): Promise<WithId<Blog>> {
        const insertResult = await blogCollection.insertOne(newBlog)
        return { ...newBlog, _id: insertResult.insertedId}
    },

    // Обновить данные поста
    async update(id: string, dto: blogInputDto): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl
                }
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error('Blog does not exist')
        }
        return;
    },

    // Удалить пост
    async delete(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({
            _id: new ObjectId(id),
        })

        if (deleteResult.deletedCount < 1) {
            throw new Error('Blog does not exist')
        }

        return;
    },

    async getBlogName(id: string): Promise<string> {
        const blogResult = await blogCollection.findOne({_id: new ObjectId(id)});

        if(!blogResult) {
            throw new Error('No blog with this id')
        }

        return blogResult.name;
    }
};