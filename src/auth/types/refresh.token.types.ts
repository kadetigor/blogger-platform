import { WithId } from "mongodb";
import { RefreshTokenSession } from "../domain/refresh.token.session";

export type CreateRefreshSessionDto = {
    userId: string;
    tokenId: string;
    expiresAt: Date;
}

export type RefreshTokenPayload = {
    userId: string;
    tokenId: string;
    iat: number;
    exp: number;
}

export type SessionValidationResult = {
    isValid: boolean;
    session?: WithId<RefreshTokenSession>;
    userId?: string;
    error?: 'NOT_FOUND' | 'EXPIRED' | 'REVOKED';
}

export type RefreshTokensResult = {
    accessToken: string;
    refreshToken: string;
}