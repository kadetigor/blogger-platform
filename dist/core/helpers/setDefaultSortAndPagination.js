"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultSortAndPaginationIfNotExist = setDefaultSortAndPaginationIfNotExist;
const queryPaginationSortingValidationMiddleware_1 = require("../middlewares/validation/queryPaginationSortingValidationMiddleware");
function setDefaultSortAndPaginationIfNotExist(query) {
    var _a;
    return Object.assign(Object.assign(Object.assign({}, queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault), query), { sortBy: ((_a = query.sortBy) !== null && _a !== void 0 ? _a : queryPaginationSortingValidationMiddleware_1.paginationAndSortingDefault.sortBy) });
}
