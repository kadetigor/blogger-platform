"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const titleValidation = (0, express_validator_1.body)('title')
    .exists().withMessage('Title is required')
    .isString().withMessage('title should be string')
    .trim().isLength({ min: 1, max: 30 }).withMessage('Length of title is more than 30 characters');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .exists().withMessage('shortDescription is required')
    .isString().withMessage('shortDescription should be string')
    .trim().isLength({ min: 1, max: 100 }).withMessage('shortDescription is too long');
const contentValidation = (0, express_validator_1.body)('content')
    .exists().withMessage('Content is required')
    .isString().withMessage('content should be string')
    .trim().isLength({ min: 1, max: 1000 }).withMessage('Content is too long');
// No blogId validation for /blogs/:id/posts route
exports.blogPostInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation
];
