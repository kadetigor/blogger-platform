import { userViewModel } from "../../types/userViewModel";

export type userListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: userViewModel[];
}