import { body } from "express-validator";

export const likeQueryValidation = body('likeStatus')
    .exists()
    .withMessage('likeStatus is Required')
    .isString()
    .withMessage('likeStatus must be a String')
    .isIn(['None', 'Like', 'Dislike'])
    .withMessage('likeStatus contains invalid value')