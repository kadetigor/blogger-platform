import jwt, { Secret } from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";

export const jwtService = {
  async createToken(userId: string): Promise<string> {

    const secret = SETTINGS.AC_SECRET
    const acTime = SETTINGS.AC_TIME as number
  
    return jwt.sign(
      { userId }, 
      secret, 
      {expiresIn: `${acTime}s`}
    );
  },

  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },
  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};
