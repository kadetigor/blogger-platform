import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongoDb";
import { userAttributes } from "../application/dtos/userAttributes";
import { User } from "../domain/user";
import { BadRequestError, repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { UserWithConfirmation } from "../../email/user.with.confirmation.type";

export const usersRepository = {

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        const res = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new repositoryNotFoundError('User does not exist')
        }
        return res;
    },

    async findByConfirmationCode(emailConfirmationCode: string): Promise<WithId<UserWithConfirmation>  | null > {
        const user = await userCollection.findOne<WithId<UserWithConfirmation>>({
            "emailConfirmation.confirmationCode": emailConfirmationCode
        });

        return user;
    },
        
    async create(newUser: User | UserWithConfirmation): Promise<string> {
        const insertResult = await userCollection.insertOne(newUser as any);
        return insertResult.insertedId.toString();
    },

    async update(id: string, dto: userAttributes): Promise<void> {
        const updateResult = await userCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    login: dto.login,
                    password: dto.password,
                    email: dto.email,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new repositoryNotFoundError('User does not exist')
        }

        return;
    },

    async delete(id: string): Promise<void> {
        const deleteResult = await userCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new repositoryNotFoundError('User does not exist')
        }
    },

    async findByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<WithId<UserWithConfirmation> | null> {
        return userCollection.findOne<WithId<UserWithConfirmation>>({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
        });
    },

    async updateConfirmation(
        _id: ObjectId,
    ): Promise<boolean> {
        const result = await userCollection
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    },

    async updateConfirmationCode(
        _id: ObjectId,
        newConfirmationCode: string
    ): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id },
            { $set: { 'emailConfirmation.confirmationCode': newConfirmationCode } }
        );
        return result.modifiedCount === 1;
    },

    async updatePassword(_id: ObjectId, passwordHash: string): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id },
            { $set: { 'passwordHash': passwordHash }}
        );
        return result.modifiedCount === 1;
    },

    async clearRecoveryCode(_id: ObjectId): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id },
            { $set: { 'emailConfirmation.confirmationCode': '' }}
        );
        return result.modifiedCount === 1;
    },
};