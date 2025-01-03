import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [errors, setErrors] = useState({});

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password, role },
        { withCredentials: true }
      );
      toast.success(data.message || "Logged in successfully");
      setUser(data.user);
      setIsAuthorized(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || "Login failed");
      setErrors({
        email: "Invalid Email Or Password",
        password: "Invalid Email Or Password"
      });
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      
      <div className="mb-4">
        <input
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
          className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <select
        name="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
      </select>

      <button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors"
      >
        Login
      </button>
    </form>
  );
};

export default Login;