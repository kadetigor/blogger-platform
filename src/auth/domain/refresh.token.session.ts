export type RefreshTokenSession = {
    userId: string;
    tokenId: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt: Date;
}