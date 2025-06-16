import { User } from "../users/domain/user";

export type UserWithConfirmation = User & {
    emailConfirmation: {
        confirmationCode: string;
        isConfirmed: boolean;
    }
}