import { Schema, model, Document, Types } from 'mongoose';
import { RefreshTokenSession } from './refresh.token.session';

export interface RefreshTokenSessionDocument extends RefreshTokenSession, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

const refreshTokenSessionSchema = new Schema<RefreshTokenSessionDocument>({
    userId: { type: String, required: true },
    tokenId: {type : String, required: true},
    deviceId: {type : String, required: true},  // Add this field to link sessions to devices
    isRevoked: {type: Boolean, required: true},
    createdAt: {type : Date, default: Date.now },
    expiresAt: {tyep: Date, required: true },
})

// refreshTokenSessionSchema.index({ userId: 1})

export const RefreshTokenSessionModel = model<RefreshTokenSessionDocument>('RefreshTokenSession', refreshTokenSessionSchema)