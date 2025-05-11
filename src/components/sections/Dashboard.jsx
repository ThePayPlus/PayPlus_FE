import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services';

export const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getProfile();
        if (response.success) {
          setUserData(response.data);
        } else {
          setError(response.message || 'Failed to load user profile');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {loading ? (
          <p className="text-gray-600">Loading user data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <h1 className="text-2xl font-bold text-indigo-600">
            Welcome back, {userData?.name || 'User'}!
          </h1>
        )}
      </div>
    </div>
  );
};