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
exports.securityDeviceRepository = void 0;
const mongoDb_1 = require("../../db/mongoDb");
exports.securityDeviceRepository = {
    create(device) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDb_1.securityDevicesCollection.insertOne(device);
        });
    },
    findByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoDb_1.securityDevicesCollection.findOne({ deviceId });
            }
            catch (error) {
                console.error('Error finding device by deviceId:', error);
                return null;
            }
        });
    },
    findDevicesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.securityDevicesCollection.find({ userId }).toArray();
        });
    },
    updateLastActiveDate(deviceId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.securityDevicesCollection.updateOne({ deviceId }, { $set: { lastActiveDate } });
            return result.modifiedCount > 0;
        });
    },
    deleteByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.securityDevicesCollection.deleteOne({ deviceId });
            return result.deletedCount > 0;
        });
    },
    deleteAllExceptOne(userId, deviceIdToKeep) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.securityDevicesCollection.deleteMany({
                userId,
                deviceId: { $ne: deviceIdToKeep }
            });
            return result.deletedCount > 0;
        });
    },
    deleteAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.securityDevicesCollection.deleteMany({ userId });
            return result.deletedCount > 0;
        });
    }
};
