import { BcryptService } from "../../auth/adapters/bcrypt.adapter";
import 'reflect-metadata';
import { UsersRepository } from "../repositories/usersRepository";
import { userAttributes } from "./dtos/userAttributes";
import { UserWithConfirmation } from "../../email/user.with.confirmation.type";
import { v4 as uuid } from 'uuid';
import { inject, injectable } from "inversify";

@injectable()
export class UsersService {

    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(BcryptService) protected bcryptService: BcryptService,
    ) {}

    async create(dto: userAttributes): Promise<string> {

        const { login, password, email } = dto;

        const passwordHash = await this.bcryptService.generateHash(password);

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
        
        return this.usersRepository.create(newUser);
    }

    async udate(id: string, dto: userAttributes): Promise<void> {
        await this.usersRepository.update(id, dto)
        return;
    }

    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id);
        return;
    }
}

/* export const usersService = {
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

    async udate(id: string, dto: userAttributes): Promise<void> {
        await usersRepository.update(id, dto)
        return;
    },

    async delete(id: string): Promise<void> {
        await usersRepository.delete(id);
        return;
    },
} */