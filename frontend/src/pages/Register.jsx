import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { Context } from "../context/AuthContext.jsx";
import { User, Lock, Mail, Phone, BookOpen } from "lucide-react";

// Bengali letters for animation (same as login page)
const bengaliLetters = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ'];

// Floating Letter Component
const FloatingLetter = ({ letter }) => {
  const randomDelay = Math.random() * 10;
  const randomDuration = 15 + Math.random() * 20;
  const startPosition = Math.random() * 100;

  return (
    <div
      className="absolute text-4xl text-blue-500/30 pointer-events-none select-none"
      style={{
        left: `${startPosition}vw`,
        animation: `floating ${randomDuration}s linear ${randomDelay}s infinite`,
        top: '-50px',
      }}
    >
      {letter}
    </div>
  );
};

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
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 relative overflow-hidden">
      {/* Animated Background */}
      {bengaliLetters.map((letter, index) => (
        <FloatingLetter key={index} letter={letter} />
      ))}

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Register Card */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg relative z-10">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Create Account
                </h1>
                <p className="text-gray-600">
                  Join our learning platform
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                      ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                      ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="phone"
                    placeholder="Phone (11 digits)"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                      ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                      ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes floating {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;