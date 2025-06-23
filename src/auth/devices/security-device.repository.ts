import { WithId } from "mongodb";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { SecurityDevice } from "./security-device";
import { securityDevicesCollection } from "../../db/mongoDb";

export const securityDeviceRepository = {

  async create(device: SecurityDevice): Promise<string> {
    const insertResult = await securityDevicesCollection.insertOne(device);
    return insertResult.insertedId.toString();
   },

  async findDevicesByUserId(userId: string): Promise<WithId<SecurityDevice>[]> {
    const devices = await securityDevicesCollection.find<WithId<SecurityDevice>>({
        "userId": userId
    });

    if (!devices) {
        throw new repositoryNotFoundError('Devices for this user do not exist.')
    }

    return devices.toArray()
   },
   
   async findByDeviceId(deviceId: string): Promise<WithId<SecurityDevice>> {
    const device = await securityDevicesCollection.findOne<WithId<SecurityDevice>>({
        "deviceId": deviceId
    });

    if (!device) {
        throw new repositoryNotFoundError('Device with provided deviceId does not exist.')
    }

    return device
    },

  async updateLastActiveDate(deviceId: string, date: Date): Promise<boolean> {
    const updateResult = await securityDevicesCollection.updateOne(
        {
            deviceId: deviceId
        },
        {
            $set: {
                lastActiveDate: date
            },
        },
    );
    return updateResult.modifiedCount > 0;
   },

  async deleteByDeviceId(deviceId: string): Promise<void> {
		const result = await securityDevicesCollection.deleteOne({
			deviceId: deviceId
		});

		if (result.deletedCount === 0) {
			throw new repositoryNotFoundError('Device with provided deviceId does not exist.')
		}

		return
	},

	async deleteAllExceptOne(userId: string, deviceIdToKeep: string): Promise<void> {
		const result = await securityDevicesCollection.deleteMany({
			userId: userId,
			deviceId: { $ne: deviceIdToKeep }
		});

		if (result.deletedCount === 0) {
	}

	return
	},

	async deleteExpiredDevices(): Promise<number> {
		const now = new Date()
		const filter = {
			expiresAt: { $lt: now },
		}

		const result = await securityDevicesCollection.deleteMany(filter)

		return result.deletedCount
	}
}