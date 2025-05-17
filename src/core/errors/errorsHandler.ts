import { Response } from 'express';
import { repositoryNotFoundError } from "./repositoryNotFoundError";
import { HttpStatus } from '../types/httpStatus';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { domainError } from './domainError';

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof repositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          message: 'Repository not found',
          field: 'id',
        },
      ]),
    );

    return;
  }

  if (error instanceof domainError) {
    const httpStatus = HttpStatus.UnprocessableEntity;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          message: 'Wrong domain',
          field: 'id',
        },
      ]),
    );

    return;
  }
  res.status(HttpStatus.InternalServerError);
  return;
}
