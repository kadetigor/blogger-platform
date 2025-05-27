import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { userListPaginatedOutput } from "../output/userListPaginatedOutput";

export function mapToUsersListPaginatedOutput(
    users: WithId<User>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): userListPaginatedOutput {
    return{
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta. totalCount,
        items: users.map((user) => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        })),
    };
}