import { User } from "../domain/user";
import { usersRepository } from "../repositories/usersRepository";
import { userAttributes } from "./dtos/userAttributes";

export const usersService = {
    async create(dto: userAttributes): Promise<string> {
        const newUser: User = {
            login: dto.login,
            email: dto.email,
            createdAt: new Date(),
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
}