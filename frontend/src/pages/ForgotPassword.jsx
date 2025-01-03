import React, { useContext } from "react";
import { Context } from "../context/AuthContext.jsx";

const Home = () => {
  const { user } = useContext(Context);

  return (
    <div className="container mx-auto text-center py-10">
      <h1 className="text-3xl font-bold">Welcome to RecruitEase</h1>
      <p className="mt-4 text-gray-600">
        Hello, <span className="font-bold">{user?.name || "Guest"}</span>!
      </p>
      <p className="mt-2 text-gray-500">
        You are logged in as a <span className="font-semibold">{user?.role}</span>.
      </p>
    </div>
  );
};

export default Home;
