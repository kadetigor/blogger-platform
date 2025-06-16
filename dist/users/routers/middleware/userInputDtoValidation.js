"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInputDtoValidation = exports.passwordValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoDb_1 = require("../../../db/mongoDb");
const loginValidation = (0, express_validator_1.body)('login')
    .exists().withMessage('Login is required')
    .isString().withMessage('Login should be a string')
    .trim().isLength({ min: 3, max: 10 }).withMessage('Length of the Login should be no less then 3 characters and no more then 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login must contain only characters and numbers')
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield mongoDb_1.userCollection.findOne({
        $or: [{ login }, { email: login }]
    });
    if (existing) {
        throw new Error('This login is already taken');
    }
    return true;
}));
exports.passwordValidation = (0, express_validator_1.body)('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password should be a string')
    .trim().isLength({ min: 6, max: 20 }).withMessage('Length of the Password should be no less then 6 characters and no more then 20 characters');
const emailValidation = (0, express_validator_1.body)('email')
    .exists().withMessage('Email is required')
    .isString().withMessage('Email should be a string')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email must be a valid email format')
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield mongoDb_1.userCollection.findOne({
        $or: [{ email }, { login: email }]
    });
    if (existing) {
        throw new Error('This email is already taken');
    }
    return true;
}));
exports.userInputDtoValidation = [
    loginValidation,
    exports.passwordValidation,
    emailValidation,
];
