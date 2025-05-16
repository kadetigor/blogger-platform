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
exports.getPostHandler = getPostHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const postsRepository_1 = require("../../repositories/postsRepository");
const mapToPostViewModel_1 = require("../mappers/mapToPostViewModel");
const errorsHandler_1 = require("../../../core/errors/errorsHandler");
function getPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const post = yield postsRepository_1.postsRepository.findByIdOrFail(id);
            const postViewModel = (0, mapToPostViewModel_1.mapToPostViewModel)(post);
            res.status(httpStatus_1.HttpStatus.Ok).send(postViewModel);
        }
        catch (e) {
            (0, errorsHandler_1.errorsHandler)(e, res);
        }
    });
}
