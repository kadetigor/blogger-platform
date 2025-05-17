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
exports.createPostHandler = createPostHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const mapToPostViewModel_1 = require("../mappers/mapToPostViewModel");
const postsService_1 = require("../../application/postsService");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const blogId = req.params.id;
        try {
            const createdPostId = yield postsService_1.postsService.create(Object.assign(Object.assign({}, req.body), { blogId }));
            const createdPost = yield postsService_1.postsService.findByIdOrFail(createdPostId);
            const postViewModel = (0, mapToPostViewModel_1.mapToPostViewModel)(createdPost);
            res.status(httpStatus_1.HttpStatus.Created).send(postViewModel);
        }
        catch (e) {
            return (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
