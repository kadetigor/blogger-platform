import { commentViewModel } from "../../types/comment.view.model";

export type commentListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: commentViewModel[];
};