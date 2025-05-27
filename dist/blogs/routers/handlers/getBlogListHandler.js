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
exports.getBlogListHandler = getBlogListHandler;
const mapToBlogListPaginatedOutput_1 = require("../mappers/mapToBlogListPaginatedOutput");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const queryPaginationSortingValidationMiddleware_1 = require("../../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const blogsQueryRepository_1 = require("../../repositories/blogsQueryRepository");
function getBlogListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryInput = {
                pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageNumber,
                pageSize: req.query.pageSize ? Number(req.query.pageSize) : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.pageSize,
                sortBy: req.query.sortBy || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortBy,
                sortDirection: req.query.sortDirection || queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortDirection,
                searchNameTerm: typeof req.query.searchNameTerm === "string" ? req.query.searchNameTerm.trim() : ""
            };
            const { items, totalCount } = yield blogsQueryRepository_1.blogsQueryRepository.findMany(queryInput);
            const blogsListOutput = (0, mapToBlogListPaginatedOutput_1.mapToBlogListPaginatedOutput)(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });
            res.send(blogsListOutput);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
