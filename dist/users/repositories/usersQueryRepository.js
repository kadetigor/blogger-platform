"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersQueryRepository = void 0;
require("reflect-metadata");
const user_schema_1 = require("../domain/user.schema");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const inversify_1 = require("inversify");
let UsersQueryRepository = class UsersQueryRepository {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            const orConditions = [];
            // Build search conditions
            if (searchLoginTerm && searchLoginTerm.trim() !== "") {
                orConditions.push({
                    login: {
                        $regex: searchLoginTerm,
                        $options: "i",
                    },
                });
            }
            if (searchEmailTerm && searchEmailTerm.trim() !== "") {
                orConditions.push({
                    email: {
                        $regex: searchEmailTerm,
                        $options: "i",
                    },
                });
            }
            // Apply OR conditions if any exist
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }
            // Execute both queries in parallel for better performance
            const [items, totalCount] = yield Promise.all([
                user_schema_1.UserModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .select('-passwordHash') // Exclude password hash from results
                    .lean() // Return plain objects for better performance
                    .exec(),
                user_schema_1.UserModel.countDocuments(filter).exec()
            ]);
            return { items, totalCount };
        });
    }
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.UserModel
                .findById(id)
                .select('-passwordHash') // Don't return password hash
                .exec();
            if (!user) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
            return user;
        });
    }
    // Additional useful query methods you might want:
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_schema_1.UserModel
                .findOne({ email: email.toLowerCase() })
                .select('-passwordHash')
                .exec();
        });
    }
    findByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_schema_1.UserModel
                .findOne({ login })
                .select('-passwordHash')
                .exec();
        });
    }
    existsByLoginOrEmail(login, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield user_schema_1.UserModel.countDocuments({
                $or: [
                    { login },
                    { email: email.toLowerCase() }
                ]
            }).exec();
            return count > 0;
        });
    }
    findUnconfirmedUsers(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {
                'emailConfirmation.isConfirmed': false
            };
            const [items, totalCount] = yield Promise.all([
                user_schema_1.UserModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .select('-passwordHash')
                    .lean()
                    .exec(),
                user_schema_1.UserModel.countDocuments(filter).exec()
            ]);
            return { items, totalCount };
        });
    }
    getUserStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, confirmed] = yield Promise.all([
                user_schema_1.UserModel.countDocuments().exec(),
                user_schema_1.UserModel.countDocuments({ 'emailConfirmation.isConfirmed': true }).exec()
            ]);
            return {
                total,
                confirmed,
                unconfirmed: total - confirmed
            };
        });
    }
};
exports.UsersQueryRepository = UsersQueryRepository;
exports.UsersQueryRepository = UsersQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersQueryRepository);
