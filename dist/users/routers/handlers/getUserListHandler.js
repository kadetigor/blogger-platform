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
exports.getUserListHandler = getUserListHandler;
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const usersQueryRepository_1 = require("../../repositories/usersQueryRepository");
const mapToUserListPaginatedOutput_1 = require("../mappers/mapToUserListPaginatedOutput");
const queryPaginationSortingValidationMiddleware_1 = require("../../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
function getUserListHandler(req, res) {
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
            const { items, totalCount } = yield usersQueryRepository_1.usersQueryRepository.findMany(queryInput);
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
