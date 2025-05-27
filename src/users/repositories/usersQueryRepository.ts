import { ObjectId, WithId } from "mongodb";
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
            } = queryDto

            const skip = (pageNumber - 1) * pageSize;
            const filter: any = {};
        
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