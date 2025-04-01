"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostHandler = getPostHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorUtils_1 = require("../../../core/utils/errorUtils");
const postsRepository_1 = require("../../repositories/postsRepository");
function getPostHandler(req, res) {
    const id = parseInt(req.params.id);
    const post = postsRepository_1.postsRepository.findById(id.toString());
    if (!post) {
        res
            .status(httpStatus_1.HttpStatus.NotFound)
            .send((0, errorUtils_1.createErrorMessages)([{ field: 'id', message: 'Post not found' }]));
        return;
    }
    res.send(post);
}
