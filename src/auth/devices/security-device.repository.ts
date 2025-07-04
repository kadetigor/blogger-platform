import { ObjectId, WithId } from "mongodb";
import { SecurityDevice } from "./security-device";
import { securityDevicesCollection } from "../../db/mongoDb";
import 'reflect-metadata';
import { injectable } from "inversify";

@injectable()
export class SecurityDeviceRepository {
    async create(device: SecurityDevice): Promise<void> {
        await securityDevicesCollection.insertOne(device);
    }

    async findByDeviceId(deviceId: string): Promise<WithId<SecurityDevice> | null> {
        try {
            return await securityDevicesCollection.findOne({ deviceId });
        } catch (error) {
            console.error('Error finding device by deviceId:', error);
            return null;
        }
    }
    async findDevicesByUserId(userId: string): Promise<WithId<SecurityDevice>[]> {
        return await securityDevicesCollection.find({ userId }).toArray();
    }

    async updateLastActiveDate(deviceId: string, lastActiveDate: Date): Promise<boolean> {
        const result = await securityDevicesCollection.updateOne(
            { deviceId },
            { $set: { lastActiveDate } }
        );
        return result.modifiedCount > 0;
    }

    async deleteByDeviceId(deviceId: string): Promise<boolean> {
        const result = await securityDevicesCollection.deleteOne({ deviceId });
        return result.deletedCount > 0;
    }

    async deleteAllExceptOne(userId: string, deviceIdToKeep: string): Promise<boolean> {
        const result = await securityDevicesCollection.deleteMany({
            userId,
            deviceId: { $ne: deviceIdToKeep }
        });
        return result.deletedCount > 0;
    }

    async deleteAllByUserId(userId: string): Promise<boolean> {
        const result = await securityDevicesCollection.deleteMany({ userId });
        return result.deletedCount > 0;
    }
};