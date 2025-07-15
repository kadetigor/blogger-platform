"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const blog_input_dto_validation_middleware_1 = require("./blog.input-dto-validation.middleware");
const basic_guard_middleware_1 = require("../../auth/routers/guards/basic.guard.middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const postSortField_1 = require("../../posts/routers/input/postSortField");
const blog_sort_field_1 = require("./input/blog.sort-field");
const validateBlogExistsMiddleware_1 = require("../../posts/routers/validation/validateBlogExistsMiddleware");
const blogPostInputDtoValidation_1 = require("../../posts/routers/validation/blogPostInputDtoValidation");
const blogs_controller_1 = require("./blogs.controller");
const composition_root_1 = require("../../composition-root");
const posts_controller_1 = require("../../posts/routers/posts.controller");
const blogsController = composition_root_1.container.get(blogs_controller_1.BlogsController);
const postsController = composition_root_1.container.get(posts_controller_1.PostsController);
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter
    .get('/', (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(blog_sort_field_1.blogSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, blogsController.getBlogListHandler.bind(blogsController) //getBlogListHandler
) // blogsController.getBlogs
    .get('/:id', params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, blogsController.getBlogHandler.bind(blogsController) //getBlogHandler
)
    .post('/', basic_guard_middleware_1.superAdminGuardMiddleware, blog_input_dto_validation_middleware_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, blogsController.createBlogHandler.bind(blogsController) //createBlogHandler
)
    .put('/:id', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, blog_input_dto_validation_middleware_1.blogInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, blogsController.updateBlogHandler.bind(blogsController) //updateBlogHandler
)
    .delete('/:id', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, blogsController.deleteBlogHandler.bind(blogsController) //deleteBlogHandler
)
    .get('/:id/posts', params_id_validation_middleware_1.idValidationMiddleware, (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(postSortField_1.postSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, blogsController.getBlogPostsListHandler.bind(blogsController) //getBlogPostsListHandler
)
    .post('/:id/posts', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, blogPostInputDtoValidation_1.blogPostInputDtoValidation, validateBlogExistsMiddleware_1.validateBlogExistsMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, postsController.createPostHandler.bind(postsController) //createPostHandler
);
