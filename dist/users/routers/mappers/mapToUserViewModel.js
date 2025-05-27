"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToUserViewModel = mapToUserViewModel;
function mapToUserViewModel(user) {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    };
}
