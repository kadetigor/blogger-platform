import { Request, Response } from "express";
import { securityDevicesService } from "../../security-devices.service";
import { HttpStatus } from "../../../../core/types/httpStatus";


export const deleteDeviceHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const deviceId = req.params.deviceId;

        if (!deviceId) {
            res.status(HttpStatus.BadRequest).send();
            return
        }

        // Delete the specific device
        await securityDevicesService.deleteDevice(userId, deviceId);

        res.status(HttpStatus.NoContent).send();

        return

    } catch (error: unknown) {
        console.error('Error in deleteDeviceHandler:', error);

        // Handle specific errors
        if ((error as any).message === 'Device does not belong to provided userId.') {
            res.status(HttpStatus.Unauthorized).send();
            return
        }

        if ((error as any).message.includes('not found')) {
            res.status(HttpStatus.BadRequest).send();
            return
        }
        res.status(HttpStatus.InternalServerError).send();
        return
    }
};