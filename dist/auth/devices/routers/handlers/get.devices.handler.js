"use strict";
/* import { Request, Response } from "express";
import { securityDevicesService } from "../../security-devices.service";
import { mapToDeviceViewModel } from "../../map.to.device.view.model";
import { HttpStatus } from "../../../../core/types/httpStatus";


export async function getDevicesHandler(
    req: Request,
    res: Response,
) {
    try {
        // Get userId from authenticated request
        const userId = (req as any).userId;
        
        const devices = await securityDevicesService.getAllUserDevices(userId);

        if (!devices || devices.length === 0) {
            res.status(HttpStatus.Ok).json([]);
            return;
        }

        const devicesViewModels = devices.map(device => mapToDeviceViewModel(device));
        res.status(HttpStatus.Ok).json(devicesViewModels);
        return;
    } catch (e: unknown) {
        console.error('Error in getDevicesHandler:', e);
        res.status(HttpStatus.InternalServerError).send();
        return;
    }
} */ 
