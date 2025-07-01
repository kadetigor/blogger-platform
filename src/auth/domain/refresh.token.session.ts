export type RefreshTokenSession = {
    userId: string;
    tokenId: string;
    deviceId: string;  // Add this field to link sessions to devices
    isRevoked: boolean;
    createdAt: Date;
    expiresAt: Date;
};