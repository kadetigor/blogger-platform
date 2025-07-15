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
exports.validatePostExistsMiddleware = validatePostExistsMiddleware;
const httpStatus_1 = require("../../../core/types/httpStatus");
const input_validtion_result_middleware_1 = require("../../../core/middlewares/validation/input-validtion-result.middleware");
const posts_query_repository_1 = require("../../repositories/posts.query-repository");
function validatePostExistsMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postId = req.params.id;
            if (!postId) {
                res.status(httpStatus_1.HttpStatus.BadRequest).json((0, input_validtion_result_middleware_1.createErrorMessages)([
                    {
                        message: 'postId is required',
                        field: 'postId',
                    },
                ]));
                return;
            }
            // Check if post exists
            yield posts_query_repository_1.postsQueryRepository.findByIdOrFail(postId);
            next();
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.NotFound).json((0, input_validtion_result_middleware_1.createErrorMessages)([
                {
                    message: 'Post with provided postId does not exist',
                    field: 'postId',
                },
            ]));
        }
    });
}
