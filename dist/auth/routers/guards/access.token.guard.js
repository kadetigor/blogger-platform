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
exports.accessTokenGuard = void 0;
const jwt_service_1 = require("../../adapters/jwt.service");
const accessTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }
    // Split into ["Bearer", "<token>"]
    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer' || !token) {
        res.sendStatus(401);
        return;
    }
    try {
        const payload = yield jwt_service_1.jwtService.verifyToken(token);
        if (!payload) {
            res.sendStatus(401);
            return;
        }
        // Attach user ID to req.user
        const { userId } = payload;
        req.user = { id: userId };
        next();
        return;
    }
    catch (err) {
        // Any verify error → 401
        res.sendStatus(401);
        return;
    }
});
exports.accessTokenGuard = accessTokenGuard;
