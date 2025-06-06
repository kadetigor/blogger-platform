import { param } from 'express-validator';

export const commentIdValidationMiddleware = param('commentId')
  .exists().withMessage('commentId is required')
  .isString().withMessage('commentId must be a string')
  .isMongoId().withMessage('Incorrect format of ObjectId');