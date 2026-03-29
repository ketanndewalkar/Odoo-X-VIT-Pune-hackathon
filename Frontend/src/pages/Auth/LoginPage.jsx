import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/store";
import { useMutation } from "@tanstack/react-query";
import { Toaster } from "../../utils/Toaster";
import { errorHandler } from "../../utils/errorHandler";
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => loginUser(formData, setAuth, navigate),
    onSuccess: (res) => { Toaster({ title: res.data.message, status: "success" }) },
    onError: (err) => errorHandler(err)

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mutate) {
      mutate(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="text-2xl font-semibold tracking-wide text-gray-700">
            odoo
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-100 text-blue-900 text-sm rounded-lg p-3 mb-4 text-center">
          Access and manage your documents and databases from odoo.com.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-700">Password</label>
              <span className="text-xs text-[#714B67] cursor-pointer">
                Reset Password
              </span>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#714B67] hover:bg-[#714B67]/90 text-white font-medium py-2 rounded-md transition flex items-center justify-center"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>

        {/* Footer */}
        <Link to="/signup" className="text-center block text-sm text-gray-500 mt-4">
          Don't have an account?
        </Link>
      </div>
    </div>
  );
}
