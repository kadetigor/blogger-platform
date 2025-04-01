"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlogExistsMiddleware = validateBlogExistsMiddleware;
const blogsRepository_1 = require("../../blogs/repositories/blogsRepository");
function validateBlogExistsMiddleware(req, res, next) {
    try {
        // Attempt to get the blog name. This will throw if the blog isn't found.
        const blogName = blogsRepository_1.blogsRepository.getBlogName(req.body.blogId);
        // Attach the blogName to the request body for later use
        req.body.blogName = blogName;
        next();
    }
    catch (error) {
        res.status(404).send({ error: error.message });
    }
}
