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
const refreshTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }
    try {
        // Верифицируем refresh токен
        const payload = yield jwt_adapter_1.jwtService.verifyRefreshToken(refreshToken);
        if (!payload) {
            res.sendStatus(401);
            return;
        }
        // Проверяем валидность сессии в БД
        const sessionValidation = yield auth_service_1.authService.validateRefreshSession(payload.tokenId);
        if (!sessionValidation.isValid) {
            res.sendStatus(401);
            return;
        }
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
