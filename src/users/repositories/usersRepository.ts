import 'reflect-metadata';
import { userAttributes } from "../application/dtos/userAttributes";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { injectable } from "inversify";
import { UserDocument, UserModel } from "../domain/user.schema";
import { User } from '../domain/user';
import { UserWithConfirmation } from '../../email/user.with.confirmation.type';

@injectable()
export class UsersRepository {
    async findByIdOrFail(id: string): Promise<UserDocument> {
        const result = await UserModel.findById(id);

        if (!result) {
            throw new repositoryNotFoundError('User does not exist')
        }
        return result;
    }

    async findByConfirmationCode(emailConfirmationCode: string): Promise<UserDocument  | null > {
        return await UserModel.findByConfirmationCode(emailConfirmationCode);
    }
        
    async create(newUser: User | UserWithConfirmation): Promise<string> {
        const user = new UserModel(newUser);
        const savedUser = await user.save();
        return savedUser._id.toString();
    }

    async update(id: string, dto: userAttributes): Promise<void> {
        const result = await UserModel.findByIdAndUpdate(
            id,
            {
                login: dto.login,
                password: dto.password,
                email: dto.email,
            },
        );

        if (!result) {
            throw new repositoryNotFoundError('User does not exist')
        }

        return;
    }

    async delete(id: string): Promise<void> {
        const result = await UserModel.findByIdAndDelete(id);

        if (!result) {
            throw new repositoryNotFoundError('User does not exist')
        }
    }

    async findByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<UserDocument | null> {
        return UserModel.findByLoginOrEmail(loginOrEmail);
    }

    async updateConfirmation(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndUpdate(
            id,
            { $set: { 'emailConfirmation.isConfirmed': true } }
        );
        return !!result;
    }

    async updateConfirmationCode(id: string, newConfirmationCode: string): Promise<boolean> {
        const result = await UserModel.findByIdAndUpdate(
            id,
            { $set: { 'emailConfirmation.confirmationCode': newConfirmationCode } }
        );
        return !!result;
    }

    async updatePassword(id: string, passwordHash: string): Promise<boolean> {
        const result = await UserModel.findByIdAndUpdate(
            id,
            { $set: { passwordHash } }
        );
        return !!result;
    }

    async clearRecoveryCode(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndUpdate(
            id,
            { $set: { 'emailConfirmation.confirmationCode': '' } }
        );
        return !!result;
    }
}