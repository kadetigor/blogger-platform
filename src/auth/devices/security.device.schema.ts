import { Document, model, Schema, Types } from "mongoose";
import { SecurityDevice } from "./security-device";


export interface SecurityDeviceDocument extends SecurityDevice, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const secuerityDeviceSchema = new Schema<SecurityDeviceDocument>({
    userId: { type: String, required: true },
    deviceId: { type : String, required: true },
    ip: { type : String, required: true },  // Add this field to link sessions to devices
    title: { type: String, required: true },
    lastActiveDate: { type : Date, default: Date.now },
    expiresAt: { type: Date, required: true },
})

// refreshTokenSessionSchema.index({ userId: 1})

export const SecurityDeviceModel = model<SecurityDeviceDocument>('SecurityDevice', secuerityDeviceSchema)