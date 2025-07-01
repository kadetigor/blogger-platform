import { RefreshTokenSession } from "../domain/refresh.token.session";
import { refreshTokenSessionCollection } from "../../db/mongoDb";

export const refreshTokenSessionsRepository = {
    async createSession(session: RefreshTokenSession): Promise<void> {
        await refreshTokenSessionCollection.insertOne(session);
    },

    async findSessionByTokenId(tokenId: string): Promise<RefreshTokenSession | null> {
        return await refreshTokenSessionCollection.findOne({ tokenId });
    },

    async invalidateSession(tokenId: string): Promise<boolean> {
        const result = await refreshTokenSessionCollection.updateOne(
            { tokenId },
            { $set: { isRevoked: true } }
        );
        return result.modifiedCount > 0;
    },

    async deleteExpiredSessions(): Promise<void> {
        await refreshTokenSessionCollection.deleteMany({
            expiresAt: { $lt: new Date() }
        });
    },

    // Add these new methods for device-related operations
    async deleteByDeviceId(deviceId: string): Promise<boolean> {
        const result = await refreshTokenSessionCollection.deleteMany({ deviceId });
        return result.deletedCount > 0;
    },

    async deleteAllUserSessionsExceptOne(userId: string, deviceIdToKeep: string): Promise<boolean> {
        const result = await refreshTokenSessionCollection.deleteMany({
            userId,
            deviceId: { $ne: deviceIdToKeep }
        });
        return result.deletedCount > 0;
    },

    async findSessionsByUserId(userId: string): Promise<RefreshTokenSession[]> {
        return await refreshTokenSessionCollection.find({ userId }).toArray();
    }
};