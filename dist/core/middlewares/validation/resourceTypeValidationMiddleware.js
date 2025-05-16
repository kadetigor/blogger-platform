"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceTypeValidation = resourceTypeValidation;
const express_validator_1 = require("express-validator");
function resourceTypeValidation(resourceType) {
    return (0, express_validator_1.body)('data.type')
        .isString()
        .equals(resourceType).withMessage(`Resource type must be ${resourceType}`);
}
