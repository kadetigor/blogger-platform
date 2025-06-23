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
exports.loginHandler = loginHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const auth_service_1 = require("../../application/auth.service");
const settings_1 = require("../../../core/settings/settings");
const security_devices_service_1 = require("../../devices/security-devices.service");
function loginHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loginOrEmail, password } = req.body;
            const headers = req.headers['user-agent'];
            const ip = req.ip;
            const result = yield auth_service_1.authService.loginUser(loginOrEmail, password);
            if (result.status !== httpStatus_1.HttpStatus.Ok) {
                res.status(httpStatus_1.HttpStatus.Unauthorized).send(result.extensions);
                return;
            }
            const { accessToken, refreshToken, userId } = result.data;
            yield security_devices_service_1.securityDevicesService.createDevice(userId, ip, headers);
            res.cookie('refreshToken', refreshToken, {
                maxAge: settings_1.SETTINGS.REFRESH_TIME * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.status(httpStatus_1.HttpStatus.Ok).send({ accessToken: accessToken });
        }
        catch (e) {
            res.status(httpStatus_1.HttpStatus.InternalServerError);
        }
    });
}
