"use strict";
/* import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpStatus";
import { securityDevicesService } from "../../security-devices.service";
import { securityDeviceRepository } from "../../security-device.repository";
import { refreshTokenSessionsRepository } from "../../../repositories/refresh.token.sessions.repository";

export const deleteDeviceHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const deviceIdToDelete = req.params.id;

        // Check if device exists
        const device = await securityDeviceRepository.findByDeviceId(deviceIdToDelete);
        if (!device) {
            res.status(HttpStatus.NotFound).send();
            return;
        }

        // Check ownership
        if (device.userId !== userId) {
            res.status(HttpStatus.Forbidden).send();
            return;
        }

        // Delete the device
        await securityDeviceRepository.deleteByDeviceId(deviceIdToDelete);

        // IMPORTANT: Also invalidate all refresh token sessions for this device
        // This ensures the refresh token becomes invalid after device deletion
        await refreshTokenSessionsRepository.deleteByDeviceId(deviceIdToDelete);

        res.status(HttpStatus.NoContent).send();
        return;
    } catch (error) {
        console.error('Error in deleteDeviceHandler:', error);
        res.status(HttpStatus.InternalServerError).send();
        return;
    }
}; */ 
