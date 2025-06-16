import { body } from 'express-validator';
import { userCollection } from '../../../db/mongoDb';

const loginValidation = body('login')
    .exists().withMessage('Login is required')
    .isString().withMessage('Login should be a string')
    .trim().isLength({ min: 3, max: 10}).withMessage('Length of the Login should be no less then 3 characters and no more then 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login must contain only characters and numbers')
    .custom(async (login) => {
        const existing = await userCollection.findOne({ 
            $or: [{ login }, { email: login }] 
        });
        if (existing) {
            throw new Error('This login is already taken');
        }
        return true;
    });

export const passwordValidation = body('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password should be a string')
    .trim().isLength({ min: 6, max: 20}).withMessage('Length of the Password should be no less then 6 characters and no more then 20 characters')

const emailValidation = body('email')
    .exists().withMessage('Email is required')
    .isString().withMessage('Email should be a string')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email must be a valid email format')
    .custom(async (email) => {
        const existing = await userCollection.findOne({ 
            $or: [{ email }, { login: email }] 
        });
        if (existing) {
            throw new Error('This email is already taken');
        }
        return true;
    });

export const userInputDtoValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
]