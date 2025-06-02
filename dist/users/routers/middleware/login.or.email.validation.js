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
exports.loginOrEmailValidator = void 0;
const mongoDb_1 = require("../../../db/mongoDb");
const loginRegex = /^[a-zA-Z0-9_-]*$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const loginOrEmailValidator = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const input = value === null || value === void 0 ? void 0 : value.trim();
    if (!input) {
        throw new Error('loginOrEmail is required');
    }
    if (emailRegex.test(input)) {
        // It's an email
        const existingEmail = yield mongoDb_1.userCollection.findOne({ email: input });
        if (existingEmail) {
            throw new Error('This email is already taken');
        }
    }
    else if (loginRegex.test(input)) {
        // It's a login
        if (input.length < 3 || input.length > 10) {
            throw new Error('Login length must be 3-10 characters');
        }
        const existingLogin = yield mongoDb_1.userCollection.findOne({ login: input });
        if (existingLogin) {
            throw new Error('This login is already taken');
        }
    }
    else {
        throw new Error('loginOrEmail must be a valid login or email');
    }
    return true;
});
exports.loginOrEmailValidator = loginOrEmailValidator;
