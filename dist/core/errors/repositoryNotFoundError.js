"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.repositoryNotFoundError = void 0;
class repositoryNotFoundError extends Error {
}
exports.repositoryNotFoundError = repositoryNotFoundError;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
