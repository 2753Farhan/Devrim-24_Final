import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../context/AuthContext.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import { User, Lock, Mail, BookOpen } from "lucide-react";

// Bengali letters for animation
const bengaliLetters = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ'];

// Floating Letter Component with deeper color
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

// Rest of the component remains the same
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [errors, setErrors] = useState({});

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const navigate = useNavigate();

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

      if (data.user.role === "Teacher") {
        navigate("/teacher-dashboard");
      } else if (data.user.role === "Student") {
        navigate("/student-dashboard");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 relative overflow-hidden">
      {/* Animated Background */}
      {bengaliLetters.map((letter, index) => (
        <FloatingLetter key={index} letter={letter} />
      ))}

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg relative z-10">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to your account
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                      ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
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
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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
                <span>Sign In</span>
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

export default Login;