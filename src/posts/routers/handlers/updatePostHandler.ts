import { Request, Response } from 'express';
import { PostInputDto } from '../../dto/postInputDto';
import { HttpStatus } from '../../../core/types/httpStatus';
import { createErrorMessages } from '../../../core/utils/errorUtils';
import { postsRepository } from '../../repositories/postsRepository';

export function updatePostHandler(
    req: Request<{ id: string }, {}, PostInputDto>,
    res: Response,
) {
    const id = parseInt(req.params.id);
    const post = postsRepository.findById(id.toString());

    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
            );
        return;
    }

    postsRepository.update(id.toString(), req.body);
    res.sendStatus(HttpStatus.NoContent);
}