import { param } from 'express-validator';

export const idValidationMiddleware = param('id')
  .exists().withMessage('id is required')
  .isString().withMessage('id must be a string')
  .isMongoId().withMessage('Incorrect format of ObjectId');
