"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.postIdValidationMiddleware = (0, express_validator_1.param)('postId')
    .exists().withMessage('postId is required')
    .isString().withMessage('postId must be a string')
    .isMongoId().withMessage('Incorrect format of ObjectId');
