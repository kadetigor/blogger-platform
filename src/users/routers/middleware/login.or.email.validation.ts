import {body} from "express-validator";
import { userCollection } from "../../../db/mongoDb";

export const loginOrEmailValidation = body("loginOrEmail")
    .exists().withMessage('Login is required')
    .isString().withMessage('Login should be a string')
    .trim().isLength({ min: 3, max: 10}).withMessage('Length of the Login should be no less then 3 characters and no more then 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login must contain only characters and numbers')
    .custom(async (login) => {
    // replace `findOne` with whatever your ORM/method is
        const existing = await userCollection.findOne({ login });
        if (existing) {
        // throw to signal a failed validation
        throw new Error('This login is already taken');
        }
        return true;
    });