export interface EditProfileFormData {
  firstName: string;
  lastName: string;
  age: string | number;
  introduction: string;
  gender: string;
  instagramUsername: string;
  tiktokUsername: string;
  nationality: string;
  languages: string[];
  interests: string[];
  visitedPlaces: string[];
}