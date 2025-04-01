import { Request, Response } from 'express';
import { PostInputDto } from '../../dto/postInputDto';
import { HttpStatus } from '../../../core/types/httpStatus';
import { db } from '../../../db/db';
import { Post } from '../../types/post';
import { blogsRepository } from '../../../blogs/repositories/blogsRepository'
import { postsRepository } from '../../repositories/postsRepository';


export function createPostHandler(
    req: Request<{}, {}, PostInputDto>,
    res: Response,
) {
    const blogName = blogsRepository.getBlogName(req.body.blogId);

    const newPost: Post = {
        id: (db.posts.length ? db.posts[db.posts.length - 1].id + 1 : 1).toString(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blogName
    };

    postsRepository.create(newPost);
    res.status(HttpStatus.Created).send(newPost);
}