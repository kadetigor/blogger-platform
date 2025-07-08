"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenSessionModel = void 0;
const mongoose_1 = require("mongoose");
const refreshTokenSessionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    tokenId: { type: String, required: true },
    deviceId: { type: String, required: true }, // Add this field to link sessions to devices
    isRevoked: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});
// refreshTokenSessionSchema.index({ userId: 1})
exports.RefreshTokenSessionModel = (0, mongoose_1.model)('RefreshTokenSession', refreshTokenSessionSchema);
