import type { User } from "./user";

export interface Request {
   _id: string;
  fromUserId?: User;   
  toUserId?: User;
  status: "pending" | "accept" | "reject";
}
