"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = errorsHandler;
const repositoryNotFoundError_1 = require("./repositoryNotFoundError");
const httpStatus_1 = require("../types/httpStatus");
const domainError_1 = require("./domainError");
function errorsHandler(error, res) {
    if (error instanceof repositoryNotFoundError_1.repositoryNotFoundError) {
        const httpStatus = httpStatus_1.HttpStatus.NotFound; // Changed from BadRequest to NotFound for repository errors
        res.status(httpStatus).json({
            errorsMessages: [{
                    message: error.message || 'Resource not found',
                    field: 'id',
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
