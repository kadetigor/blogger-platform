import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";

export const jwtService = {
  createToken(userId: string): string {
    return jwt.sign(
      { userId }, 
      SETTINGS.AC_SECRET as string, 
      { expiresIn: SETTINGS.AC_TIME as string }
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
