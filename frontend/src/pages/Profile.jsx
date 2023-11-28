import React from "react";
import { HiUserCircle } from "react-icons/hi";

export const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <HiUserCircle className="text-9xl" />
      <h1 className="text-4xl">Profile</h1>
    </div>
  );
};
