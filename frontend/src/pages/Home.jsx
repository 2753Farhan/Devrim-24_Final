import React, { useContext, useState } from "react";
import { Context } from "../context/AuthContext.jsx";
import { GraduationCap, BookOpen, User, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Bengali letters for animation
const bengaliLetters = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ'];

// Floating Letter Component
const FloatingLetter = ({ letter }) => {
  const randomDelay = Math.random() * 10;
  const randomDuration = 15 + Math.random() * 20;
  const startPosition = Math.random() * 100;

  return (
    <div
      className="absolute text-4xl text-blue-200/10 pointer-events-none select-none"
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

const Home = () => {
  const { user } = useContext(Context);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (action) => {
    switch (action) {
      case 'List of Stories':
        navigate('/teacher-dashboard');
        break;
      case 'Post Story':
        navigate('/teacher-dashboard');
        break;
      case 'Analytic Graph':
        navigate('/teacher-dashboard');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 relative overflow-hidden">
      {/* Animated Background */}
      {bengaliLetters.map((letter, index) => (
        <FloatingLetter key={index} letter={letter} />
      ))}

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              
              {/* Search Bar */}
              <div className="relative">
                <div className={`
                  transition-all duration-300 ease-in-out
                  ${isSearchFocused ? 'w-96' : 'w-64'}
                `}>
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Welcome back, {user?.name || "Guest"}
                </h1>
                <p className="text-gray-600">
                  {user?.role} Account
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {['List of Stories', 'Post Story', 'Analytic Graph'].map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(action)}
                  className="p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <p className="font-medium text-gray-700">{action}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {index === 0
                      ? 'Previously Uploaded Story'
                      : index === 1
                      ? 'Write Story'
                      : 'Story Uploading History'}
                  </p>
                </button>
              ))}
            </div>
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

export default Home;