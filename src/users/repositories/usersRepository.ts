import { ObjectId } from "mongodb";
import { userCollection } from "../../db/mongoDb";
import { userAttributes } from "../application/dtos/userAttributes";
import { User } from "../domain/user";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const usersRepository = {
    async create(newUser: User): Promise<string> {
        const insertResult = await userCollection.insertOne(newUser);
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
    }
}