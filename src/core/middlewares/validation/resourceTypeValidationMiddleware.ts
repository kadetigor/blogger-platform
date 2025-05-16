import { body } from 'express-validator';
import { resourceType } from '../../types/resourceType';

export function resourceTypeValidation(resourceType: resourceType) {
  return body('data.type')
    .isString()
    .equals(resourceType).withMessage(`Resource type must be ${resourceType}`);
}
