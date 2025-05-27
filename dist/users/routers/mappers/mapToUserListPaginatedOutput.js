"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToUsersListPaginatedOutput = mapToUsersListPaginatedOutput;
function mapToUsersListPaginatedOutput(users, meta) {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: users.map((user) => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        })),
    };
}
