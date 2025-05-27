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
exports.validateBlogExistsMiddleware = validateBlogExistsMiddleware;
const blogsRepository_1 = require("../../blogs/repositories/blogsRepository");
const httpStatus_1 = require("../../core/types/httpStatus");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
function validateBlogExistsMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogId = req.params.id || req.body.blogId;
            if (!blogId) {
                res.status(httpStatus_1.HttpStatus.BadRequest).json((0, input_validtion_result_middleware_1.createErrorMessages)([
                    {
                        message: 'blogId is required',
                        field: 'blogId',
                    },
                ]));
                return;
            }
            // Check if blog exists
            const blog = yield blogsRepository_1.blogsRepository.findByIdOrFail(blogId);
            // If blogId came from URL params, add it to the body for the service
            if (req.params.id && !req.body.blogId) {
                req.body.blogId = req.params.id;
            }
            // Attach the blogName to the request body for later use
            req.body.blogName = blog.name;
            next();
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.BadRequest).json((0, input_validtion_result_middleware_1.createErrorMessages)([
                {
                    message: 'Blog with provided blogId does not exist',
                    field: 'blogId',
                },
            ]));
        }
    });
}
