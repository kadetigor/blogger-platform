"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesRouter = void 0;
const express_1 = require("express");
const refresh_token_guard_1 = require("../../routers/guards/refresh.token.guard");
const composition_root_1 = require("../../../composition-root");
const security_devices_controller_1 = require("./security-devices.controller");
const securityDevicesController = composition_root_1.container.get(security_devices_controller_1.ScurityDevicesController);
exports.devicesRouter = (0, express_1.Router)();
exports.devicesRouter.get('/', refresh_token_guard_1.refreshTokenGuard, securityDevicesController.getDevicesHandler.bind(securityDevicesController) //getDevicesHandler
);
exports.devicesRouter.delete('/', refresh_token_guard_1.refreshTokenGuard, securityDevicesController.deleteAllOtherDevicesHandler.bind(securityDevicesController) //deleteAllOtherDevicesHandler
);
exports.devicesRouter.delete('/:id', refresh_token_guard_1.refreshTokenGuard, securityDevicesController.deleteDeviceHandler.bind(securityDevicesController) //deleteDeviceHandler
);
