import { ValidationError } from '../../posts/types/validationError';

export const createErrorMessages = (
    errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
    return { errorMessages: errors };
};