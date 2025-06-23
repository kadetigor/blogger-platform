"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToDeviceViewModel = mapToDeviceViewModel;
function mapToDeviceViewModel(device) {
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate.toISOString(),
        deviceId: device.deviceId
    };
}
