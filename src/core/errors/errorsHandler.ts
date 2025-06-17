import { Response } from 'express';
import { repositoryNotFoundError } from "./repositoryNotFoundError";
import { HttpStatus } from '../types/httpStatus';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { domainError } from './domainError';

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof repositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound; // Changed from BadRequest to NotFound for repository errors

    res.status(httpStatus).json({
      errorsMessages: [{
        message: error.message || 'Resource not found',
        field: 'id',
      }]
    });
    return;
  }

  if (error instanceof domainError) {
    const httpStatus = HttpStatus.BadRequest;

    res.status(httpStatus).json({
      errorsMessages: [{
        message: error.message,
        field: error.source || 'unknown',
      }]
    });
    return;
  }
  
  res.status(HttpStatus.InternalServerError).json({
    errorsMessages: [{
      message: 'Internal server error',
      field: 'server',
    }]
  });
}