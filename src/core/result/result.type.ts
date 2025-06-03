import { HttpStatus } from "../types/httpStatus";


type ExtensionType = {
  field: string | null;
  message: string;
};

export type Result<T = null> = {
  status: HttpStatus;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};