import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { RefreshTokenPayload, SessionValidationResult } from "../types/refresh.token.types";

export const jwtService = {
  async createToken(userId: string, userLogin: string): Promise<string> {

    const secret = SETTINGS.AC_SECRET
    const acTime = SETTINGS.AC_TIME as number
  
    return jwt.sign(
      { userId, userLogin }, 
      secret, 
      {expiresIn: `${acTime}s`}
    );
  },

  async verifyToken(token: string): Promise<{ userId: string, userLogin: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string, userLogin: string};
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },

  async createRefreshToken(userId: string, tokenId: string): Promise<string> {
    const secret = SETTINGS.REFRESH_SECRET
    const acTime = SETTINGS.REFRESH_TIME as number

    return jwt.sign(
      {userId, tokenId} as RefreshTokenPayload,
      secret,
      {expiresIn: `${acTime}s`}
    )
  },

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
    try {
      return jwt.verify(token, SETTINGS.REFRESH_SECRET) as RefreshTokenPayload;
    } catch (error) {
      console.error("Refresh token verify some error:", error)
      return null
    }
  },
};
