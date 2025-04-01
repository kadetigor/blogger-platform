import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/utils/errorUtils';
import { blogsRepository } from '../../repositories/blogsRepository';

export function getBlogHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const blog = blogsRepository.findById(id.toString());

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
            );
        return;
    }

    res.send(blog);
}