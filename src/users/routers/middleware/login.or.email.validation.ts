import {CustomValidator} from "express-validator";
import { userCollection } from "../../../db/mongoDb";

const loginRegex = /^[a-zA-Z0-9_-]*$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const loginOrEmailValidator: CustomValidator = async (value, { req }) => {
  const login = req.body.login;
  const email = req.body.email;

  if ((!login || login.trim() === '') && (!email || email.trim() === '')) {
    throw new Error('Either login or email is required');
  }

  if (login && login.trim() !== '') {
    if (login.length < 3 || login.length > 10) {
      throw new Error('Login length must be 3-10 characters');
    }
    if (!loginRegex.test(login)) {
      throw new Error('Login must contain only characters, numbers, underscores or dashes');
    }
    const existingLogin = await userCollection.findOne({ login });
    if (existingLogin) {
      throw new Error('This login is already taken');
    }
  }

  if (email && email.trim() !== '') {
    if (!emailRegex.test(email)) {
      throw new Error('Email must be valid');
    }
    const existingEmail = await userCollection.findOne({ email });
    if (existingEmail) {
      throw new Error('This email is already taken');
    }
  }

  return true;
};