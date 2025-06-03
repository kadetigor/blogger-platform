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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../../core/settings/settings");
exports.jwtService = {
    createToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, settings_1.SETTINGS.AC_SECRET, { expiresIn: settings_1.SETTINGS.AC_TIME });
    },
    decodeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.decode(token);
            }
            catch (e) {
                console.error("Can't decode token", e);
                return null;
            }
        });
    },
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.AC_SECRET);
            }
            catch (error) {
                console.error("Token verify some error");
                return null;
            }
        });
    },
};
