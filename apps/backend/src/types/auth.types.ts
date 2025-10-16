export type Gender = "male" | "female" | "others";

export interface SignupBody {
  firstName: string;
  lastName?: string;
  age: number;
  emailId: string;
  gender: Gender;
  image?: string;
  password: string;
  about?: string;
}

export interface LoginBody {
  emailId: string;
  password: string;
}
