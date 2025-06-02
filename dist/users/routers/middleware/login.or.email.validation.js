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
const loginOrEmailValidator = (value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
    const login = req.body.login;
    const email = req.body.email;
    if ((!login || login.trim() === '') && (!email || email.trim() === '')) {
        throw new Error('Either login or email is required');
    }
    if (login && login.trim() !== '') {
        if (login.length < 3 || login.length > 10) {
            throw new Error('Login length must be 3-10 characters');
        }
        if (!loginRegex.test(login)) {
            throw new Error('Login must contain only characters, numbers, underscores or dashes');
        }
        const existingLogin = yield mongoDb_1.userCollection.findOne({ login });
        if (existingLogin) {
            throw new Error('This login is already taken');
        }
    }
    if (email && email.trim() !== '') {
        if (!emailRegex.test(email)) {
            throw new Error('Email must be valid');
        }
        const existingEmail = yield mongoDb_1.userCollection.findOne({ email });
        if (existingEmail) {
            throw new Error('This email is already taken');
        }
    }
    return true;
});
exports.loginOrEmailValidator = loginOrEmailValidator;
