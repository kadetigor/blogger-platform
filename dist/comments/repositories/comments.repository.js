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
exports.commentsRepository = void 0;
const mongodb_1 = require("mongodb");
const repositoryNotFoundError_1 = require("../../core/errors/repositoryNotFoundError");
const mongoDb_1 = require("../../db/mongoDb");
exports.commentsRepository = {
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield mongoDb_1.commentCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!res) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Comment does not exist');
            }
            return res;
        });
    },
    create(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongoDb_1.commentCollection.insertOne(newComment);
            return insertResult.insertedId.toString();
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongoDb_1.commentCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    content: dto.content,
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Comment does not exist');
            }
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield mongoDb_1.commentCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new repositoryNotFoundError_1.repositoryNotFoundError('Comment does not exist');
            }
            return;
        });
    }
};
