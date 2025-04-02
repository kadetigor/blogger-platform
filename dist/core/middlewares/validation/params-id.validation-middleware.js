"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.idValidationMiddleware = (0, express_validator_1.param)('id')
    .exists().withMessage('id is required')
    .isString().withMessage('id must be a string');
