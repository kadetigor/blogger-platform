"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthController = void 0;
require("reflect-metadata");
const jwt_adapter_1 = require("../../adapters/jwt.adapter");
const refresh_token_sessions_repository_1 = require("../../repositories/refresh.token.sessions.repository");
const bcrypt_adapter_1 = require("../../adapters/bcrypt.adapter");
const security_devices_service_1 = require("../../devices/security-devices.service");
const security_device_repository_1 = require("../../devices/security-device.repository");
const usersRepository_1 = require("../../../users/repositories/usersRepository");
const auth_service_1 = require("../../application/auth.service");
const inversify_1 = require("inversify");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const httpStatus_1 = require("../../../core/types/httpStatus");
const settings_1 = require("../../../core/settings/settings");
const usersQueryRepository_1 = require("../../../users/repositories/usersQueryRepository");
let AuthController = class AuthController {
    constructor(jwtService, refreshTokenSessionsRepository, bcryptService, securityDevicesService, securityDeviceRepository, usersRepository, usersQueryRepository, authService) {
        this.jwtService = jwtService;
        this.refreshTokenSessionsRepository = refreshTokenSessionsRepository;
        this.bcryptService = bcryptService;
        this.securityDevicesService = securityDevicesService;
        this.securityDeviceRepository = securityDeviceRepository;
        this.usersRepository = usersRepository;
        this.usersQueryRepository = usersQueryRepository;
        this.authService = authService;
    }
    confirmEmailHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.confirmEmail(req.body.code);
                if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                    res.status(result.status).json({
                        errorsMessages: result.extensions
                    });
                    return;
                }
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    confirmPasswordResetHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const code = req.body.recoveryCode;
                const newPassword = req.body.newPassword;
                const result = yield this.authService.confirmPasswordRecovery(code, newPassword);
                if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                    res.status(result.status).json({
                        errorsMessages: result.extensions
                    });
                    return;
                }
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    loginHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { loginOrEmail, password } = req.body;
                const headers = req.headers['user-agent'];
                const ip = req.ip;
                const result = yield this.authService.loginUser(loginOrEmail, password);
                if (result.status !== httpStatus_1.HttpStatus.Ok) {
                    res.status(httpStatus_1.HttpStatus.Unauthorized).send(result.extensions);
                    return;
                }
                const { accessToken, refreshToken, userId, deviceId } = result.data;
                yield this.securityDevicesService.createDeviceWithId(userId, deviceId, ip, headers);
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
    logoutHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get refresh token from cookies
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                    return;
                }
                // Verify refresh token to get payload
                const payload = yield this.jwtService.verifyRefreshToken(refreshToken);
                if (!payload) {
                    res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                    return;
                }
                // Logout through auth service (this will invalidate the refresh token session)
                const result = yield this.authService.logout(refreshToken);
                if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                    res.status(result.status).json({ errorsMessages: result.extensions });
                    return;
                }
                // Delete the device from security devices collection
                // This is important for the tests that check device list after logout
                try {
                    yield this.securityDeviceRepository.deleteByDeviceId(payload.deviceId);
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
    passwordRecoveryEmailHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.authService.sendPasswordRecoveryEmail(email);
                if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                    res.status(result.status).json({
                        errorsMessages: result.extensions
                    });
                    return;
                }
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    refreshTokenHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    res.status(httpStatus_1.HttpStatus.Unauthorized).json({
                        errorsMessages: [{ field: 'refreshToken', message: 'Refresh token required' }]
                    });
                    return;
                }
                const deviceId = yield this.authService.extractDeviceIdFromToken(refreshToken);
                if (!deviceId) {
                    res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                    return;
                }
                yield this.securityDevicesService.updateDeviceActivity(deviceId);
                const result = yield this.authService.refreshTokens(refreshToken);
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
    registrationHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, email, password } = req.body;
                const result = yield this.authService.registerUser(login, email, password);
                if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                    res.status(result.status).json({
                        errorsMessages: result.extensions
                    });
                    return;
                }
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    resendConfirmEmailHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.authService.resendConfirmationEmail(email);
                if (result.status !== httpStatus_1.HttpStatus.NoContent) {
                    res.status(result.status).json({
                        errorsMessages: result.extensions
                    });
                    return;
                }
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getInfoOnCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
                return;
            }
            try {
                const user = yield this.usersQueryRepository.findByIdOrFail(userId);
                // Return only the required fields: userId, login, email
                const meResponse = {
                    userId: user._id.toString(),
                    login: user.login,
                    email: user.email
                };
                res.status(httpStatus_1.HttpStatus.Ok).send(meResponse);
            }
            catch (error) {
                res.sendStatus(httpStatus_1.HttpStatus.NotFound);
            }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    __param(0, (0, inversify_1.inject)(jwt_adapter_1.JwtService)),
    __param(1, (0, inversify_1.inject)(refresh_token_sessions_repository_1.RefreshTokenSessionsRepository)),
    __param(2, (0, inversify_1.inject)(bcrypt_adapter_1.BcryptService)),
    __param(3, (0, inversify_1.inject)(security_devices_service_1.SecurityDevicesService)),
    __param(4, (0, inversify_1.inject)(security_device_repository_1.SecurityDeviceRepository)),
    __param(5, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(6, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __param(7, (0, inversify_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [jwt_adapter_1.JwtService,
        refresh_token_sessions_repository_1.RefreshTokenSessionsRepository,
        bcrypt_adapter_1.BcryptService,
        security_devices_service_1.SecurityDevicesService,
        security_device_repository_1.SecurityDeviceRepository,
        usersRepository_1.UsersRepository,
        usersQueryRepository_1.UsersQueryRepository,
        auth_service_1.AuthService])
], AuthController);
