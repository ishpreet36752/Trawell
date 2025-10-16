declare module "../utilis/validation" {
  import { Request } from "express";

  export function validSignUpData(req: Request): void;
  export function validUpdateData(req: Request): boolean;
}
