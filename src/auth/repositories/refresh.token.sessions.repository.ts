import { WithId } from "mongodb";
import { RefreshTokenSession } from "../domain/refresh.token.session";
import { refreshTokenSessionCollection } from "../../db/mongoDb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const refreshTokenSessionsRepository = {

  async create(newSession: RefreshTokenSession): Promise<string> {
    const insertResult = await refreshTokenSessionCollection.insertOne(newSession);
    return insertResult.insertedId.toString();
   },

  async findByTokenId(tokenId: string): Promise<WithId<RefreshTokenSession>> {
    const session = await refreshTokenSessionCollection.findOne<WithId<RefreshTokenSession>>({
        "tokenId": tokenId
    });

    if (!session) {
        throw new repositoryNotFoundError('Session does not exist')
    }

    return session
   },

   async findByDeviceId(deviceId: string): Promise<WithId<RefreshTokenSession>> {
    const session = await refreshTokenSessionCollection.findOne<WithId<RefreshTokenSession>>({
        "deviceId": deviceId
    });

    if (!session) {
        throw new repositoryNotFoundError('Session does not exist')
    }

    return session
   },

  async updateToRevoked(tokenId: string): Promise<boolean> {
    const updateResult = await refreshTokenSessionCollection.updateOne(
        {
            tokenId: tokenId
        },
        {
            $set: {
                isRevoked: true
            },
        },
    );

    if (updateResult.modifiedCount < 1) {
        throw new repositoryNotFoundError('Session with provided tokenId does not exist')
    }
    return updateResult.modifiedCount > 0;
   },

  async deleteExpired(): Promise<number> {
    const now = new Date()
    const filter = {
        expiresAt: { $lt: now },
    }

    const result = await refreshTokenSessionCollection.deleteMany(filter)

    return result.deletedCount
   },
}