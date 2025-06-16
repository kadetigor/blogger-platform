"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = errorsHandler;
const repositoryNotFoundError_1 = require("./repositoryNotFoundError");
const httpStatus_1 = require("../types/httpStatus");
const domainError_1 = require("./domainError");
function errorsHandler(error, res) {
    if (error instanceof repositoryNotFoundError_1.repositoryNotFoundError) {
        const httpStatus = httpStatus_1.HttpStatus.BadRequest; // Change from NotFound to BadRequest for validation
        res.status(httpStatus).json({
            errorsMessages: [{
                    message: 'Invalid confirmation code',
                    field: 'code',
                }]
        });
        return;
    }
    if (error instanceof domainError_1.domainError) {
        const httpStatus = httpStatus_1.HttpStatus.BadRequest;
        res.status(httpStatus).json({
            errorsMessages: [{
                    message: error.message,
                    field: error.source || 'unknown',
                }]
        });
        return;
    }
    res.status(httpStatus_1.HttpStatus.InternalServerError).json({
        errorsMessages: [{
                message: 'Internal server error',
                field: 'server',
            }]
    });
}
