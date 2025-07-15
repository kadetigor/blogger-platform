"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeQueryValidation = void 0;
const express_validator_1 = require("express-validator");
exports.likeQueryValidation = (0, express_validator_1.body)('likeStatus')
    .exists()
    .withMessage('likeStatus is Required')
    .isString()
    .withMessage('likeStatus must be a String')
    .isIn(['None', 'Like', 'Dislike'])
    .withMessage('likeStatus contains invalid value');
