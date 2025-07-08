"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const input_validtion_result_middleware_1 = require("../../core/middlewares/validation/input-validtion-result.middleware");
const access_token_guard_1 = require("../../auth/routers/guards/access.token.guard");
const comment_input_dto_validation_1 = require("./validation/comment.input.dto.validation");
const comment_id_validation_1 = require("./validation/comment.id.validation");
const composition_root_1 = require("../../composition-root");
const comments_controller_1 = require("./comments.controller");
const express_validator_1 = require("express-validator");
const commentsController = composition_root_1.container.get(comments_controller_1.CommentsController);
const likeQueryValidation = (0, express_validator_1.body)('likeStatus')
    .exists()
    .withMessage('likeStatus is Requiered')
    .isString()
    .withMessage('likeStatus must be a String')
    .isIn(['None', 'Like', 'Dislike'])
    .withMessage('likeStatus contains invalid value');
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter
    .get('/:id', params_id_validation_middleware_1.idValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, commentsController.getCommentHandler.bind(commentsController) //getCommentHandler,
)
    .delete('/:commentId', access_token_guard_1.accessTokenGuard, comment_id_validation_1.commentIdValidationMiddleware, input_validtion_result_middleware_1.inputValidationResultMiddleware, commentsController.deleteCommentHandler.bind(commentsController) //deleteCommentHandler
)
    .put('/:commentId', access_token_guard_1.accessTokenGuard, comment_id_validation_1.commentIdValidationMiddleware, comment_input_dto_validation_1.contentValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, commentsController.updateCommentHandler.bind(commentsController) //updateCommentHandler
)
    .put('/commentId/like-status', access_token_guard_1.accessTokenGuard, likeQueryValidation, input_validtion_result_middleware_1.inputValidationResultMiddleware, commentsController.updateLikeHandler.bind(commentsController));
