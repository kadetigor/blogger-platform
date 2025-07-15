import { paginationAndSorting } from "../../../core/types/paginationAndSorting";
import { blogSortField } from "./blog.sort-field";

export type blogQueryInput = paginationAndSorting<blogSortField>;
