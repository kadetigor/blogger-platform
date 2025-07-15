import { blogViewModel } from "../../types/blog.view-model";

export type blogListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: blogViewModel[];
};
