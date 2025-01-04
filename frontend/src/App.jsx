import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Context } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import './App.css'
import StudentDashboard from "./pages/studentDashboard.jsx";
const App = () => {
  const { isAuthorized } = useContext(Context);

  return (
    <Router>
      {/* Wrapper to enforce sticky footer behavior */}
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={isAuthorized ? <Home /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
            {isAuthorized && <Route path="/profile" element={<Profile />} />}
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
