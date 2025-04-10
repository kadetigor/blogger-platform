import { Post } from "../types/post";
import { postInputDto } from '../dto/postInputDto'
import { blogsRepository } from '../../blogs/repositories/blogsRepository';
import { postCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";

export const postsRepository = {
  // Найти все посты
  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  // Найти пост по ID
  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  // Создать новый пост
  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },

  // Обновить данные поста
  async update(id: string, dto: postInputDto): Promise<void> {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId
        }
      }
    )
  },

  // Удалить пост
  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Driver not exist');
    }
    return;
  },
};
