"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationAndSortingDefault = void 0;
exports.paginationAndSortingValidation = paginationAndSortingValidation;
const express_validator_1 = require("express-validator");
const sortDirection_1 = require("../../types/sortDirection");
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = sortDirection_1.sortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';
exports.paginationAndSortingDefault = {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};
function paginationAndSortingValidation(sortFieldsEnum) {
    const allowedSortFields = Object.values(sortFieldsEnum);
    return [
        (0, express_validator_1.query)('pageNumber')
            .optional()
            .default(DEFAULT_PAGE_NUMBER)
            .isInt({ min: 1 }).withMessage('Page number must be a positive integer')
            .toInt(),
        (0, express_validator_1.query)('pageSize')
            .optional()
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 100 }).withMessage('Page size must be between 1 and 100')
            .toInt(),
        (0, express_validator_1.query)('sortBy')
            .optional()
            .default(DEFAULT_SORT_BY)
            .isIn(allowedSortFields).withMessage(`Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`),
        (0, express_validator_1.query)('sortDirection')
            .optional()
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(Object.values(sortDirection_1.sortDirection)).withMessage(`Sort direction must be one of: ${Object.values(sortDirection_1.sortDirection).join(', ')}`),
    ];
}
