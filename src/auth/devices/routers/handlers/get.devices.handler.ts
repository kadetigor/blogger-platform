import { Request, Response } from "express";
import { securityDevicesService } from "../../security-devices.service";
import { mapToDeviceViewModel } from "../../map.to.device.view.model";
import { HttpStatus } from "../../../../core/types/httpStatus";


export async function getDevicesHandler(
    req: Request,
    res: Response,
) {
    try {
        const devices = await securityDevicesService.getAllUserDevices(req.user!.id)

        if (!devices) {
            res.status(HttpStatus.BadRequest).send();
            return
        }

        const devicesViewModels = devices.map(device => mapToDeviceViewModel(device));
        res.status(HttpStatus.Ok).json(devicesViewModels);
        return
    } catch (e: unknown) {
        console.error('Error in getDevicesHandler:', e);
        res.status(HttpStatus.InternalServerError).send();
        return
    }
}