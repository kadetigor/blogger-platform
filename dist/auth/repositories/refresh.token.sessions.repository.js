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
exports.refreshTokenSessionsRepository = {
    createSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDb_1.refreshTokenSessionCollection.insertOne(session);
        });
    },
    findSessionByTokenId(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.refreshTokenSessionCollection.findOne({ tokenId });
        });
    },
    invalidateSession(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.refreshTokenSessionCollection.updateOne({ tokenId }, { $set: { isRevoked: true } });
            return result.modifiedCount > 0;
        });
    },
    deleteExpiredSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDb_1.refreshTokenSessionCollection.deleteMany({
                expiresAt: { $lt: new Date() }
            });
        });
    },
    // Add these new methods for device-related operations
    deleteByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.refreshTokenSessionCollection.deleteMany({ deviceId });
            return result.deletedCount > 0;
        });
    },
    deleteAllUserSessionsExceptOne(userId, deviceIdToKeep) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.refreshTokenSessionCollection.deleteMany({
                userId,
                deviceId: { $ne: deviceIdToKeep }
            });
            return result.deletedCount > 0;
        });
    },
    findSessionsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.refreshTokenSessionCollection.find({ userId }).toArray();
        });
    }
};
