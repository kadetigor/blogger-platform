import { postViewModel } from "../../types/post.view-model";

export type postListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: postViewModel[];
};
