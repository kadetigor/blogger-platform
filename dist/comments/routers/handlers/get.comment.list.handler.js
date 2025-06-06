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
exports.getCommentListHandler = getCommentListHandler;
const setDefaultSortAndPagination_1 = require("../../../core/helpers/setDefaultSortAndPagination");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const comments_query_repository_1 = require("../../repositories/comments.query.repository");
const map_to_comment_list_paginated_output_1 = require("../mappers/map.to.comment.list.paginated.output");
function getCommentListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const baseQueryInput = (0, setDefaultSortAndPagination_1.setDefaultSortAndPaginationIfNotExist)(req.query);
            const queryInput = {
                pageNumber: baseQueryInput.pageNumber,
                pageSize: baseQueryInput.pageSize,
                sortBy: baseQueryInput.sortBy,
                sortDirection: baseQueryInput.sortDirection
            };
            const { items, totalCount } = yield comments_query_repository_1.commentsQueryRepository.findMany(queryInput);
            const postsListOutput = (0, map_to_comment_list_paginated_output_1.mapToCommentListPaginatedOutput)(items, {
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
