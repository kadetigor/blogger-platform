import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { HttpStatus } from "../../../core/types/httpStatus";

export async function registrationHandler(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const { login, email, password } = req.body;
    const result = await authService.registerUser(login, email, password);
    
    if (result.status !== HttpStatus.NoContent) {
      res.status(result.status).json({
        errorsMessages: result.extensions
      });
      return;
    }

    res.sendStatus(HttpStatus.NoContent);
    return result.data!.confirmationCode;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
