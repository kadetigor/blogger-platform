import { DeviceViewModel } from "./device.view.model";
import { SecurityDevice } from "./security-device";
import { WithId } from "mongodb";

export function mapToDeviceViewModel(device: WithId<SecurityDevice>): DeviceViewModel {
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate.toISOString(),
        deviceId: device.deviceId
    };
}