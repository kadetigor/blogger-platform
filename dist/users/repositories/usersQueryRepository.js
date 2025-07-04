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
const mongodb_1 = require("mongodb");
require("reflect-metadata");
const mongoDb_1 = require("../../db/mongoDb");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const inversify_1 = require("inversify");
let UsersQueryRepository = class UsersQueryRepository {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            const orConditions = [];
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
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }
            const items = yield mongoDb_1.userCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield mongoDb_1.userCollection.countDocuments(filter);
            return { items, totalCount };
        });
    }
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield mongoDb_1.userCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!res) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('User does not exist');
            }
            return res;
        });
    }
};
exports.UsersQueryRepository = UsersQueryRepository;
exports.UsersQueryRepository = UsersQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersQueryRepository);
/* export const usersQueryRepository = {
    async findMany(
        queryDto: userQueryInput,
    ): Promise<{ items: WithId<User>[]; totalCount: number }> {
        const {
              pageNumber,
              pageSize,
              sortBy,
              sortDirection,
              searchLoginTerm,
              searchEmailTerm,
            } = queryDto

            const skip = (pageNumber - 1) * pageSize;
            const filter: Filter<User> = {};

            const orConditions: Filter<User>[] = [];

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

            if (orConditions.length > 0) {
            filter.$or = orConditions;
            }
        
            const items = await userCollection
              .find(filter)
              .sort({ [sortBy]: sortDirection })
              .skip(skip)
              .limit(pageSize)
              .toArray();
        
            const totalCount = await userCollection.countDocuments(filter);
        
            return { items, totalCount };
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        const res = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new repositoryNotFoundError('User does not exist')
        }
        return res;
    }
} */ 
