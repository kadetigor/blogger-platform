import { postViewModel } from "../../types/postViewModel";

export type postListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: postViewModel[];
};
