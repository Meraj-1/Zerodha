import React, { useState, useEffect } from "react";
import { LogOut, Wallet, TrendingUp } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL (from Google OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      const response = await fetch("https://kitebackend.vercel.app/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Set dummy user data for demo
      setUser({
        name: "Demo User",
        email: "demo@example.com",
        balance: 50000,
        avatar: "https://ui-avatars.com/api/?name=Demo+User&background=random&color=fff&size=128"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Unable to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=128`;
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-xl font-semibold text-green-600">₹{user.balance || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Wallet className="mx-auto mb-2 text-blue-600" size={32} />
          <h3 className="font-semibold">Available Balance</h3>
          <p className="text-2xl font-bold text-blue-600">₹{user.balance || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <TrendingUp className="mx-auto mb-2 text-green-600" size={32} />
          <h3 className="font-semibold">Total P&L</h3>
          <p className="text-2xl font-bold text-green-600">+₹2,450</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-8 h-8 bg-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-bold">87%</span>
          </div>
          <h3 className="font-semibold">Success Rate</h3>
          <p className="text-2xl font-bold text-purple-600">87%</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900">{user.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <p className="text-gray-900">{user.role === 'admin' ? 'Administrator' : 'User'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Account Actions</h2>
        <div className="flex gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default Profile;