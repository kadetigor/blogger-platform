import { param } from 'express-validator';

export const postIdValidationMiddleware = param('postId')
  .exists().withMessage('postId is required')
  .isString().withMessage('postId must be a string')
  .isMongoId().withMessage('Incorrect format of ObjectId');