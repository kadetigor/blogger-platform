"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataIdMatchValidation = exports.idValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.idValidationMiddleware = (0, express_validator_1.param)('id')
    .exists().withMessage('id is required')
    .isString().withMessage('id must be a string')
    .isMongoId().withMessage('Incorrect format of ObjectId');
exports.dataIdMatchValidation = (0, express_validator_1.body)('data.id')
    .exists().withMessage('ID in body is required')
    .custom((value, { req }) => {
    var _a;
    if (value !== ((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new Error('ID in URL and body must match');
    }
    return true;
});
