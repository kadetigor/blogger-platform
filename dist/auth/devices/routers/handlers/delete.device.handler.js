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
exports.deleteDeviceHandler = void 0;
const security_devices_service_1 = require("../../security-devices.service");
const httpStatus_1 = require("../../../../core/types/httpStatus");
const security_device_repository_1 = require("../../security-device.repository");
const deleteDeviceHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const deviceId = req.params.id;
        // Check if device exists
        const device = yield security_device_repository_1.securityDeviceRepository.findByDeviceId(deviceId);
        if (!device) {
            res.status(httpStatus_1.HttpStatus.NotFound).send();
            return;
        }
        // Check ownership
        const isOwner = yield security_devices_service_1.securityDevicesService.validateDeviceOwnership(userId, deviceId);
        if (!isOwner) {
            res.status(httpStatus_1.HttpStatus.Forbidden).send();
            return;
        }
        // Delete device
        yield security_devices_service_1.securityDevicesService.deleteDevice(userId, deviceId);
        res.status(httpStatus_1.HttpStatus.NoContent).send();
        return;
    }
    catch (error) {
        console.error('Error in deleteDeviceHandler:', error);
        res.status(httpStatus_1.HttpStatus.InternalServerError).send();
        return;
    }
});
exports.deleteDeviceHandler = deleteDeviceHandler;
