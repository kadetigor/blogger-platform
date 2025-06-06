"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.contentValidation = (0, express_validator_1.body)('content')
    .exists().withMessage('Content is required')
    .isString().withMessage('content should be string')
    .trim().isLength({ min: 20, max: 300 }).withMessage('Content should have no less then 20 characters and no more then 300 characters');
