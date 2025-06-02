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
exports.usersQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const mongoDb_1 = require("../../db/mongoDb");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
exports.usersQueryRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm, } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchLoginTerm && searchLoginTerm.trim() !== "") {
                filter.login = {
                    $regex: searchLoginTerm,
                    $options: "i",
                };
            }
            if (searchEmailTerm && searchEmailTerm.trim() !== "") {
                filter.email = {
                    $regex: searchEmailTerm,
                    $options: "i",
                };
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
    },
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
