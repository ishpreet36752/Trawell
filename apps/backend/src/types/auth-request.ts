import { Request } from "express";
import { UserDocument } from "./user-model";

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
  query: {
    page?: string;
    limit?: string;
  };
}
