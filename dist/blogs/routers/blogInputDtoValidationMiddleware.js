"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInputDtoValidation = exports.websiteUrlValidationMiddleware = exports.descriptionValidationMiddleware = exports.nameValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidationMiddleware = (0, express_validator_1.body)('name')
    .exists().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim().isLength({ min: 1, max: 15 }).withMessage('Name must not be more than 15 characters long');
exports.descriptionValidationMiddleware = (0, express_validator_1.body)('description')
    .exists().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 1, max: 500 }).withMessage('Description must not be more than 500 characters long');
exports.websiteUrlValidationMiddleware = (0, express_validator_1.body)('websiteUrl')
    .exists().withMessage('Website URL is required')
    .isString().withMessage('Website URL must be a string')
    .trim().isLength({ min: 1, max: 100 }).withMessage('Website URL must not be more than 100 characters long')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Website URL must be a valid URL');
exports.blogInputDtoValidation = [
    exports.nameValidationMiddleware,
    exports.descriptionValidationMiddleware,
    exports.websiteUrlValidationMiddleware
];
