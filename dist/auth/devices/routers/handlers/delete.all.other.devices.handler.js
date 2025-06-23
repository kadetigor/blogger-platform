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
exports.deleteAllOtherDevicesHandler = void 0;
const httpStatus_1 = require("../../../../core/types/httpStatus");
const auth_service_1 = require("../../../application/auth.service");
const security_devices_service_1 = require("../../security-devices.service");
const deleteAllOtherDevicesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get userId from authenticated request
        const userId = req.userId;
        // Get current deviceId from refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(httpStatus_1.HttpStatus.Unauthorized).send();
            return;
        }
        // Extract deviceId from the refresh token
        const currentDeviceId = yield auth_service_1.authService.extractDeviceIdFromToken(refreshToken);
        if (!currentDeviceId) {
            res.status(httpStatus_1.HttpStatus.Unauthorized).send();
            return;
        }
        // Delete all other devices except current one
        yield security_devices_service_1.securityDevicesService.deleteAllOtherDevices(userId, currentDeviceId);
        res.status(httpStatus_1.HttpStatus.NoContent).send();
        return;
    }
    catch (error) {
        console.error('Error in deleteAllOtherDevicesHandler:', error);
        res.status(httpStatus_1.HttpStatus.Unauthorized).send();
        return;
    }
});
exports.deleteAllOtherDevicesHandler = deleteAllOtherDevicesHandler;
