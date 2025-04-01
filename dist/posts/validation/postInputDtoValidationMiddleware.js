"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const blogsRepository_1 = require("../../blogs/repositories/blogsRepository");
const titleValidation = (0, express_validator_1.body)('title')
    .isString().withMessage('title should be string')
    .trim().isLength({ max: 30 }).withMessage('Length of title is more than 30 characters');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .isString().withMessage('phoneNumber should be string')
    .trim().isLength({ max: 100 }).withMessage('shortDescription is too long');
const contentValidation = (0, express_validator_1.body)('content')
    .isString().withMessage('content should be string')
    .trim().isLength({ max: 1000 }).withMessage('Content is too long');
const blogIdValidation = (0, express_validator_1.body)('blogId')
    .isString().withMessage('blogId should be string')
    .custom((value) => {
    const blog = blogsRepository_1.blogsRepository.findById(value);
    if (!blog) {
        throw new Error('No blog with this id');
    }
    return true;
});
exports.postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
