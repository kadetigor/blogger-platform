"use strict";
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
exports.securityDevicesService = void 0;
const settings_1 = require("../../core/settings/settings");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const security_device_repository_1 = require("./security-device.repository");
exports.securityDevicesService = {
    createDevice(userId, ip, header) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = (0, uuid_1.v4)();
            yield this.createDeviceWithId(userId, deviceId, ip, header);
        });
    },
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
            yield security_device_repository_1.securityDeviceRepository.create(device);
        });
    },
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
    },
    getAllUserDevices(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield security_device_repository_1.securityDeviceRepository.findDevicesByUserId(userId);
            }
            catch (e) {
                console.log("Get all users' devices faild:", e);
            }
        });
    },
    deleteDevice(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceOwnership = yield this.validateDeviceOwnership(userId, deviceId);
            if (!deviceOwnership) {
                return false;
            }
            try {
                yield security_device_repository_1.securityDeviceRepository.deleteByDeviceId(deviceId);
                return;
            }
            catch (e) {
                console.log('Device delition faild:', e);
            }
        });
    },
    deleteAllOtherDevices(userId, currentDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield security_device_repository_1.securityDeviceRepository.deleteAllExceptOne(userId, currentDeviceId);
                return;
            }
            catch (e) {
                console.log('Device delition faild:', e);
            }
        });
    },
    updateDeviceActivity(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield security_device_repository_1.securityDeviceRepository.updateLastActiveDate(deviceId, new Date());
            }
            catch (e) {
                console.log('Device delition faild:', e);
            }
        });
    },
    validateDeviceOwnership(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield security_device_repository_1.securityDeviceRepository.findByDeviceId(deviceId);
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
