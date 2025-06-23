import { Router } from "express";
import { refreshTokenGuard } from "../../routers/guards/refresh.token.guard";
import { getDevicesHandler } from "./handlers/get.devices.handler";
import { deleteDeviceHandler } from "./handlers/delete.device.handler";
import { deleteAllOtherDevicesHandler } from "./handlers/delete.all.other.devices.handler";

export const devicesRouter = Router()

devicesRouter.get(
    '/',
    refreshTokenGuard,
    getDevicesHandler
)

devicesRouter.delete(
    '/',
    refreshTokenGuard,
    deleteAllOtherDevicesHandler
)

devicesRouter.delete(
    '/:id',
    refreshTokenGuard,
    deleteDeviceHandler
)