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
exports.getDevicesHandler = getDevicesHandler;
const security_devices_service_1 = require("../../security-devices.service");
const map_to_device_view_model_1 = require("../../map.to.device.view.model");
const httpStatus_1 = require("../../../../core/types/httpStatus");
function getDevicesHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const devices = yield security_devices_service_1.securityDevicesService.getAllUserDevices(req.user.id);
            if (!devices) {
                res.status(httpStatus_1.HttpStatus.BadRequest).send();
                return;
            }
            const devicesViewModels = devices.map(device => (0, map_to_device_view_model_1.mapToDeviceViewModel)(device));
            res.status(httpStatus_1.HttpStatus.Ok).json(devicesViewModels);
            return;
        }
        catch (e) {
            console.error('Error in getDevicesHandler:', e);
            res.status(httpStatus_1.HttpStatus.InternalServerError).send();
            return;
        }
    });
}
