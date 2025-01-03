import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");

  const { isAuthorized,setIsAuthorized, setUser } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password, role },
        { withCredentials: true }
      );
      toast.success(data.message);
      setUser(data.user);
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };
   // Redirect to home page if the user is already authorized
   if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <input
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="w-full p-2 border rounded mb-4"
      />
      <select
        name="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
      </select>
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
};

export default Login;
