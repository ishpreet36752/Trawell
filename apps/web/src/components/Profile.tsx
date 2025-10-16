import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import type { RootState } from "../utils/appStore";
import type { User } from "../types/user";

const Profile = () => {
  const user = useSelector<RootState , User | null>((store:RootState) => store.user);
  
  console.log("Profile component - User data:", user);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading user profile...</div>
      </div>
    );
  }

  // Check if user has required fields
  if (!user.firstName || !user.lastName) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">
          User data incomplete. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <EditProfile user={user} />
      </div>
    </>
  );
};

export default Profile;
