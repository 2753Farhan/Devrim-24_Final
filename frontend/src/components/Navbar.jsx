import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { isAuthorized, logout, user } = useContext(Context);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold">
          LinguaMagic
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {isAuthorized ? (
            <>
              <span className="text-sm font-light">
                Logged in as <strong>{user?.role}</strong>
              </span>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
