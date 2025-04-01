"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostListHandler = getPostListHandler;
const postsRepository_1 = require("../../repositories/postsRepository");
function getPostListHandler(req, res) {
    const drivers = postsRepository_1.postsRepository.findAll();
    res.send(drivers);
}
