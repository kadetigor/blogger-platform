"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.SecurityDevicesService = void 0;
/*
### Create Security Devices Service
- [ ] Create file `src/auth/application/securityDevicesService.ts`
  - [X] Create `createDevice(userId: string, ip: string, userAgent: string)` function
  - [X] Create `parseUserAgent(userAgent: string)` function that returns device title
  - [X] Create `getAllUserDevices(userId: string)` function
  - [X] Create `deleteDevice(userId: string, deviceId: string)` function
  - [X] Create `deleteAllOtherDevices(userId: string, currentDeviceId: string)` function
  - [X] Create `updateDeviceActivity(deviceId: string)` function
  - [X] Create `validateDeviceOwnership(userId: string, deviceId: string)` function
*/
require("reflect-metadata");
const settings_1 = require("../../core/settings/settings");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const security_device_repository_1 = require("./security-device.repository");
const inversify_1 = require("inversify");
let SecurityDevicesService = class SecurityDevicesService {
    constructor(securityDeviceRepository) {
        this.securityDeviceRepository = securityDeviceRepository;
    }
    createDevice(userId, ip, header) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = (0, uuid_1.v4)();
            yield this.createDeviceWithId(userId, deviceId, ip, header);
        });
    }
    createDeviceWithId(userId, deviceId, ip, header) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAgent = yield this.parseUserAgent(header);
            const device = {
                deviceId: deviceId,
                userId: userId,
                ip: ip,
                title: userAgent,
                lastActiveDate: new Date(),
                expiresAt: (0, date_fns_1.add)(new Date(), { seconds: settings_1.SETTINGS.REFRESH_TIME })
            };
            yield this.securityDeviceRepository.create(device);
        });
    }
    parseUserAgent(userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return default if no user agent
            if (!userAgent) {
                return "Unknown Device";
            }
            // Common browser patterns with their regex
            const browsers = [
                { name: "Edge", regex: /Edg\/(\d+)/ },
                { name: "Chrome", regex: /Chrome\/(\d+)/ },
                { name: "Firefox", regex: /Firefox\/(\d+)/ },
                { name: "Safari", regex: /Version\/(\d+).*Safari/ },
                { name: "Opera", regex: /OPR\/(\d+)|Opera\/(\d+)/ },
            ];
            // Check for mobile
            const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
            const deviceType = isMobile ? "Mobile " : "";
            // Try to match each browser pattern
            for (const browser of browsers) {
                const match = userAgent.match(browser.regex);
                if (match) {
                    // match[1] contains the version number captured by (\d+)
                    const version = match[1] || match[2]; // Opera might use match[2]
                    return `${deviceType}${browser.name} ${version}`;
                }
            }
            // If no browser matched, check for some common cases
            if (userAgent.includes("Postman")) {
                return "Postman";
            }
            if (userAgent.includes("curl")) {
                return "curl";
            }
            // Default fallback
            return deviceType ? "Mobile Browser" : "Unknown Browser";
        });
    }
    getAllUserDevices(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.securityDeviceRepository.findDevicesByUserId(userId);
            }
            catch (e) {
                console.log("Get all users' devices faild:", e);
            }
        });
    }
    deleteDevice(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceOwnership = yield this.validateDeviceOwnership(userId, deviceId);
            if (!deviceOwnership) {
                return false;
            }
            try {
                yield this.securityDeviceRepository.deleteByDeviceId(deviceId);
                return;
            }
            catch (e) {
                console.log('Device delition faild:', e);
            }
        });
    }
    deleteAllOtherDevices(userId, currentDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.securityDeviceRepository.deleteAllExceptOne(userId, currentDeviceId);
                return;
            }
            catch (e) {
                console.log('Device delition faild:', e);
            }
        });
    }
    updateDeviceActivity(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.securityDeviceRepository.updateLastActiveDate(deviceId, new Date());
            }
            catch (e) {
                console.log('Device delition faild:', e);
            }
        });
    }
    validateDeviceOwnership(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.securityDeviceRepository.findByDeviceId(deviceId);
            if (!device) {
                return false; // Device not found
            }
            if (device.userId !== userId) {
                return false;
            }
            return true;
        });
    }
};
exports.SecurityDevicesService = SecurityDevicesService;
exports.SecurityDevicesService = SecurityDevicesService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(security_device_repository_1.SecurityDeviceRepository)),
    __metadata("design:paramtypes", [security_device_repository_1.SecurityDeviceRepository])
], SecurityDevicesService);
