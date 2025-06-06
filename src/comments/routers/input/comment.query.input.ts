import { paginationAndSorting } from "../../../core/types/paginationAndSorting";
import { commentSortField } from "./comment.sort.field";


export type commentQueryInput = paginationAndSorting<commentSortField>
