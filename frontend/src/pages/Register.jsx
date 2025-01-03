import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { Context } from "../context/AuthContext.jsx";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", role: "Student" });
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        formData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setUser(data.user);
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      <select
        name="role"
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Register
      </button>
    </form>
  );
};

export default Register;
