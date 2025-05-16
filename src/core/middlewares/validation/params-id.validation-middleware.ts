import { body, param } from 'express-validator';

export const idValidationMiddleware = param('id')
  .exists().withMessage('id is required')
  .isString().withMessage('id must be a string')
  .isMongoId().withMessage('Incorrect format of ObjectId');

export const dataIdMatchValidation = body('data.id')
  .exists().withMessage('ID in body is required')
  .custom((value, { req }) => {
    if (value !== req?.params?.id) {
      throw new Error('ID in URL and body must match');
    }
    return true;
  });
