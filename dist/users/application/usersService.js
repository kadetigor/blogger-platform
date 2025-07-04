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
exports.UsersService = void 0;
const bcrypt_adapter_1 = require("../../auth/adapters/bcrypt.adapter");
require("reflect-metadata");
const usersRepository_1 = require("../repositories/usersRepository");
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
let UsersService = class UsersService {
    constructor(usersRepository, bcryptService) {
        this.usersRepository = usersRepository;
        this.bcryptService = bcryptService;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = dto;
            const passwordHash = yield this.bcryptService.generateHash(password);
            // Create user with already confirmed email when created through admin endpoint
            const newUser = {
                login,
                email,
                passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    isConfirmed: true // Already confirmed for admin-created users
                }
            };
            return this.usersRepository.create(newUser);
        });
    }
    udate(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usersRepository.update(id, dto);
            return;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usersRepository.delete(id);
            return;
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(bcrypt_adapter_1.BcryptService)),
    __metadata("design:paramtypes", [usersRepository_1.UsersRepository,
        bcrypt_adapter_1.BcryptService])
], UsersService);
/* export const usersService = {
    async create(dto: userAttributes): Promise<string> {

        const { login, password, email } = dto;

        const passwordHash = await bcryptService.generateHash(password);

        // Create user with already confirmed email when created through admin endpoint
        const newUser: UserWithConfirmation = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: uuid(),
                isConfirmed: true // Already confirmed for admin-created users
            }
        };
        
        return usersRepository.create(newUser);
    },

    async udate(id: string, dto: userAttributes): Promise<void> {
        await usersRepository.update(id, dto)
        return;
    },

    async delete(id: string): Promise<void> {
        await usersRepository.delete(id);
        return;
    },
} */ 
