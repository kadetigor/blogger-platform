"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const postInputDtoValidationMiddleware_1 = require("./validation/postInputDtoValidationMiddleware");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const post_id_validation_middleware_1 = require("./validation/post.id.validation-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const basic_guard_middleware_1 = require("../../auth/routers/guards/basic.guard.middleware");
const postSortField_1 = require("./input/postSortField");
const queryPaginationSortingValidationMiddleware_1 = require("../../core/middlewares/validation/queryPaginationSortingValidationMiddleware");
const access_token_guard_1 = require("../../auth/routers/guards/access.token.guard");
const optional_access_token_guard_1 = require("../../auth/routers/guards/optional.access.token.guard");
const comment_input_dto_validation_1 = require("../../comments/routers/validation/comment.input.dto.validation");
const post_exists_validation_1 = require("./validation/post.exists.validation");
const comment_sort_field_1 = require("../../comments/routers/input/comment.sort.field");
const composition_root_1 = require("../../composition-root");
const comments_controller_1 = require("../../comments/routers/comments.controller");
const posts_controller_1 = require("./posts.controller");
const like_query_validation_middleware_1 = require("../../core/middlewares/validation/like.query-validation.middleware");
const postsController = composition_root_1.container.get(posts_controller_1.PostsController);
const commentsController = composition_root_1.container.get(comments_controller_1.CommentsController);
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('/', optional_access_token_guard_1.optionalAccessTokenGuard, (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(postSortField_1.postSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, postsController.getPostListHandler.bind(postsController) //getPostListHandler
)
    .get('/:id', optional_access_token_guard_1.optionalAccessTokenGuard, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, postsController.getPostHandler.bind(postsController) //getPostHandler
)
    .post('/', basic_guard_middleware_1.superAdminGuardMiddleware, postInputDtoValidationMiddleware_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, postsController.createPostHandler.bind(postsController) //createPostHandler
)
    .put('/:id', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, postInputDtoValidationMiddleware_1.postInputDtoValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, postsController.updatePostHandler.bind(postsController) //updatePostHandler
)
    .delete('/:id', basic_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, postsController.deletePostHandler.bind(postsController) //deletePostHandler
)
    .post('/:id/comments', access_token_guard_1.accessTokenGuard, params_id_validation_middleware_1.idValidationMiddleware, post_exists_validation_1.validatePostExistsMiddleware, comment_input_dto_validation_1.contentValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, commentsController.createCommentHandler.bind(commentsController) //createCommentHandler
)
    .get('/:id/comments', optional_access_token_guard_1.optionalAccessTokenGuard, params_id_validation_middleware_1.idValidationMiddleware, post_exists_validation_1.validatePostExistsMiddleware, (0, queryPaginationSortingValidationMiddleware_1.paginationAndSortingValidation)(comment_sort_field_1.commentSortField), input_validtion_result_middleware_1.inputValidationResultMiddleware, commentsController.getCommentListHandler.bind(commentsController) //getCommentListHandler
)
    .put('/:postId/like-status', access_token_guard_1.accessTokenGuard, post_id_validation_middleware_1.postIdValidationMiddleware, post_exists_validation_1.validatePostExistsMiddleware, like_query_validation_middleware_1.likeQueryValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, postsController.updateLikeHandler.bind(postsController));
