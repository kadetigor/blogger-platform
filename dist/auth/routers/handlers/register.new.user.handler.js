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
exports.registrationHandler = registrationHandler;
const auth_service_1 = require("../../application/auth.service");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const httpStatus_1 = require("../../../core/types/httpStatus");
function registrationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { login, email, password } = req.body;
            const result = yield auth_service_1.authService.registerUser(login, email, password);
            if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                res.status(result.status).json({
                    errorsMessages: result.extensions
                });
                return;
            }
            if ((_a = result.data) === null || _a === void 0 ? void 0 : _a.confirmationCode) {
                res.status(httpStatus_1.HttpStatus.NoContent).json({
                    confirmationCode: result.data.confirmationCode
                });
                return;
            }
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
