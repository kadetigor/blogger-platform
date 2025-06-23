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
exports.refreshTokenHandler = refreshTokenHandler;
const auth_service_1 = require("../../application/auth.service");
const httpStatus_1 = require("../../../core/types/httpStatus");
const settings_1 = require("../../../core/settings/settings");
function refreshTokenHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(httpStatus_1.HttpStatus.Unauthorized).json({
                    errorsMessages: [{ field: 'refreshToken', message: 'Refresh token required' }]
                });
                return;
            }
            const deviceId = yield auth_service_1.authService.extractDeviceIdFromToken(refreshToken);
            if (!deviceId) {
                res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                return;
            }
            const result = yield auth_service_1.authService.refreshTokens(refreshToken);
            if (result.status !== httpStatus_1.HttpStatus.Ok) {
                res.status(result.status).json({ errorsMessages: result.extensions });
                return;
            }
            const { accessToken, refreshToken: newRefreshToken } = result.data;
            res.cookie('refreshToken', newRefreshToken, {
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
