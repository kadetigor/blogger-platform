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
exports.authService = void 0;
const jwt_service_1 = require("../adapters/jwt.service");
const bcrypt_service_1 = require("../adapters/bcrypt.service");
const httpStatus_1 = require("../../core/types/httpStatus");
const usersRepository_1 = require("../../users/repositories/usersRepository");
const email_manager_1 = require("../../email/managers/email.manager");
const uuid_1 = require("uuid");
exports.authService = {
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
            const accessToken = yield jwt_service_1.jwtService.createToken(result.data._id.toString(), result.data.login);
            return {
                status: httpStatus_1.HttpStatus.Ok,
                data: { accessToken },
                extensions: [],
            };
        });
    },
    checkUserCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield usersRepository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user)
                return {
                    status: httpStatus_1.HttpStatus.NotFound,
                    data: null,
                    errorMessage: 'Not Found',
                    extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
                };
            const isPassCorrect = yield bcrypt_service_1.bcryptService.checkPassword(password, user.passwordHash);
            if (!isPassCorrect)
                return {
                    status: httpStatus_1.HttpStatus.BadRequest,
                    data: null,
                    errorMessage: 'Bad Request',
                    extensions: [{ field: 'password', message: 'Wrong password' }],
                };
            // Check if user is confirmed before allowing login
            if (!((_a = user.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed)) {
                return {
                    status: httpStatus_1.HttpStatus.Unauthorized,
                    data: null,
                    errorMessage: 'Email not confirmed',
                    extensions: [{ field: 'loginOrEmail', message: 'Please confirm your email before logging in' }],
                };
            }
            return {
                status: httpStatus_1.HttpStatus.Ok,
                data: user,
                extensions: [],
            };
        });
    },
    registerUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user with this login or email already exists
            const existingUser = yield usersRepository_1.usersRepository.findByLoginOrEmail(login);
            if (existingUser) {
                return {
                    status: httpStatus_1.HttpStatus.BadRequest,
                    data: null,
                    errorMessage: 'User already exists',
                    extensions: [{ field: 'login', message: 'User with this login already exists' }],
                };
            }
            const existingEmailUser = yield usersRepository_1.usersRepository.findByLoginOrEmail(email);
            if (existingEmailUser) {
                return {
                    status: httpStatus_1.HttpStatus.BadRequest,
                    data: null,
                    errorMessage: 'User already exists',
                    extensions: [{ field: 'email', message: 'User with this email already exists' }],
                };
            }
            const passwordHash = yield bcrypt_service_1.bcryptService.generateHash(password);
            const confirmationCode = (0, uuid_1.v4)();
            const user = {
                login,
                email,
                passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: confirmationCode,
                    isConfirmed: false
                }
            };
            yield usersRepository_1.usersRepository.create(user);
            yield email_manager_1.emailManager.sendEmailConfimationMessage(user);
            return {
                status: httpStatus_1.HttpStatus.NoContent,
                data: { confirmationCode },
                errorMessage: '',
                extensions: [],
            };
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield usersRepository_1.usersRepository.findByConfirmationCode(code);
                if (user.emailConfirmation.isConfirmed) {
                    return false; // Already confirmed
                }
                const result = yield usersRepository_1.usersRepository.updateConfirmation(user._id);
                return result;
            }
            catch (error) {
                return false; // User not found or other error
            }
        });
    },
    resendConfirmationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield usersRepository_1.usersRepository.findByLoginOrEmail(email);
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
            yield usersRepository_1.usersRepository.updateConfirmationCode(user._id, newConfirmationCode);
            // Send email with new code
            const updatedUser = Object.assign(Object.assign({}, user), { emailConfirmation: Object.assign(Object.assign({}, user.emailConfirmation), { confirmationCode: newConfirmationCode }) });
            yield email_manager_1.emailManager.sendEmailConfimationMessage(updatedUser);
            return {
                status: httpStatus_1.HttpStatus.NoContent,
                data: null,
                errorMessage: '',
                extensions: [],
            };
        });
    },
};
