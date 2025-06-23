import { DeviceViewModel } from "./device.view.model";
import { SecurityDevice } from "./security-device";

export async function mapToDeviceViewModel(device: SecurityDevice): Promise<DeviceViewModel> {
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate,
        deviceId: device.deviceId
    };
}