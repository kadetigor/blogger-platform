import { Request, Response } from "express";
import { securityDevicesService } from "../../security-devices.service";
import { HttpStatus } from "../../../../core/types/httpStatus";
import { securityDeviceRepository } from "../../security-device.repository";


export const deleteDeviceHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const deviceId = req.params.id;

        // Check if device exists
        const device = await securityDeviceRepository.findByDeviceId(deviceId);
        if (!device) {
            res.status(HttpStatus.NotFound).send();
            return;
        }

        // Check ownership
        const isOwner = await securityDevicesService.validateDeviceOwnership(userId, deviceId);
        if (!isOwner) {
            res.status(HttpStatus.Forbidden).send();
            return;
        }

        // Delete device
        await securityDevicesService.deleteDevice(userId, deviceId);
        res.status(HttpStatus.NoContent).send();
        return;
    } catch (error) {
        console.error('Error in deleteDeviceHandler:', error);
        res.status(HttpStatus.InternalServerError).send();
        return;
    }
};