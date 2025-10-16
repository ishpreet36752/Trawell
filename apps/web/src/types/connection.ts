import { User } from "./user";

export interface Connection extends User {
  location?: string;
  [key: string]: any;
}