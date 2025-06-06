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
exports.authService = void 0;
const jwt_service_1 = require("../adapters/jwt.service");
const bcrypt_service_1 = require("../adapters/bcrypt.service");
const httpStatus_1 = require("../../core/types/httpStatus");
const usersRepository_1 = require("../../users/repositories/usersRepository");
exports.authService = {
    loginUser(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.checkUserCredentials(loginOrEmail, password);
            if (result.status !== httpStatus_1.HttpStatus.Ok)
                return {
                    status: httpStatus_1.HttpStatus.Unauthorized,
                    errorMessage: 'Unauthorized',
                    extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
                    data: null,
                };
            const accessToken = yield jwt_service_1.jwtService.createToken(result.data._id.toString(), result.data.login);
            return {
                status: httpStatus_1.HttpStatus.Ok,
                data: { accessToken },
                extensions: [],
            };
        });
    },
    checkUserCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersRepository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user)
                return {
                    status: httpStatus_1.HttpStatus.NotFound,
                    data: null,
                    errorMessage: 'Not Found',
                    extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
                };
            const isPassCorrect = yield bcrypt_service_1.bcryptService.checkPassword(password, user.passwordHash);
            if (!isPassCorrect)
                return {
                    status: httpStatus_1.HttpStatus.BadRequest,
                    data: null,
                    errorMessage: 'Bad Request',
                    extensions: [{ field: 'password', message: 'Wrong password' }],
                };
            return {
                status: httpStatus_1.HttpStatus.Ok,
                data: user,
                extensions: [],
            };
        });
    },
};
