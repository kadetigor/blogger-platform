import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogsRepository";

export function getBlogsListHandler(req: Request, res: Response) {
    const blogs = blogsRepository.findAll();
    res.send(blogs);
}