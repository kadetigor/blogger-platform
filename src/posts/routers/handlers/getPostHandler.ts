import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/utils/errorUtils';
import { postsRepository } from '../../repositories/postsRepository';

export function getPostHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const post = postsRepository.findById(id.toString());

    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Post not found' }]),
            );
        return;
    }

    res.send(post);
}