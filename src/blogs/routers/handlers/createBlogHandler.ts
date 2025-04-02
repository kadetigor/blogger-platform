import {Request, Response} from "express";
import {blogInputDto} from "../../dto/blogsDto";
import {Blog} from "../../types/blog";
import {db} from "../../../db/db";
import {blogsRepository} from "../../repositories/blogsRepository";
import {HttpStatus} from "../../../core/types/httpStatus";

export function createBlogHandler(
    req: Request<{}, {}, blogInputDto>,
    res: Response,
) {
    const newBlog: Blog = {
        id: (db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1).toString(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    blogsRepository.create(newBlog);
    res.status(HttpStatus.Created).send(newBlog);
}