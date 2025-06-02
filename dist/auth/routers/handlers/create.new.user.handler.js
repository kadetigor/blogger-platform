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
exports.createNewUserHandler = createNewUserHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const usersService_1 = require("../../../users/application/usersService");
const usersRepository_1 = require("../../../users/repositories/usersRepository");
const mapToUserOutput_1 = require("../../../users/routers/mappers/mapToUserOutput");
function createNewUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createUserId = yield usersService_1.usersService.create(req.body);
            const createUser = yield usersRepository_1.usersRepository.findByIdOrFail(createUserId);
            const userOutput = (0, mapToUserOutput_1.mapToUserOutput)(createUser);
            res.status(httpStatus_1.HttpStatus.NoContent).send(userOutput);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
