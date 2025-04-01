"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogHandler = deleteBlogHandler;
const httpStatus_1 = require("../../../core/types/httpStatus");
const errorUtils_1 = require("../../../core/utils/errorUtils");
const blogsRepository_1 = require("../../repositories/blogsRepository");
function deleteBlogHandler(req, res) {
    const id = parseInt(req.params.id);
    const blog = blogsRepository_1.blogsRepository.findById(id.toString());
    if (!blog) {
        res
            .status(httpStatus_1.HttpStatus.NotFound)
            .send((0, errorUtils_1.createErrorMessages)([{ message: 'Blog not found', field: 'id' }]));
        return;
    }
    blogsRepository_1.blogsRepository.delete(id.toString());
    res.sendStatus(httpStatus_1.HttpStatus.NoContent);
}
