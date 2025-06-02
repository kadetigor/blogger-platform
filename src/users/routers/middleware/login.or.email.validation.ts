import {CustomValidator} from "express-validator";
import { userCollection } from "../../../db/mongoDb";

const loginRegex = /^[a-zA-Z0-9_-]*$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const loginOrEmailValidator: CustomValidator = async (value) => {
  const input = value?.trim();

  if (!input) {
    throw new Error('loginOrEmail is required');
  }

  if (emailRegex.test(input)) {
    // It's an email
    const existingEmail = await userCollection.findOne({ email: input });
    if (existingEmail) {
      throw new Error('This email is already taken');
    }
  } else if (loginRegex.test(input)) {
    // It's a login
    if (input.length < 3 || input.length > 10) {
      throw new Error('Login length must be 3-10 characters');
    }
    const existingLogin = await userCollection.findOne({ login: input });
    if (existingLogin) {
      throw new Error('This login is already taken');
    }
  } else {
    throw new Error('loginOrEmail must be a valid login or email');
  }

  return true;
};