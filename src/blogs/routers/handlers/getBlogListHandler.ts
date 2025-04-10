import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HttpStatus } from "../../../core/types/httpStatus";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";

export async function getBlogsListHandler(req: Request, res: Response) {
  try {
    const blogs = await blogsRepository.findAll();
    const blogViewModel = blogs.map(mapToBlogViewModel)
    res.send(blogViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}
