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
exports.refreshTokenSessionsRepository = void 0;
const mongoDb_1 = require("../../db/mongoDb");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
exports.refreshTokenSessionsRepository = {
    create(newSession) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongoDb_1.refreshTokenSessionCollection.insertOne(newSession);
            return insertResult.insertedId.toString();
        });
    },
    findByTokenId(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoDb_1.refreshTokenSessionCollection.findOne({
                "tokenId": tokenId
            });
            if (!session) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Session does not exist');
            }
            return session;
        });
    },
    findByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoDb_1.refreshTokenSessionCollection.findOne({
                "deviceId": deviceId
            });
            if (!session) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Session does not exist');
            }
            return session;
        });
    },
    updateToRevoked(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongoDb_1.refreshTokenSessionCollection.updateOne({
                tokenId: tokenId
            }, {
                $set: {
                    isRevoked: true
                },
            });
            if (updateResult.modifiedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Session with provided tokenId does not exist');
            }
            return updateResult.modifiedCount > 0;
        });
    },
    deleteExpired() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const filter = {
                expiresAt: { $lt: now },
            };
            const result = yield mongoDb_1.refreshTokenSessionCollection.deleteMany(filter);
            return result.deletedCount;
        });
    },
};
