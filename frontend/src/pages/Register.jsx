import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { Context } from "../context/AuthContext.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Student"
  });
  const [errors, setErrors] = useState({});
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 11 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        formData,
        { withCredentials: true }
      );
      toast.success(data.message || "Registered successfully!");
      setUser(data.user);
      setIsAuthorized(true);
    } catch (error) {
      // Log the full error object for debugging
      console.log('Full error object:', error);
      
      // Get error message from different possible locations in the error object
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      console.log('Processed error message:', errorMessage);

      // Check for the email already registered error
      if (errorMessage === "Email already registered!") {
        setErrors({
          ...errors,
          email: "Email already registered!"
        });
        toast.error("Email already registered!");
      } else if (errorMessage.includes("Please fill full form")) {
        setErrors({
          name: "Name is required",
          email: "Email is required",
          phone: "Phone is required",
          password: "Password is required"
        });
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage || "Registration failed");
      }
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

      <div className="mb-4">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <input
          name="phone"
          placeholder="Phone (11 digits)"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
      </select>

      <button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
      >
        Register
      </button>
    </form>
  );
};

export default Register;