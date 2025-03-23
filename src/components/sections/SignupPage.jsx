import React from "react";
import { Link } from "react-router-dom";

export const SignupPage = () => {
  return (
    <div className="bg-gray-50 font-sans min-h-screen flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-100">
        {/* Logo */}
        <Link to="/">
          <img id="logo" className='mx-auto h-10 w-auto' src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" />
        </Link>
        <h3 className="text-2xl font-bold text-indigo-600 text-center mb-6">Create an Account</h3>

        {/* Registration Form */}
        <form className="space-y-4 w-full">
          {/* Name Input Field */}
          <div>
            <label htmlFor="name" className="block text-sm text-left font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Phone Number Input Field */}
          <div>
            <label htmlFor="phone" className="block text-sm text-left font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Email Input Field */}
          <div>
            <label htmlFor="email" className="block text-sm text-left font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-left text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Confirm Password Input Field */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-left text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Register Button */}
          <Link to="/dashboard">
            <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-6 rounded-lg shadow hover:bg-indigo-600 transition duration-300">
              Register
            </button>
          </Link>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}