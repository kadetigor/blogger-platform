import { Router } from "express";
import { refreshTokenGuard } from "../../routers/guards/refresh.token.guard";
import { container } from "../../../composition-root";
import { ScurityDevicesController } from "./security-devices.controller";

const securityDevicesController = container.get(ScurityDevicesController)

export const devicesRouter = Router()

devicesRouter.get(
    '/',
    refreshTokenGuard,
    securityDevicesController.getDevicesHandler.bind(securityDevicesController)//getDevicesHandler
)

devicesRouter.delete(
    '/',
    refreshTokenGuard,
    securityDevicesController.deleteAllOtherDevicesHandler.bind(securityDevicesController)//deleteAllOtherDevicesHandler
)

devicesRouter.delete(
    '/:id',
    refreshTokenGuard,
    securityDevicesController.deleteDeviceHandler.bind(securityDevicesController)//deleteDeviceHandler
)