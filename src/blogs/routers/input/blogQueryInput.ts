import { paginationAndSorting } from "../../../core/types/paginationAndSorting";
import { blogSortField } from "./blogSortField";

export type blogQueryInput = paginationAndSorting<blogSortField>;
