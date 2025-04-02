import {Request, Response} from "express";
import {blogInputDto} from "../../dto/blogsDto";
import {HttpStatus} from "../../../core/types/httpStatus";
import {createErrorMessages} from "../../../core/utils/errorUtils";
import {blogsRepository} from "../../repositories/blogsRepository";

export function updateBlogHandler(
    req: Request<{id: string}, {}, blogInputDto>,
    res: Response,
) {
    const id = req.params.id;
    const blog = blogsRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
            );
        return;
    }
    blogsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
}