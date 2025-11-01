import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);
  
  console.log("Profile component - User data:", user);
  
  if (!user.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading user profile...</div>
      </div>
    );
  }

  // Check if user has required fields
  if (!user.user.firstName || !user.user.lastName) {
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
