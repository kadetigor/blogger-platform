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
exports.AuthService = void 0;
require("reflect-metadata");
const jwt_adapter_1 = require("../adapters/jwt.adapter");
const bcrypt_adapter_1 = require("../adapters/bcrypt.adapter");
const httpStatus_1 = require("../../core/types/httpStatus");
const usersRepository_1 = require("../../users/repositories/usersRepository");
const email_manager_1 = require("../../email/managers/email.manager");
const uuid_1 = require("uuid");
const refresh_token_sessions_repository_1 = require("../repositories/refresh.token.sessions.repository");
const date_fns_1 = require("date-fns");
const settings_1 = require("../../core/settings/settings");
const security_devices_service_1 = require("../devices/security-devices.service");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const inversify_1 = require("inversify");
let AuthService = class AuthService {
    constructor(jwtService, refreshTokenSessionsRepository, bcryptService, securityDevicesService, usersRepository) {
        this.jwtService = jwtService;
        this.refreshTokenSessionsRepository = refreshTokenSessionsRepository;
        this.bcryptService = bcryptService;
        this.securityDevicesService = securityDevicesService;
        this.usersRepository = usersRepository;
    }
    loginUser(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.checkUserCredentials(loginOrEmail, password);
            if (result.status !== httpStatus_1.HttpStatus.Ok)
                return {
                    status: httpStatus_1.HttpStatus.Unauthorized,
                    errorMessage: 'Unauthorized',
                    extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
                    data: null,
                };
            const userId = result.data._id.toString();
            const accessToken = yield this.jwtService.createToken(userId, result.data.login);
            const deviceId = (0, uuid_1.v4)();
            const tokenId = yield this.createRefreshSession(userId, deviceId);
            const refreshToken = yield this.jwtService.createRefreshToken(userId, tokenId, deviceId);
            return {
                status: httpStatus_1.HttpStatus.Ok,
                data: { accessToken, refreshToken, userId, deviceId },
                extensions: []
            };
        });
    }
    checkUserCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return {
                    status: httpStatus_1.HttpStatus.Unauthorized,
                    errorMessage: 'Wrong credentials',
                    extensions: [{ field: 'loginOrEmail', message: 'Login or email is wrong' }],
                    data: null,
                };
            }
            const isPasswordCorrect = yield this.bcryptService.checkPassword(password, user.passwordHash);
            if (!isPasswordCorrect) {
                return {
                    status: httpStatus_1.HttpStatus.Unauthorized,
                    errorMessage: 'Wrong credentials',
                    extensions: [{ field: 'password', message: 'Password is wrong' }],
                    data: null,
                };
            }
            return {
                status: httpStatus_1.HttpStatus.Ok,
                data: user,
                extensions: [],
            };
        });
    }
    registerUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const existingUser = (yield this.usersRepository.findByLoginOrEmail(login)) ||
                (yield this.usersRepository.findByLoginOrEmail(email));
            if (existingUser) {
                const field = existingUser.login === login ? 'login' : 'email';
                return {
                    status: httpStatus_1.HttpStatus.BadRequest,
                    errorMessage: 'User already exists',
                    extensions: [{ field, message: `${field} already exists` }],
                    data: null,
                };
            }
            // Hash password
            const passwordHash = yield this.bcryptService.generateHash(password);
            // Generate confirmation code
            const confirmationCode = (0, uuid_1.v4)();
            // Create user with confirmation info
            const user = {
                login,
                email,
                passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode,
                    isConfirmed: false,
                },
            };
            // Save user
            const userId = yield this.usersRepository.create(user);
            if (!userId) {
                return {
                    status: httpStatus_1.HttpStatus.InternalServerError,
                    errorMessage: 'Failed to create user',
                    extensions: [],
                    data: null,
                };
            }
            // Send confirmation email
            try {
                yield email_manager_1.emailManager.sendEmailConfimationMessage(user);
            }
            catch (error) {
                console.log('Email sending failed, but user was created:', error);
            }
            return {
                status: httpStatus_1.HttpStatus.NoContent,
                data: { id: userId },
                extensions: [],
            };
        });
    }
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield this.usersRepository.findByConfirmationCode(code);
                // Check if already confirmed
                if ((_a = user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed) {
                    return {
                        status: httpStatus_1.HttpStatus.BadRequest,
                        errorMessage: 'Email already confirmed',
                        extensions: [{ field: 'code', message: 'Email is already confirmed' }],
                        data: null,
                    };
                }
                // Confirm email
                const confirmed = yield this.usersRepository.updateConfirmation(user.id);
                if (!confirmed) {
                    return {
                        status: httpStatus_1.HttpStatus.InternalServerError,
                        errorMessage: 'Failed to confirm email',
                        extensions: [],
                        data: null,
                    };
                }
                return {
                    status: httpStatus_1.HttpStatus.NoContent,
                    data: null,
                    extensions: [],
                };
            }
            catch (error) {
                // Handle repositoryNotFoundError when confirmation code doesn't exist
                if (error instanceof repositoryNotFoundError_1.repositoryNotFoundError) {
                    return {
                        status: httpStatus_1.HttpStatus.BadRequest,
                        errorMessage: 'Invalid confirmation code',
                        extensions: [{ field: 'code', message: 'Confirmation code is invalid' }],
                        data: null,
                    };
                }
                // Re-throw other errors
                throw error;
            }
        });
    }
    resendConfirmationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.usersRepository.findByLoginOrEmail(email);
            if (!user) {
                return {
                    status: httpStatus_1.HttpStatus.BadRequest,
                    data: null,
                    errorMessage: 'User not found',
                    extensions: [{ field: 'email', message: 'User with this email does not exist' }],
                };
            }
            // Check if user is already confirmed
            if ((_a = user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed) {
                return {
                    status: httpStatus_1.HttpStatus.BadRequest,
                    data: null,
                    errorMessage: 'Email already confirmed',
                    extensions: [{ field: 'email', message: 'Email is already confirmed' }],
                };
            }
            // Generate new confirmation code
            const newConfirmationCode = (0, uuid_1.v4)();
            // Update user with new confirmation code
            yield this.usersRepository.updateConfirmationCode(user.id, newConfirmationCode);
            // Try to send email with new code
            try {
                const updatedUser = Object.assign(Object.assign({}, user), { emailConfirmation: Object.assign(Object.assign({}, user.emailConfirmation), { confirmationCode: newConfirmationCode }) });
                yield email_manager_1.emailManager.sendEmailConfimationMessage(updatedUser);
            }
            catch (error) {
                console.log('Email sending failed, but code update continues:', error);
            }
            return {
                status: httpStatus_1.HttpStatus.NoContent,
                data: null,
                errorMessage: '',
                extensions: [],
            };
        });
    }
    refreshTokens(oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Verify old refresh token
                const payload = yield this.jwtService.verifyRefreshToken(oldRefreshToken);
                if (!payload) {
                    return {
                        status: httpStatus_1.HttpStatus.Unauthorized,
                        errorMessage: 'Invalid refresh token',
                        extensions: [{ field: 'refreshToken', message: 'Invalid token' }],
                        data: null,
                    };
                }
                // 2. Validate session in DB
                const sessionValidation = yield this.validateRefreshSession(payload.tokenId);
                if (!sessionValidation.isValid) {
                    return {
                        status: httpStatus_1.HttpStatus.Unauthorized,
                        errorMessage: 'Session invalid',
                        extensions: [{ field: 'refreshToken', message: sessionValidation.error || 'Session invalid' }],
                        data: null,
                    };
                }
                // 3. Revoke old session
                yield this.invalidateRefreshSession(payload.tokenId);
                // 4. Create new session with same deviceId
                const newTokenId = yield this.createRefreshSession(payload.userId, payload.deviceId);
                // 5. Create new tokens
                const user = yield this.usersRepository.findByIdOrFail(payload.userId);
                const accessToken = yield this.jwtService.createToken(payload.userId, user.login);
                const refreshToken = yield this.jwtService.createRefreshToken(payload.userId, newTokenId, payload.deviceId);
                // 6. Update device activity
                yield this.securityDevicesService.updateDeviceActivity(payload.deviceId);
                return {
                    status: httpStatus_1.HttpStatus.Ok,
                    data: { accessToken, refreshToken },
                    extensions: [],
                };
            }
            catch (error) {
                console.log('Refresh tokens failed:', error);
                return {
                    status: httpStatus_1.HttpStatus.Unauthorized,
                    errorMessage: 'Failed to refresh tokens',
                    extensions: [{ field: 'refreshToken', message: 'Token refresh failed' }],
                    data: null,
                };
            }
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Verify refresh token
                const payload = yield this.jwtService.verifyRefreshToken(refreshToken);
                if (!payload) {
                    return {
                        status: httpStatus_1.HttpStatus.Unauthorized,
                        errorMessage: 'Invalid refresh token',
                        extensions: [{ field: 'refreshToken', message: 'Invalid token' }],
                        data: null,
                    };
                }
                // 2. Validate session in DB
                const sessionValidation = yield this.validateRefreshSession(payload.tokenId);
                if (!sessionValidation.isValid) {
                    // Even if session is invalid, logout is considered successful
                    return {
                        status: httpStatus_1.HttpStatus.NoContent,
                        data: null,
                        extensions: [],
                    };
                }
                // 3. Revoke session
                const revoked = yield this.invalidateRefreshSession(payload.tokenId);
                if (!revoked) {
                    console.log('Failed to revoke session:', payload.tokenId);
                }
                return {
                    status: httpStatus_1.HttpStatus.NoContent,
                    data: null,
                    extensions: [],
                };
            }
            catch (error) {
                console.log('Logout failed:', error);
                return {
                    status: httpStatus_1.HttpStatus.InternalServerError,
                    errorMessage: 'Logout failed',
                    extensions: [],
                    data: null,
                };
            }
        });
    }
    createRefreshSession(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenId = (0, uuid_1.v4)();
            const session = {
                userId,
                tokenId,
                deviceId,
                isRevoked: false,
                createdAt: new Date(),
                expiresAt: (0, date_fns_1.add)(new Date(), { seconds: settings_1.SETTINGS.REFRESH_TIME })
            };
            yield this.refreshTokenSessionsRepository.createSession(session);
            return tokenId;
        });
    }
    validateRefreshSession(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.refreshTokenSessionsRepository.findSessionByTokenId(tokenId);
            if (!session) {
                return { isValid: false, error: 'NOT_FOUND' };
            }
            if (session.isRevoked) {
                return { isValid: false, error: 'REVOKED' };
            }
            if (session.expiresAt < new Date()) {
                return { isValid: false, error: 'EXPIRED' };
            }
            return { isValid: true };
        });
    }
    invalidateRefreshSession(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.refreshTokenSessionsRepository.invalidateSession(tokenId);
        });
    }
    extractDeviceIdFromToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield this.jwtService.verifyRefreshToken(refreshToken);
                return (payload === null || payload === void 0 ? void 0 : payload.deviceId) || null;
            }
            catch (error) {
                return null;
            }
        });
    }
    isEmailAlreadyConfirmed(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield this.usersRepository.findByLoginOrEmail(email);
                return ((_a = user === null || user === void 0 ? void 0 : user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed) || false;
            }
            catch (error) {
                return false;
            }
        });
    }
    sendPasswordRecoveryEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findByLoginOrEmail(email);
            if (!user) {
                return {
                    status: httpStatus_1.HttpStatus.NoContent,
                    data: null,
                    errorMessage: '',
                    extensions: [],
                };
            }
            const newConfirmationCode = (0, uuid_1.v4)();
            yield this.usersRepository.updateConfirmationCode(user.id, newConfirmationCode);
            try {
                const updatedUser = Object.assign(Object.assign({}, user), { emailConfirmation: Object.assign(Object.assign({}, user.emailConfirmation), { confirmationCode: newConfirmationCode }) });
                yield email_manager_1.emailManager.sendPasswordRecoveryEmail(updatedUser);
            }
            catch (error) {
                console.log('Email sending failed, but code update continues:', error);
            }
            return {
                status: httpStatus_1.HttpStatus.NoContent,
                data: null,
                errorMessage: '',
                extensions: [],
            };
        });
    }
    confirmPasswordRecovery(code, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersRepository.findByConfirmationCode(code);
                if (!user) {
                    return {
                        status: httpStatus_1.HttpStatus.BadRequest,
                        errorMessage: 'Invalid recovery code',
                        extensions: [{
                                message: 'Invalid recovery code',
                                field: 'recoveryCode'
                            }],
                        data: null,
                    };
                }
                const newPasswordHash = yield this.bcryptService.generateHash(password);
                yield this.usersRepository.updatePassword(user.id, newPasswordHash);
                yield this.usersRepository.clearRecoveryCode(user.id);
                if (!user) {
                    return {
                        status: httpStatus_1.HttpStatus.InternalServerError,
                        errorMessage: 'Failed to update password',
                        extensions: [],
                        data: null,
                    };
                }
                return {
                    status: httpStatus_1.HttpStatus.NoContent,
                    extensions: [],
                    data: null
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    __param(0, (0, inversify_1.inject)(jwt_adapter_1.JwtService)),
    __param(1, (0, inversify_1.inject)(refresh_token_sessions_repository_1.RefreshTokenSessionsRepository)),
    __param(2, (0, inversify_1.inject)(bcrypt_adapter_1.BcryptService)),
    __param(3, (0, inversify_1.inject)(security_devices_service_1.SecurityDevicesService)),
    __param(4, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __metadata("design:paramtypes", [jwt_adapter_1.JwtService,
        refresh_token_sessions_repository_1.RefreshTokenSessionsRepository,
        bcrypt_adapter_1.BcryptService,
        security_devices_service_1.SecurityDevicesService,
        usersRepository_1.UsersRepository])
], AuthService);
;
