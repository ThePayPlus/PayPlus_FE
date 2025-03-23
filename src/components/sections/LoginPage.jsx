import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div className="bg-gray-50 font-sans min-h-screen flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-100">
        <Link to="/" >
          <img id="logo" className='w-50 h-auto' src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" />
        </Link>
        <h3 className="text-2xl font-bold text-indigo-600 text-center mb-6">Welcome Back!</h3>

        <form className="space-y-4 w-full">
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
              <button type="button" id="toggle-password" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600">
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>
          <Link to="/dashboard"><button type="submit" className="w-full bg-indigo-500 text-white py-2 px-6 rounded-lg shadow hover:bg-indigo-600 transition duration-300">Login</button> </Link>

        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign Up</Link></p>
      </div>
    </div>
  );
};