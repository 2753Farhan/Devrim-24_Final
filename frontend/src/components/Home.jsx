import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to AI Chat</h1>
      <div className="space-x-4">
        <Link
          to="/text-chat"
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
        >
          Text Chat
        </Link>
        <Link
          to="/voice-chat"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Voice Chat
        </Link>
      </div>
    </div>
  );
};

export default Home;
