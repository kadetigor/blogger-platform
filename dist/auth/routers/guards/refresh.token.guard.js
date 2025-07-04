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
exports.refreshTokenGuard = void 0;
const jwt_adapter_1 = require("../../adapters/jwt.adapter");
const auth_service_1 = require("../../application/auth.service");
const refresh_token_sessions_repository_1 = require("../../repositories/refresh.token.sessions.repository");
const bcrypt_adapter_1 = require("../../adapters/bcrypt.adapter");
const security_devices_service_1 = require("../../devices/security-devices.service");
const usersRepository_1 = require("../../../users/repositories/usersRepository");
const security_device_repository_1 = require("../../devices/security-device.repository");
const jwtService = new jwt_adapter_1.JwtService();
const refreshTokenSessionsRepository = new refresh_token_sessions_repository_1.RefreshTokenSessionsRepository();
const bcryptService = new bcrypt_adapter_1.BcryptService();
const usersRepository = new usersRepository_1.UsersRepository();
const securityDeviceRepository = new security_device_repository_1.SecurityDeviceRepository();
const securityDevicesService = new security_devices_service_1.SecurityDevicesService(securityDeviceRepository);
const authService = new auth_service_1.AuthService(jwtService, refreshTokenSessionsRepository, bcryptService, securityDevicesService, usersRepository);
const refreshTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }
    try {
        // Верифицируем refresh токен
        const payload = yield jwtService.verifyRefreshToken(refreshToken);
        if (!payload) {
            res.sendStatus(401);
            return;
        }
        // Проверяем валидность сессии в БД
        const sessionValidation = yield authService.validateRefreshSession(payload.tokenId);
        if (!sessionValidation.isValid) {
            res.sendStatus(401);
            return;
        }
        req.userId = payload.userId;
        req.deviceId = payload.deviceId;
        // Attach user info to request
        req.user = {
            id: payload.userId,
            login: '', // Можно получить из БД если нужно
        };
        next();
        return;
    }
    catch (err) {
        res.sendStatus(401);
        return;
    }
});
exports.refreshTokenGuard = refreshTokenGuard;
