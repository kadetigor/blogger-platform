import { body } from 'express-validator';

export const contentValidation = body('content')
    .exists().withMessage('Content is required')
    .isString().withMessage('content should be string')
    .trim().isLength({ min: 20, max: 300 }).withMessage('Content should have no less then 20 characters and no more then 300 characters')