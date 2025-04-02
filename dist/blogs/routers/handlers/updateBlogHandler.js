"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogHandler = updateBlogHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorUtils_1 = require("../../../core/utils/errorUtils");
const blogsRepository_1 = require("../../repositories/blogsRepository");
function updateBlogHandler(req, res) {
    const id = req.params.id;
    const blog = blogsRepository_1.blogsRepository.findById(id);
    if (!blog) {
        res
            .status(httpStatus_1.HttpStatus.NotFound)
            .send((0, errorUtils_1.createErrorMessages)([{ field: 'id', message: 'Vehicle not found' }]));
        return;
    }
    blogsRepository_1.blogsRepository.update(id, req.body);
    res.sendStatus(httpStatus_1.HttpStatus.NoContent);
}
