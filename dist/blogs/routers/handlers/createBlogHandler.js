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
exports.createBlogHandler = createBlogHandler;
const blogsService_1 = require("../../application/blogsService");
const httpStatus_1 = require("../../../core/types/httpStatus");
const mapToBlogOutput_1 = require("../mappers/mapToBlogOutput");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
function createBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createdBlogId = yield blogsService_1.blogsService.create(req.body);
            const createdBlog = yield blogsService_1.blogsService.findByIdOrFail(createdBlogId);
            const blogOutput = (0, mapToBlogOutput_1.mapToBlogOutput)(createdBlog);
            res.status(httpStatus_1.HttpStatus.Created).send(blogOutput);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
