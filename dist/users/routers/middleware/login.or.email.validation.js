"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOrEmailValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginOrEmailValidation = (0, express_validator_1.body)("loginOrEmail")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("loginOrEmail is not correct");
