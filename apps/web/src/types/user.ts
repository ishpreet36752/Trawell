export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;          
  name?: string;
  age?: string | number;
  gender: string;
  about?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}
