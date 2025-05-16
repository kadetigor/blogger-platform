import { sortDirection } from './sortDirection';

export type paginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: sortDirection;
};
