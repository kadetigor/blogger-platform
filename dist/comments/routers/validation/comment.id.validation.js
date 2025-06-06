"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentIdValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.commentIdValidationMiddleware = (0, express_validator_1.param)('commentId')
    .exists().withMessage('commentId is required')
    .isString().withMessage('commentId must be a string')
    .isMongoId().withMessage('Incorrect format of ObjectId');
