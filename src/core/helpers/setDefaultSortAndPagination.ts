import { paginationAndSortingDefault } from "../middlewares/validation/queryPaginationSortingValidationMiddleware";
import { paginationAndSorting } from "../types/paginationAndSorting";

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: Partial<paginationAndSorting<P>>,
): paginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}
