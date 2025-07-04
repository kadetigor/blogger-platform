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
const mongodb_1 = require("mongodb");
require("reflect-metadata");
const mongoDb_1 = require("../../db/mongoDb");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const inversify_1 = require("inversify");
let UsersRepository = class UsersRepository {
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield mongoDb_1.userCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!res) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
            return res;
        });
    }
    findByConfirmationCode(emailConfirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDb_1.userCollection.findOne({
                "emailConfirmation.confirmationCode": emailConfirmationCode
            });
            return user;
        });
    }
    create(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongoDb_1.userCollection.insertOne(newUser);
            return insertResult.insertedId.toString();
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongoDb_1.userCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    login: dto.login,
                    password: dto.password,
                    email: dto.email,
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
            return;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield mongoDb_1.userCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
        });
    }
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongoDb_1.userCollection.findOne({
                $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
            });
        });
    }
    updateConfirmation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.userCollection
                .updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    }
    updateConfirmationCode(_id, newConfirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.userCollection.updateOne({ _id }, { $set: { 'emailConfirmation.confirmationCode': newConfirmationCode } });
            return result.modifiedCount === 1;
        });
    }
    updatePassword(_id, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.userCollection.updateOne({ _id }, { $set: { 'passwordHash': passwordHash } });
            return result.modifiedCount === 1;
        });
    }
    clearRecoveryCode(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.userCollection.updateOne({ _id }, { $set: { 'emailConfirmation.confirmationCode': '' } });
            return result.modifiedCount === 1;
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
