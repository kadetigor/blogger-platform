"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityDeviceModel = void 0;
const mongoose_1 = require("mongoose");
const refreshTokenSessionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true }, // Add this field to link sessions to devices
    title: { type: String, required: true },
    lastActiveDate: { type: Date, default: Date.now },
    expiresAt: { tyep: Date, required: true },
});
// refreshTokenSessionSchema.index({ userId: 1})
exports.SecurityDeviceModel = (0, mongoose_1.model)('RefreshTokenSession', refreshTokenSessionSchema);
