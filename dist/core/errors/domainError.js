"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainError = void 0;
class domainError extends Error {
    constructor(detail, code, source) {
        super(detail);
        this.code = code;
        this.source = source;
    }
}
exports.domainError = domainError;
