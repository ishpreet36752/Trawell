import React, { useEffect, useState, VoidFunctionComponent } from "react";
import { Camera, X, Plus, ChevronDown, Search } from "lucide-react";
import { EditCard, CardContent } from "./ui/UpdateCard";
import Card from "./Card";
import {
  availableLanguages,
  availableInterests,
  countries,
  BASE_URL,
} from "../utils/contants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import {User} from "../types/user"
import type { AppDispatch } from "../utils/appStore";
import { EditProfileFormData } from "../types/forms";
interface EditProfileProp{
  user:Pick<User, "firstName" | "lastName" | "age" | "gender" | "about" | "image">;
}
interface SelectionModalProps {
  title: string;
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const EditProfile:React.FC<EditProfileProp> = ({ user }) => {
  const { firstName, lastName, image, age, gender, about } = user;
  // isPreview === true means "Preview" mode is active
  const [isPreview, setIsPreview] = useState<boolean>(false);

  // Initial form data state
    const [formData, setFormData] = useState<EditProfileFormData>({
      firstName,
      lastName,
      age: age || "",
      introduction: about || "",
      gender: gender || "",
      instagramUsername: "",
      tiktokUsername: "",
      nationality: "Canada",
      languages: ["English"],
      interests: ["Adventure", "Beach", "Camping"],
      visitedPlaces: ["Canada"],
    });


  const [error, setError] = useState<string>("");
  const [showToast , setShowToast] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>();

  const saveProfile = async ():Promise<void> => {
    setError("");
    try {
      const res = await axios.patch(
        `${BASE_URL}/user/1`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          about: formData.introduction,
          gender: formData.gender,
          image: image,
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err:any) {
      const errorMessage = err.response?.data || "Failed to save profile. Please try again.";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 3000);
      console.error(err);
    }
  };

  // Modal states
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [showInterestsModal, setShowInterestsModal] = useState<boolean>(false);
  const [showPlacesModal, setShowPlacesModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Profile image state
    const [profileImages, setProfileImages] = useState<{
      main?: string ;
      second: string | null;
      third: string | null;
    }>({
      main: image ,
      second:null,
      third:null
    });

  const handleImageUpload = (slot:string, e: React.ChangeEvent<HTMLInputElement>):void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImages((prev) => ({
          ...prev,
          [slot]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Selection handlers
  const toggleLanguage = (language:string):void => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const toggleInterest = (interest:{name:string}):void => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest.name)
        ? prev.interests.filter((i) => i !== interest.name)
        : [...prev.interests, interest.name],
    }));
  };

  const togglePlace = (country:{name:string}) => {
    setFormData((prev) => ({
      ...prev,
      visitedPlaces: prev.visitedPlaces.includes(country.name)
        ? prev.visitedPlaces.filter((p) => p !== country.name)
        : [...prev.visitedPlaces, country.name],
    }));
  };

