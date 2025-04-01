import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogsRepository';

const titleValidation = body('title')
    .isString().withMessage('title should be string')
    .trim().isLength({ max: 30 }).withMessage('Length of title is more than 30 characters');

const shortDescriptionValidation = body('shortDescription')
    .isString().withMessage('phoneNumber should be string')
    .trim().isLength({ max: 100 }).withMessage('shortDescription is too long');

const contentValidation = body('content')
    .isString().withMessage('content should be string')
    .trim().isLength({ max: 1000 }).withMessage('Content is too long');

const blogIdValidation = body('blogId')
    .isString().withMessage('blogId should be string')
    .custom((value) => {
        const blog = blogsRepository.findById(value);
        if (!blog) {
            throw new Error('No blog with this id');
        }
        return true;
    });


export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];