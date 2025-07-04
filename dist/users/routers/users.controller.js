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
exports.UsersController = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const usersService_1 = require("../application/usersService");
const usersRepository_1 = require("../repositories/usersRepository");
const mapToUserOutput_1 = require("./mappers/mapToUserOutput");
const httpStatus_1 = require("../../core/types/httpStatus");
const errorsHandler_1 = require("../../core/errors/errorsHandler");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const usersQueryRepository_1 = require("../repositories/usersQueryRepository");
const mapToUserListPaginatedOutput_1 = require("./mappers/mapToUserListPaginatedOutput");
let UsersController = class UsersController {
    constructor(usersService, usersRepository, usersQueryRepository) {
        this.usersService = usersService;
        this.usersRepository = usersRepository;
        this.usersQueryRepository = usersQueryRepository;
    }
    createUserHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createUserId = yield this.usersService.create(req.body);
                const createUser = yield this.usersRepository.findByIdOrFail(createUserId);
                const userOutput = (0, mapToUserOutput_1.mapToUserOutput)(createUser);
                res.status(httpStatus_1.HttpStatus.Created).send(userOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    deleteUserHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.usersService.delete(id);
                res.sendStatus(httpStatus_1.HttpStatus.NoContent);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
    getUserListHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryInput = {
                    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageNumber,
                    pageSize: req.query.pageSize ? Number(req.query.pageSize) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageSize,
                    sortBy: req.query.sortBy || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortBy,
                    sortDirection: req.query.sortDirection || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortDirection,
                    searchLoginTerm: typeof req.query.searchLoginTerm === "string" ? req.query.searchLoginTerm.trim() : "",
                    searchEmailTerm: typeof req.query.searchEmailTerm === "string" ? req.query.searchEmailTerm.trim() : "",
                };
                const { items, totalCount } = yield this.usersQueryRepository.findMany(queryInput);
                const usersListOutput = (0, mapToUserListPaginatedOutput_1.mapToUsersListPaginatedOutput)(items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                });
                res.send(usersListOutput);
            }
            catch (e) {
                (0, errorsHandler_1.errorsHandler)(e, res);
            }
        });
    }
};
exports.UsersController = UsersController;
exports.UsersController = UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(usersService_1.UsersService)),
    __param(1, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(2, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [usersService_1.UsersService,
        usersRepository_1.UsersRepository,
        usersQueryRepository_1.UsersQueryRepository])
], UsersController);
