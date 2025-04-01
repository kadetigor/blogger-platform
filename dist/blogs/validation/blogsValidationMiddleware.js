"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteUrlValidationMiddleware = exports.descriptionValidationMiddleware = exports.nameValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidationMiddleware = (0, express_validator_1.param)('name')
    .exists().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ max: 15 }).withMessage('Name must not be more than 15 characters long')
    .isNumeric().withMessage('Name must be a numeric string');
exports.descriptionValidationMiddleware = (0, express_validator_1.param)('description')
    .exists().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description must not be more than 500 characters long');
exports.websiteUrlValidationMiddleware = (0, express_validator_1.param)('websiteUrl')
    .exists().withMessage('Website URL is required')
    .isString().withMessage('Website URL must be a string')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Website URL must be a valid URL');
