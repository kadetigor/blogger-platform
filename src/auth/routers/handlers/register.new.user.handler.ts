import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { HttpStatus } from "../../../core/types/httpStatus";

export async function registrationHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { login, email, password } = req.body
    const user = await authService.registerUser(login, email, password)
    res.status(HttpStatus.Ok).send()
    return
  } catch (e: unknown) {
    errorsHandler(e, res)
  };
}
