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
exports.loginHandler = loginHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const bcrypt_service_1 = require("../../adapters/bcrypt.service");
const mongoDb_1 = require("../../../db/mongoDb");
function loginHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loginOrEmail, password } = req.body;
            // Find user by login or email
            const user = yield mongoDb_1.userCollection.findOne({
                $or: [
                    { login: loginOrEmail },
                    { email: loginOrEmail }
                ]
            });
            // If user not found or password doesn't match
            if (!user || !(yield bcrypt_service_1.bcryptService.checkPassword(password, user.passwordHash))) {
                res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
                return;
            }
            // Login successful
            res.sendStatus(httpStatus_1.HttpStatus.NoContent);
        }
        catch (e) {
            res.sendStatus(httpStatus_1.HttpStatus.InternalServerError);
        }
    });
}
