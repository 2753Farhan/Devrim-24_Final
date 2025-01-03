import React, { useContext } from "react";
import { Context } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user } = useContext(Context);

  return (
    <div className="max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
      <p className="text-lg">
        <span className="font-bold">Name:</span> {user?.name}
      </p>
      <p className="text-lg">
        <span className="font-bold">Email:</span> {user?.email}
      </p>
      <p className="text-lg">
        <span className="font-bold">Role:</span> {user?.role}
      </p>
    </div>
  );
};

export default Profile;
