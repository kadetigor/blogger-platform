import { Filter, ObjectId, WithId } from "mongodb";
import { User } from "../domain/user";
import { userCollection } from "../../db/mongoDb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { userQueryInput } from "../routers/input/userQueryInput";

export const usersQueryRepository = {
    async findMany(
        queryDto: userQueryInput,
    ): Promise<{ items: WithId<User>[]; totalCount: number }> {
        const {
              pageNumber,
              pageSize,
              sortBy,
              sortDirection,
              searchLoginTerm,
              searchEmailTerm,
            } = queryDto

            const skip = (pageNumber - 1) * pageSize;
            const filter: Filter<User> = {};

            const orConditions: Filter<User>[] = [];

            if (searchLoginTerm && searchLoginTerm.trim() !== "") {
            orConditions.push({
                login: {
                $regex: searchLoginTerm,
                $options: "i",
                },
            });
            }

            if (searchEmailTerm && searchEmailTerm.trim() !== "") {
            orConditions.push({
                email: {
                $regex: searchEmailTerm,
                $options: "i",
                },
            });
            }

            if (orConditions.length > 0) {
            filter.$or = orConditions;
            }
        
            const items = await userCollection
              .find(filter)
              .sort({ [sortBy]: sortDirection })
              .skip(skip)
              .limit(pageSize)
              .toArray();
        
            const totalCount = await userCollection.countDocuments(filter);
        
            return { items, totalCount };
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        const res = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new repositoryNotFoundError('User does not exist')
        }
        return res;
    }
}