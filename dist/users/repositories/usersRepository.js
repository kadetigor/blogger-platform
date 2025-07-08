"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UsersRepository = void 0;
require("reflect-metadata");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const inversify_1 = require("inversify");
const user_schema_1 = require("../domain/user.schema");
let UsersRepository = class UsersRepository {
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UserModel.findById(id);
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
            return result;
        });
    }
    findByConfirmationCode(emailConfirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_schema_1.UserModel.findByConfirmationCode(emailConfirmationCode);
        });
    }
    create(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_schema_1.UserModel(newUser);
            const savedUser = yield user.save();
            return savedUser._id.toString();
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UserModel.findByIdAndUpdate(id, {
                login: dto.login,
                password: dto.password,
                email: dto.email,
            });
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
            return;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UserModel.findByIdAndDelete(id);
            if (!result) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
        });
    }
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_schema_1.UserModel.findByLoginOrEmail(loginOrEmail);
        });
    }
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UserModel.findByIdAndUpdate(id, { $set: { 'emailConfirmation.isConfirmed': true } });
            return !!result;
        });
    }
    updateConfirmationCode(id, newConfirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UserModel.findByIdAndUpdate(id, { $set: { 'emailConfirmation.confirmationCode': newConfirmationCode } });
            return !!result;
        });
    }
    updatePassword(id, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UserModel.findByIdAndUpdate(id, { $set: { passwordHash } });
            return !!result;
        });
    }
    clearRecoveryCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_schema_1.UserModel.findByIdAndUpdate(id, { $set: { 'emailConfirmation.confirmationCode': '' } });
            return !!result;
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
