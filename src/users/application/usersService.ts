import { bcryptService } from "../../auth/adapters/bcrypt.service";
import { User } from "../domain/user";
import { usersRepository } from "../repositories/usersRepository";
import { userAttributes } from "./dtos/userAttributes";
import { UserWithConfirmation } from "../../email/user.with.confirmation.type";
import { v4 as uuid } from 'uuid';

export const usersService = {
    async create(dto: userAttributes): Promise<string> {

        const { login, password, email } = dto;

        const passwordHash = await bcryptService.generateHash(password);

        // Create user with already confirmed email when created through admin endpoint
        const newUser: UserWithConfirmation = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: uuid(),
                isConfirmed: true // Already confirmed for admin-created users
            }
        };
        
        return usersRepository.create(newUser);
    },
}