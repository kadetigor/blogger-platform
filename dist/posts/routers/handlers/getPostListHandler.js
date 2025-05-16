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
exports.getPostListHandler = getPostListHandler;
const setDefaultSortAndPagination_1 = require("../../../core/helpers/setDefaultSortAndPagination");
const postsService_1 = require("../../application/postsService");
const mapToPostListPaginatedOutput_1 = require("../mappers/mapToPostListPaginatedOutput");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
function getPostListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryInput = (0, setDefaultSortAndPagination_1.setDefaultSortAndPaginationIfNotExist)(req.query);
            const { items, totalCount } = yield postsService_1.postsService.findMany(queryInput);
            const postsListOutput = (0, mapToPostListPaginatedOutput_1.mapToPostListPaginatedOutput)(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });
            res.send(postsListOutput);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
