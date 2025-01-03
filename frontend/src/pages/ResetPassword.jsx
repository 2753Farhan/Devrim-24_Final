import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");

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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
      <input
        name="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="w-full p-2 border rounded mb-4"
      />
      <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