  // Selection Modal Component
  const SelectionModal:React.FC<SelectionModalProps> = ({ title, show, onClose, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-4 m-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        !isPreview
          ? "min-h-screen bg-gray-50 py-10 px-4 "
          : " py-10 px-4 flex justify-center bg-gray-50 "
      } `}
    >
      {(error || showToast) && (
        <div className="toast toast-top toast-center">
          <div className={`alert ${error ? 'bg-red-500' : 'bg-green-400'} flex justify-center`}>
            <span>{error || 'Profile saved successfully!'}</span>
          </div>
        </div>
      )}

      <EditCard
        className={`${
          !isPreview ? "max-w-2xl mx-auto shadow-2xl" : "max-w-xl shadow-2xl"
        }`}
      >
        {/* Header Navigation */}
        <div className="text-xl font-bold flex justify-center border-b-2 shadow-md">
          <div className="button border-r-2">
            <button
              className={`m-3 flex ${!isPreview ? "text-blue-500" : ""}`}
              onClick={() => setIsPreview(false)}
            >
              Edit
            </button>
          </div>
          <div className="button">
            <button
              className={`m-3 ${isPreview ? "text-blue-500" : ""}`}
              onClick={() => setIsPreview(true)}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Conditionally render Edit Form or Preview Card */}
        {isPreview ? (
          // Preview Mode: Show the Card component
          <div className="z-10">
            <Card
              user={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: formData.age,
                gender: formData.gender, // Adjust if gender becomes editable
                about: formData.introduction, // or change key to 'about' in formData
                image: profileImages.main??"",
              }}
            />
          </div>
        ) : (
          // Edit Mode: Show the edit form inside CardContent
          <CardContent className="p-6">
            {/* Profile Card */}
            <div className="bg-blue-500 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white">
                    {profileImages.main ? (
                      <img
                        src={profileImages.main}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <label className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full cursor-pointer shadow-lg">
                      <Camera className="w-4 h-4 text-gray-600" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload("main", e)}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-blue-100">Hover to edit profile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Introduction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      introduction: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write a brief introduction about yourself..."
                />
              </div>

              {/* Age section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, age: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  className="select select-bordered w-full max-w-xs bg-gray-50"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <option disabled value="">
                    Choose your gender
                  </option>
                  <option value={"male"}>Male</option>
                  <option value={"female"}>Female</option>
                  <option value={"others"}>Others</option>
                </select>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                    >
                      {lang}
                      <button
                        onClick={() => toggleLanguage(lang)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => setShowLanguageModal(true)}
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm flex items-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Language
                  </button>
                </div>
              </div>

              {/* Interests Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((interest) => {
                    const interestObj = availableInterests.find(
                      (i) => i.name === interest
                    );
                    return (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                      >
                        {interestObj?.icon} {interest}
                        <button
                          onClick={() => toggleInterest({ name: interest })}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    );
                  })}
                  <button
                    onClick={() => setShowInterestsModal(true)}
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm flex items-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Interest
                  </button>
                </div>
              </div>

              {/* Visited Places */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Visited Places
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.visitedPlaces.map((place) => {
                    const country = countries.find((c) => c.name === place);
                    return (
                      <span
                        key={place}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                      >
                        {country?.flag} {place}
                        <button
                          onClick={() => togglePlace({ name: place })}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    );
                  })}
                  <button
                    onClick={() => setShowPlacesModal(true)}
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm flex items-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Place
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors" 
              onClick={saveProfile}
              >
                Save Changes
              </button>
            </div>

            {/* Modals */}
            <SelectionModal
              title="Select Languages"
              show={showLanguageModal}
              onClose={() => setShowLanguageModal(false)}
            >
              <div className="grid grid-cols-2 gap-2">
                {availableLanguages
                  .filter((lang) =>
                    lang.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((language) => (
                    <button
                      key={language}
                      onClick={() => toggleLanguage(language)}
                      className={`p-2 rounded-lg text-left ${
                        formData.languages.includes(language)
                          ? "bg-blue-100 text-blue-800"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
              </div>
            </SelectionModal>

            <SelectionModal
              title="Select Interests"
              show={showInterestsModal}
              onClose={() => setShowInterestsModal(false)}
            >
              <div className="grid grid-cols-2 gap-2">
                {availableInterests
                  .filter((interest) =>
                    interest.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((interest) => (
                    <button
                      key={interest.name}
                      onClick={() => toggleInterest(interest)}
                      className={`p-2 rounded-lg text-left flex items-center ${
                        formData.interests.includes(interest.name)
                          ? "bg-blue-100 text-blue-800"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-2">{interest.icon}</span>
                      {interest.name}
                    </button>
                  ))}
              </div>
            </SelectionModal>

            <SelectionModal
              title="Select Last Visited Places"
              show={showPlacesModal}
              onClose={() => setShowPlacesModal(false)}
            >
              <div className="grid grid-cols-2 gap-2">
                {countries
                  .filter((country) =>
                    country.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((country) => (
                    <button
                      key={country.code}
                      onClick={() => togglePlace(country)}
                      className={`p-2 rounded-lg text-left flex items-center ${
                        formData.visitedPlaces.includes(country.name)
                          ? "bg-blue-100 text-blue-800"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-2">{country.flag}</span>
                      {country.name}
                    </button>
                  ))}
              </div>
            </SelectionModal>
          </CardContent>
        )}
      </EditCard>
    </div>
  );
};

export default EditProfile;
