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
exports.logoutHandler = logoutHandler;
const auth_service_1 = require("../../application/auth.service");
const httpStatus_1 = require("../../../core/types/httpStatus");
const jwt_adapter_1 = require("../../adapters/jwt.adapter");
const security_device_repository_1 = require("../../devices/security-device.repository");
function logoutHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get refresh token from cookies
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                return;
            }
            // Verify refresh token to get payload
            const payload = yield jwt_adapter_1.jwtService.verifyRefreshToken(refreshToken);
            if (!payload) {
                res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                return;
            }
            // Logout through auth service (this will invalidate the refresh token session)
            const result = yield auth_service_1.authService.logout(refreshToken);
            if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                res.status(result.status).json({ errorsMessages: result.extensions });
                return;
            }
            // Delete the device from security devices collection
            // This is important for the tests that check device list after logout
            try {
                yield security_device_repository_1.securityDeviceRepository.deleteByDeviceId(payload.deviceId);
            }
            catch (error) {
                console.error('Failed to delete device during logout:', error);
                // Continue with logout even if device deletion fails
            }
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            // Return 204 No Content on successful logout
            res.status(httpStatus_1.HttpStatus.NoContent).send();
            return;
        }
        catch (error) {
            console.error('Error in logoutHandler:', error);
            res.status(httpStatus_1.HttpStatus.InternalServerError).send();
            return;
        }
    });
}
