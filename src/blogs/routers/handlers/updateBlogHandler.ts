import {Request, Response} from "express";
import {blogInputDto} from "../../dto/blogsDto";
import {HttpStatus} from "../../../core/types/httpStatus";
import {createErrorMessages} from "../../../core/utils/errorUtils";
import {blogsRepository} from "../../repositories/blogsRepository";

export function updateBlogHandler(
    req: Request<{id: string}, {}, blogInputDto>,
    res: Response,
) {
    const id = parseInt(req.params.id);
    const blog = blogsRepository.findById(id.toString());

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
            );
        return;
    }
    blogsRepository.update(id.toString(), req.body);
    res.sendStatus(HttpStatus.NoContent);
}