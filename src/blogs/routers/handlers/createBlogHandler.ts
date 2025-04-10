import { Request, Response } from "express";
import { blogInputDto } from "../../dto/blogsDto";
import { Blog } from "../../types/blog";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HttpStatus } from "../../../core/types/httpStatus";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";

export async function createBlogHandler(
  req: Request<{}, {}, blogInputDto>,
  res: Response,
) {
  try {
    const newBlog: Blog = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    }
    const createdBlog = await blogsRepository.create(newBlog);
    const blogViewModel = mapToBlogViewModel(createdBlog);
    res.status(HttpStatus.Created).send(blogViewModel);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
