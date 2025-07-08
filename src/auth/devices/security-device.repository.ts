import { ObjectId, WithId } from "mongodb";
import { SecurityDevice } from "./security-device";
import 'reflect-metadata';
import { injectable } from "inversify";
import { SecurityDeviceDocument, SecurityDeviceModel } from "./security.device.schema";

@injectable()
export class SecurityDeviceRepository {
    async create(newDevice: SecurityDevice): Promise<void> {
        const device = new SecurityDeviceModel(newDevice);
        await device.save();
    }

    async findByDeviceId(deviceId: string): Promise<WithId<SecurityDevice> | null> {
        try {
            return await SecurityDeviceModel.findOne({ "deviceId" : deviceId });
        } catch (error) {
            console.error('Error finding device by deviceId:', error);
            return null;
        }
    }
    async findDevicesByUserId(userId: string): Promise<SecurityDeviceDocument[]> {
        return await SecurityDeviceModel.find({ "userId" : userId }).lean();
    }

    async updateLastActiveDate(deviceId: string, lastActiveDate: Date): Promise<boolean> {
        const result = await SecurityDeviceModel.updateOne(
            { deviceId },
            { $set: { lastActiveDate: lastActiveDate } }
        );
        return result.modifiedCount > 0;
    }

    async deleteByDeviceId(deviceId: string): Promise<boolean> {
        const result = await SecurityDeviceModel.deleteOne({ "deviceId": deviceId });
        return result.deletedCount > 0;
    }

    async deleteAllExceptOne(userId: string, deviceIdToKeep: string): Promise<boolean> {
        const result = await SecurityDeviceModel.deleteMany({
            userId,
            deviceId: { $ne: deviceIdToKeep }
        });
        return result.deletedCount > 0;
    }

    async deleteAllByUserId(userId: string): Promise<boolean> {
        const result = await SecurityDeviceModel.deleteMany({ "userId": userId });
        return result.deletedCount > 0;
    }
};