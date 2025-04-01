import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/utils/errorUtils';
import { postsRepository } from '../../repositories/postsRepository';

export function deletePostHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const post = postsRepository.findById(id.toString());

    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ message: 'Post not found', field: 'id' }]),
            );
        return;
    }

    postsRepository.delete(id.toString());
    res.sendStatus(HttpStatus.NoContent);
}