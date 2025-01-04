import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { KeyRound, Lock } from "lucide-react";

const BanglaLetter = ({ children, delay }) => (
  <span 
    className="inline-block animate-float opacity-20 absolute text-4xl text-blue-600 font-bengali"
    style={{
      animation: `float 20s infinite linear`,
      animationDelay: `${delay}s`,
      transform: `translateY(${Math.random() * 100}px)`,
      left: `${Math.random() * 100}vw`
    }}
  >
    {children}
  </span>
);

const ResetPassword = () => {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  
  const banglaLetters = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password/${id}/${token}`,
        { password }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated Bangla Letters */}
      {banglaLetters.map((letter, index) => (
        <BanglaLetter key={index} delay={index * 2}>
          {letter}
        </BanglaLetter>
      ))}

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 transition-transform duration-300 hover:scale-105">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">পাসওয়ার্ড রিসেট</h2>
            <p className="text-gray-600 mt-2">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 transition-colors group-hover:text-blue-500" />
              <input
                name="password"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 group-hover:border-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-5 h-5" />
              <span>Reset Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;