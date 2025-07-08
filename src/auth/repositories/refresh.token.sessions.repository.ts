import { RefreshTokenSession } from "../domain/refresh.token.session";
import 'reflect-metadata';
import { injectable } from "inversify";
import { RefreshTokenSessionDocument, RefreshTokenSessionModel } from "../domain/refresh.token.session.schema";

@injectable()
export class RefreshTokenSessionsRepository {
    async createSession(newSession: RefreshTokenSession): Promise<void> {
        const session = new RefreshTokenSessionModel(newSession)
        await session.save();
    }

    async findSessionByTokenId(tokenId: string): Promise<RefreshTokenSessionDocument | null> {
        return await RefreshTokenSessionModel.findOne({ "tokenId": tokenId });
    }

    async invalidateSession(tokenId: string): Promise<boolean> {
        const result = await RefreshTokenSessionModel.updateOne(
            { tokenId },
            { $set: { isRevoked: true } }
        );
        return result.modifiedCount > 0;
    }

    async deleteExpiredSessions(): Promise<void> {
        await RefreshTokenSessionModel.deleteMany({
            expiresAt: { $lt: new Date() }
        });
    }

    // Add these new methods for device-related operations
    async deleteByDeviceId(deviceId: string): Promise<boolean> {
        const result = await RefreshTokenSessionModel.deleteMany({ deviceId });
        return result.deletedCount > 0;
    }

    async deleteAllUserSessionsExceptOne(userId: string, deviceIdToKeep: string): Promise<boolean> {
        const result = await RefreshTokenSessionModel.deleteMany({
            userId,
            deviceId: { $ne: deviceIdToKeep }
        });
        return result.deletedCount > 0;
    }

    async findSessionsByUserId(userId: string): Promise<RefreshTokenSession[]> {
        return await RefreshTokenSessionModel.find({ userId }).lean();
    }
};