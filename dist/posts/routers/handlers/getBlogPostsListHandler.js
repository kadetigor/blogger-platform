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
exports.getBlogPostsListHandler = getBlogPostsListHandler;
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
const postsService_1 = require("../../application/postsService");
const mapToPostListPaginatedOutput_1 = require("../mappers/mapToPostListPaginatedOutput");
function getBlogPostsListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Debug
        console.log('got to getBlogPostsListHandler');
        try {
            const blogId = req.params.id;
            const queryInput = req.query;
            const { items, totalCount } = yield postsService_1.postsService.findPostsbyBlog(queryInput, blogId);
            // Debug
            console.log({ items, totalCount });
            const postListOutput = (0, mapToPostListPaginatedOutput_1.mapToPostListPaginatedOutput)(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });
            res.send(postListOutput);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
