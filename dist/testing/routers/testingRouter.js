"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../db/db");
const httpStatus_1 = require("../../core/types/httpStatus");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter
    .delete('/all-data', (req, res) => {
    db_1.db.posts = [];
    db_1.db.blogs = [];
    res.sendStatus(httpStatus_1.HttpStatus.NoContent);
});
