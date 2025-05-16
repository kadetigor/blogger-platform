import { blogViewModel } from "../../types/blogViewModel";

export type blogListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: blogViewModel[];
};
