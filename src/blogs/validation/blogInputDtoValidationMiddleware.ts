import { body } from 'express-validator';

export const nameValidationMiddleware = body('name')
    .exists().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ max: 15 }).withMessage('Name must not be more than 15 characters long');

export const descriptionValidationMiddleware = body('description')
    .exists().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description must not be more than 500 characters long');

export const websiteUrlValidationMiddleware = body('websiteUrl')
    .exists().withMessage('Website URL is required')
    .isString().withMessage('Website URL must be a string')
    .trim().isLength({ max: 100 }).withMessage('Website URL must not be more than 100 characters long')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Website URL must be a valid URL');

export const blogInputDtoValidation = [
    nameValidationMiddleware,
    descriptionValidationMiddleware,
    websiteUrlValidationMiddleware
];