import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { userViewModel } from "../../types/userViewModel";

export function mapToUserViewModel(user: WithId<User>): userViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    };
}