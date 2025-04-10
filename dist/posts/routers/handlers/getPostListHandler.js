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
const postsRepository_1 = require("../../repositories/postsRepository");
const httpStatus_1 = require("../../../core/types/httpStatus");
const mapToPostViewModel_1 = require("../mappers/mapToPostViewModel");
function getPostListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield postsRepository_1.postsRepository.findAll();
            const postViewModel = posts.map(mapToPostViewModel_1.mapToPostViewModel);
            res.send(postViewModel);
        }
        catch (e) {
            res.sendStatus(httpStatus_1.HttpStatus.InternalServerError);
        }
    });
}
