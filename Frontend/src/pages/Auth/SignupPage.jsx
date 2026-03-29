import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { countries } from "../../utils/cosntants";
import { errorHandler } from "../../utils/errorHandler";
import { Toaster } from "../../utils/Toaster";
import { useMutation } from "@tanstack/react-query";



export default function SignUpPage() {
  const [formData, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: ""
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => signUpUser(formData, navigate),
    onSuccess: (res) => {
      Toaster({ title: res.data.message, status: "success" });
    },
    onError: (err) => errorHandler(err),
  });

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

        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              required
            />
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              required
            >
              <option value="" disabled>
                Select your country
              </option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="flex">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 border border-gray-300 border-l-0 rounded-r-md"
              >
                👁
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              required
            />
          </div>

          {/* Button */}
          <button
            type="button"
            disabled={isPending}
            className="w-full bg-[#714B67] hover:bg-[#714B67]/90 text-white font-medium py-2 rounded-md transition flex items-center justify-center"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "SIGN UP"
            )}
          </button>
        </form>

        {/* Footer */}
        <Link to="/login" className="text-center block text-sm text-gray-500 mt-4 w-full">
          I already have an account
        </Link>

        <p className="text-xs text-gray-400 mt-2 text-center">
          Your personal data will be handled as outlined in our Privacy Policy.
        </p>
      </div>
    </div>
  );
}
