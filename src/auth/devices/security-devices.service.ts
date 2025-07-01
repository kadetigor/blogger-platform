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

import { SecurityDevice } from "./security-device";
import { SETTINGS } from "../../core/settings/settings";
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import { securityDeviceRepository } from "./security-device.repository";
import { WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const securityDevicesService = {
  async createDevice(userId: string, ip: string, header: string): Promise<void> {
    const deviceId = uuid()
    await this.createDeviceWithId(userId, deviceId, ip, header)
  },

  async createDeviceWithId(userId: string, deviceId: string, ip: string, header: string): Promise<void> {
    const userAgent = await this.parseUserAgent(header)
    const device = {
        deviceId: deviceId,
        userId: userId,
        ip: ip,
        title: userAgent,
        lastActiveDate: new Date(),
        expiresAt: add(new Date(), { seconds: SETTINGS.REFRESH_TIME as number })
    } as SecurityDevice

    await securityDeviceRepository.create(device)
  },

  async parseUserAgent(userAgent: string | undefined): Promise<string> {
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
  },

  async getAllUserDevices(userId: string): Promise<WithId<SecurityDevice>[] | undefined> {
    try {
        return await securityDeviceRepository.findDevicesByUserId(userId)
    } catch (e:unknown){
        console.log("Get all users' devices faild:", e);
    }
  },

  async deleteDevice(userId: string, deviceId: string): Promise<void | boolean> {
    const deviceOwnership = await this.validateDeviceOwnership(userId, deviceId)

    if (!deviceOwnership) {
        return false
    }
    try {
        await securityDeviceRepository.deleteByDeviceId(deviceId)
        return
    } catch (e: unknown) {
        console.log('Device delition faild:', e);
    }
  },

  async deleteAllOtherDevices(userId: string, currentDeviceId: string): Promise<void> {
    try {
        await securityDeviceRepository.deleteAllExceptOne(userId, currentDeviceId)
        return
    } catch (e: unknown) {
        console.log('Device delition faild:', e);
    }
  },

  async updateDeviceActivity(deviceId: string): Promise<boolean | undefined> {
    try {
        return await securityDeviceRepository.updateLastActiveDate(deviceId, new Date())
    } catch (e: unknown) {
        console.log('Device delition faild:', e);
    }
  },

  async validateDeviceOwnership(userId: string, deviceId: string): Promise<boolean> {
    const device = await securityDeviceRepository.findByDeviceId(deviceId);
    if (!device) {
        return false; // Device not found
    }
    if (device.userId !== userId) {
        return false;
    }
    return true;
}
}