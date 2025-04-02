"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostHandler = deletePostHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorUtils_1 = require("../../../core/utils/errorUtils");
const postsRepository_1 = require("../../repositories/postsRepository");
function deletePostHandler(req, res) {
    const id = req.params.id;
    const post = postsRepository_1.postsRepository.findById(id);
    if (!post) {
        res
            .status(httpStatus_1.HttpStatus.NotFound)
            .send((0, errorUtils_1.createErrorMessages)([{ message: 'Post not found', field: 'id' }]));
        return;
    }
    postsRepository_1.postsRepository.delete(id);
    res.sendStatus(httpStatus_1.HttpStatus.NoContent);
}
