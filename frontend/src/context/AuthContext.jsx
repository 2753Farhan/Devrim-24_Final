import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
export const Context = createContext({
  isAuthorized: false,
  user: null,
  setIsAuthorized: () => {},
  setUser: () => {},
  logout: () => {},
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
          withCredentials: true,
        });
        setUser(data.user);
        setIsAuthorized(true);
      } catch (error) {
        setUser(null);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Logout Function
  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
        withCredentials: true,
      });
      setUser(null);
      setIsAuthorized(false);
      navigate("/login"); // Navigate to login page after successful logout
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <Context.Provider value={{ isAuthorized, setIsAuthorized, user, setUser, loading, logout }}>
      {children}
    </Context.Provider>
  );
};
