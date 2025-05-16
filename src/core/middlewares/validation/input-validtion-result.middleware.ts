import { FieldValidationError, ValidationError, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/httpStatus";
import { ValidationErrorType } from "../../types/validationError";
import { ValidationErrorDto } from "../../types/validationError.dto";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorDto => {
  return { errorMessages: errors };
};

const formatValidationErrors = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg,
  }
}

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
    .formatWith(formatValidationErrors)
    .array({ onlyFirstError: true })
  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).json({ errorMessages: errors })
    return;
  }

  next()
}
