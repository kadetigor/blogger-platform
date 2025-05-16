"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = errorsHandler;
const repositoryNotFoundError_1 = require("./repositoryNotFoundError");
const httpStatus_1 = require("../types/httpStatus");
const input_validtion_result_middleware_1 = require("../middlewares/validation/input-validtion-result.middleware");
const domainError_1 = require("./domainError");
function errorsHandler(error, res) {
    if (error instanceof repositoryNotFoundError_1.repositoryNotFoundError) {
        const httpStatus = httpStatus_1.HttpStatus.NotFound;
        res.status(httpStatus).send((0, input_validtion_result_middleware_1.createErrorMessages)([
            {
                message: 'Repository not found',
                field: 'id',
            },
        ]));
        return;
    }
    if (error instanceof domainError_1.domainError) {
        const httpStatus = httpStatus_1.HttpStatus.UnprocessableEntity;
        res.status(httpStatus).send((0, input_validtion_result_middleware_1.createErrorMessages)([
            {
                message: 'Wrong domain',
                field: 'id',
            },
        ]));
        return;
    }
    res.status(httpStatus_1.HttpStatus.InternalServerError);
    return;
}
