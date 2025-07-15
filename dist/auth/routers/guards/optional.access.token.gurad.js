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
exports.optionalAccessTokenGuard = void 0;
const jwt_adapter_1 = require("../../adapters/jwt.adapter");
const jwtService = new jwt_adapter_1.JwtService();
const optionalAccessTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    // If no auth header, continue without setting user
    if (!authHeader) {
        next();
        return;
    }
    // Split into ["Bearer", "<token>"]
    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer' || !token) {
        next();
        return;
    }
    try {
        const payload = yield jwtService.verifyToken(token);
        if (payload) {
            // Attach user ID to req.user
            req.user = {
                id: payload.userId,
                login: payload.userLogin,
            };
        }
    }
    catch (err) {
        // If token is invalid, just continue without user
    }
    next();
});
exports.optionalAccessTokenGuard = optionalAccessTokenGuard;
