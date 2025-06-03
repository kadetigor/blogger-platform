import jwt, { Secret } from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";

export const jwtService = {
  async createToken(userId: string): Promise<string> {

    const secret = SETTINGS.AC_SECRET as jwt.Secret
    const options = { 
      expiresIn: SETTINGS.AC_TIME as jwt.SignOptions['expiresIn'] 
    }

    return jwt.sign(
      { userId }, 
      secret, 
      options
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
