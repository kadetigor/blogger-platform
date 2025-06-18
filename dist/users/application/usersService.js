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
exports.usersService = void 0;
const bcrypt_adapter_1 = require("../../auth/adapters/bcrypt.adapter");
const usersRepository_1 = require("../repositories/usersRepository");
const uuid_1 = require("uuid");
exports.usersService = {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = dto;
            const passwordHash = yield bcrypt_adapter_1.bcryptService.generateHash(password);
            // Create user with already confirmed email when created through admin endpoint
            const newUser = {
                login,
                email,
                passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    isConfirmed: true // Already confirmed for admin-created users
                }
            };
            return usersRepository_1.usersRepository.create(newUser);
        });
    },
};
