import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/postsRepository';

export function getPostListHandler(req: Request, res: Response) {
    const drivers = postsRepository.findAll();
    res.send(drivers);
}