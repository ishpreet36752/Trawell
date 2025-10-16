import { Model } from "mongoose";
// Enumerated gender type
export type Gender = "male" | "female" | "others";

// Main User interface (fields)
export interface IUser {
  firstName: string;
  lastName?: string;
  emailId: string;
  password: string;
  age?: number;
  gender?: Gender;
  image?: string;
  about?: string;
}

// Methods available on a user document
export interface IUserMethods {
  getJWT(): Promise<string>;
  validatePassword(passwordByUser: string): Promise<boolean>;
}

/**
 * A hydrated document has both schema fields and instance methods.
 */
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

/**
 * The model interface describing static methods (if any).
 */
export type UserModel = Model<IUser, {}, IUserMethods> & {
  new (doc: IUser): UserDocument;
};