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
exports.getBlogHandler = getBlogHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const input_validtion_result_middleware_1 = require("../../../core/middlewares/validation/input-validtion-result.middleware");
const blogsRepository_1 = require("../../repositories/blogsRepository");
const mapToBlogViewModel_1 = require("../mappers/mapToBlogViewModel");
function getBlogHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const blog = yield blogsRepository_1.blogsRepository.findById(id);
            if (!blog) {
                res
                    .status(httpStatus_1.HttpStatus.NotFound)
                    .send((0, input_validtion_result_middleware_1.createErrorMessages)([{ field: 'id', message: 'Blog not found' }]));
                return;
            }
            const blogViewModel = (0, mapToBlogViewModel_1.mapToBlogViewModel)(blog);
            res.status(httpStatus_1.HttpStatus.Ok).send(blogViewModel);
        }
        catch (e) {
            res.sendStatus(httpStatus_1.HttpStatus.InternalServerError);
        }
    });
}
