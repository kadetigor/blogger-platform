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
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const mongoDb_1 = require("../../db/mongoDb");
exports.securityDeviceRepository = {
    create(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongoDb_1.securityDevicesCollection.insertOne(device);
            return insertResult.insertedId.toString();
        });
    },
    findDevicesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield mongoDb_1.securityDevicesCollection.find({
                "userId": userId
            });
            if (!devices) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Devices for this user do not exist.');
            }
            return devices.toArray();
        });
    },
    findByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield mongoDb_1.securityDevicesCollection.findOne({
                "deviceId": deviceId
            });
            if (!device) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Device with provided deviceId does not exist.');
            }
            return device;
        });
    },
    updateLastActiveDate(deviceId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongoDb_1.securityDevicesCollection.updateOne({
                deviceId: deviceId
            }, {
                $set: {
                    lastActiveDate: date
                },
            });
            return updateResult.modifiedCount > 0;
        });
    },
    deleteByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.securityDevicesCollection.deleteOne({
                deviceId: deviceId
            });
            if (result.deletedCount === 0) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Device with provided deviceId does not exist.');
            }
            return;
        });
    },
    deleteAllExceptOne(userId, deviceIdToKeep) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.securityDevicesCollection.deleteMany({
                userId: userId,
                deviceId: { $ne: deviceIdToKeep }
            });
            if (result.deletedCount === 0) {
            }
            return;
        });
    },
    deleteExpiredDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const filter = {
                expiresAt: { $lt: now },
            };
            const result = yield mongoDb_1.securityDevicesCollection.deleteMany(filter);
            return result.deletedCount;
        });
    }
};
