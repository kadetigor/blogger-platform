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
exports.ScurityDevicesController = void 0;
const httpStatus_1 = require("../../../core/types/httpStatus");
const auth_service_1 = require("../../application/auth.service");
const security_devices_service_1 = require("../security-devices.service");
const refresh_token_sessions_repository_1 = require("../../repositories/refresh.token.sessions.repository");
const inversify_1 = require("inversify");
const jwt_adapter_1 = require("../../adapters/jwt.adapter");
const bcrypt_adapter_1 = require("../../adapters/bcrypt.adapter");
const usersRepository_1 = require("../../../users/repositories/usersRepository");
const security_device_repository_1 = require("../security-device.repository");
const map_to_device_view_model_1 = require("../map.to.device.view.model");
let ScurityDevicesController = class ScurityDevicesController {
    constructor(jwtService, refreshTokenSessionsRepository, bcryptService, securityDevicesService, securityDeviceRepository, usersRepository, authService) {
        this.jwtService = jwtService;
        this.refreshTokenSessionsRepository = refreshTokenSessionsRepository;
        this.bcryptService = bcryptService;
        this.securityDevicesService = securityDevicesService;
        this.securityDeviceRepository = securityDeviceRepository;
        this.usersRepository = usersRepository;
        this.authService = authService;
    }
    deleteAllOtherDevicesHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get userId from authenticated request
                const userId = req.userId;
                // Get current deviceId from refresh token
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                    return;
                }
                // Extract deviceId from the refresh token
                const currentDeviceId = yield this.authService.extractDeviceIdFromToken(refreshToken);
                if (!currentDeviceId) {
                    res.status(httpStatus_1.HttpStatus.Unauthorized).send();
                    return;
                }
                // Delete all other devices except current one
                yield this.securityDevicesService.deleteAllOtherDevices(userId, currentDeviceId);
                // IMPORTANT: Also delete all refresh token sessions for other devices
                // This ensures refresh tokens for deleted devices become invalid
                yield this.refreshTokenSessionsRepository.deleteAllUserSessionsExceptOne(userId, currentDeviceId);
                res.status(httpStatus_1.HttpStatus.NoContent).send();
                return;
            }
            catch (error) {
                console.error('Error in deleteAllOtherDevicesHandler:', error);
                res.status(httpStatus_1.HttpStatus.InternalServerError).send();
                return;
            }
        });
    }
    deleteDeviceHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const deviceIdToDelete = req.params.id;
                // Check if device exists
                const device = yield this.securityDeviceRepository.findByDeviceId(deviceIdToDelete);
                if (!device) {
                    res.status(httpStatus_1.HttpStatus.NotFound).send();
                    return;
                }
                // Check ownership
                if (device.userId !== userId) {
                    res.status(httpStatus_1.HttpStatus.Forbidden).send();
                    return;
                }
                // Delete the device
                yield this.securityDeviceRepository.deleteByDeviceId(deviceIdToDelete);
                // IMPORTANT: Also invalidate all refresh token sessions for this device
                // This ensures the refresh token becomes invalid after device deletion
                yield this.refreshTokenSessionsRepository.deleteByDeviceId(deviceIdToDelete);
                res.status(httpStatus_1.HttpStatus.NoContent).send();
                return;
            }
            catch (error) {
                console.error('Error in deleteDeviceHandler:', error);
                res.status(httpStatus_1.HttpStatus.InternalServerError).send();
                return;
            }
        });
    }
    getDevicesHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get userId from authenticated request
                const userId = req.userId;
                const devices = yield this.securityDevicesService.getAllUserDevices(userId);
                if (!devices || devices.length === 0) {
                    res.status(httpStatus_1.HttpStatus.Ok).json([]);
                    return;
                }
                const devicesViewModels = devices.map(device => (0, map_to_device_view_model_1.mapToDeviceViewModel)(device));
                res.status(httpStatus_1.HttpStatus.Ok).json(devicesViewModels);
                return;
            }
            catch (e) {
                console.error('Error in getDevicesHandler:', e);
                res.status(httpStatus_1.HttpStatus.InternalServerError).send();
                return;
            }
        });
    }
};
exports.ScurityDevicesController = ScurityDevicesController;
exports.ScurityDevicesController = ScurityDevicesController = __decorate([
    __param(0, (0, inversify_1.inject)(jwt_adapter_1.JwtService)),
    __param(1, (0, inversify_1.inject)(refresh_token_sessions_repository_1.RefreshTokenSessionsRepository)),
    __param(2, (0, inversify_1.inject)(bcrypt_adapter_1.BcryptService)),
    __param(3, (0, inversify_1.inject)(security_devices_service_1.SecurityDevicesService)),
    __param(4, (0, inversify_1.inject)(security_device_repository_1.SecurityDeviceRepository)),
    __param(5, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(6, (0, inversify_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [jwt_adapter_1.JwtService,
        refresh_token_sessions_repository_1.RefreshTokenSessionsRepository,
        bcrypt_adapter_1.BcryptService,
        security_devices_service_1.SecurityDevicesService,
        security_device_repository_1.SecurityDeviceRepository,
        usersRepository_1.UsersRepository,
        auth_service_1.AuthService])
], ScurityDevicesController);
