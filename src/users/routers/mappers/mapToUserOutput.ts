import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { userDataOutput } from "../output/userDataOutput";

export function mapToUserOutput(user: WithId<User>): userDataOutput {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}