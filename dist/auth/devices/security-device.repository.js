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
exports.SecurityDeviceRepository = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const security_device_schema_1 = require("./security.device.schema");
let SecurityDeviceRepository = class SecurityDeviceRepository {
    create(newDevice) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = new security_device_schema_1.SecurityDeviceModel(newDevice);
            yield device.save();
        });
    }
    findByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield security_device_schema_1.SecurityDeviceModel.findOne({ "deviceId": deviceId });
            }
            catch (error) {
                console.error('Error finding device by deviceId:', error);
                return null;
            }
        });
    }
    findDevicesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield security_device_schema_1.SecurityDeviceModel.find({ "userId": userId }).lean();
        });
    }
    updateLastActiveDate(deviceId, lastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield security_device_schema_1.SecurityDeviceModel.updateOne({ deviceId }, { $set: { lastActiveDate: lastActiveDate } });
            return result.modifiedCount > 0;
        });
    }
    deleteByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield security_device_schema_1.SecurityDeviceModel.deleteOne({ "deviceId": deviceId });
            return result.deletedCount > 0;
        });
    }
    deleteAllExceptOne(userId, deviceIdToKeep) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield security_device_schema_1.SecurityDeviceModel.deleteMany({
                userId,
                deviceId: { $ne: deviceIdToKeep }
            });
            return result.deletedCount > 0;
        });
    }
    deleteAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield security_device_schema_1.SecurityDeviceModel.deleteMany({ "userId": userId });
            return result.deletedCount > 0;
        });
    }
};
exports.SecurityDeviceRepository = SecurityDeviceRepository;
exports.SecurityDeviceRepository = SecurityDeviceRepository = __decorate([
    (0, inversify_1.injectable)()
], SecurityDeviceRepository);
;
