import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/httpStatus";
import {createErrorMessages} from "../../../core/utils/errorUtils";
import {blogsRepository} from "../../repositories/blogsRepository";

export function deleteBlogHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const blog = blogsRepository.findById(id.toString());

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ message: 'Blog not found', field: 'id' }]),
            );
        return;
    }
    blogsRepository.delete(id.toString());
    res.sendStatus(HttpStatus.NoContent);
}