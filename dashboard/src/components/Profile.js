import React, { useState, useEffect } from "react";
import {
  Wallet,
  Shield,
  Sliders,
  LogOut,
  TrendingUp,
  Camera,
  MoreVertical,
  Sun,
  Moon,
  Mail,
  X,
  Edit
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function OrbitProfile() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [fundAmount, setFundAmount] = useState("");
  const [fundType, setFundType] = useState("add"); // "add" or "withdraw"
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState({
    phone: "",
    gender: ""
  });
  const [editData, setEditData] = useState({ name: '', phone: '', gender: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
        setProfileData({
          phone: data.user.phone || "",
          gender: data.user.gender || ""
        });
        setEditData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          gender: data.user.gender || ""
        });
      } else {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      localStorage.removeItem("token");
      window.location.href = "/auth";
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("https://kitebackend.vercel.app/auth/logout", {
        method: "GET",
        credentials: "include"
      });
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
  };

  const handleProfileUpdate = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("https://kitebackend.vercel.app/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editData.name,
          phone: profileData.phone,
          gender: profileData.gender
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    toast.info("Avatar upload not available in current version");
  };

  const handleContactClick = () => {
    window.open('mailto:belalraza158@gmail.com', '_blank');
    setShowMenuModal(false);
  };

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit?')) {
      window.close();
    }
    setShowMenuModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setEditData(prev => ({ ...prev, [name]: value }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFundOperation = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = fundType === "add" ? "/auth/add-funds" : "/auth/withdraw-funds";
      
      const response = await fetch(`https://kitebackend.vercel.app${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(fundAmount) })
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(prev => ({ ...prev, balance: data.balance }));
        setShowFundModal(false);
        setFundAmount("");
        toast.success(data.message);
        // Refresh transaction history if it's open
        if (showTransactionHistory) {
          fetchTransactionHistory();
        }
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Fund operation error:", error);
      toast.error("Error processing request");
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://kitebackend.vercel.app/auth/transactions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDeleteRequest = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://kitebackend.vercel.app/auth/request-deletion-otp", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setShowDeleteModal(false);
        setShowOTPModal(true);
        toast.success("OTP sent to your email address");
      } else {
        toast.error(data.message || "Error sending OTP");
      }
    } catch (error) {
      console.error("Delete request error:", error);
      toast.error("Error processing request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccountDeletion = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://kitebackend.vercel.app/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ otp })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Account deleted successfully. Redirecting to login page...");
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/auth";
        }, 2000);
      } else {
        toast.error(data.message || "Error deleting account");
      }
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error("Error processing request");
    } finally {
      setIsProcessing(false);
    }
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
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" ? "bg-gradient-to-br from-gray-50 to-gray-100" : "bg-black text-white"
    }`}>

      {/* HERO HEADER */}
      <div className={`relative overflow-hidden ${
        theme === "light" ? "bg-white border-b border-gray-200" : "bg-gray-900 border-b border-gray-700"
      }`}>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Row 1: Avatar + Name + Menu */}
          <div className="flex items-center justify-between mb-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative group">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-lg">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=128`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className={theme === "light" ? "text-gray-900" : "text-white"}>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                  {user.name}
                </h1>
                <p className={`text-sm mt-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setShowMenuModal(true)}
              className={`p-3 rounded-lg transition-colors ${
                theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-800"
              }`}
            >
              <MoreVertical className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={20} />
            </button>
          </div>

          {/* Row 2: Balance and Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Balance */}
            <div className={`text-center sm:text-left ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              <p className="text-2xl sm:text-3xl font-bold">₹{user.balance || 0}</p>
              <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Available Balance</p>
            </div>

            {/* Role & Status */}
            <div className="text-center sm:text-right">
              <div className="flex flex-col sm:items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                  theme === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-900 text-blue-300"
                }`}>
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                  theme === "light" ? "bg-green-100 text-green-800" : "bg-green-900 text-green-300"
                }`}>
                  Verified Account
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className={`p-3 sm:p-4 rounded-lg border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <Wallet className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={18} />
            </div>
            <p className={`text-lg sm:text-xl font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>₹{user.balance || 0}</p>
            <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Available Funds</p>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <Shield className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={18} />
            </div>
            <p className={`text-lg sm:text-xl font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>₹0</p>
            <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Used Margin</p>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={18} />
              <span className="text-xs text-green-600">+2.8%</span>
            </div>
            <p className={`text-lg sm:text-xl font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>+₹1,550</p>
            <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Today's P&L</p>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}>87%</span>
            </div>
            <p className={`text-lg sm:text-xl font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>Win Rate</p>
            <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Success Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => { setFundType("add"); setShowFundModal(true); }}
            className={`p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Wallet size={20} />
            <span className="text-xs sm:text-sm">Add Funds</span>
          </button>
          
          <button
            onClick={() => { setFundType("withdraw"); setShowFundModal(true); }}
            className={`p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-gray-600 text-white hover:bg-gray-700" 
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            <TrendingUp size={20} />
            <span className="text-xs sm:text-sm">Withdraw</span>
          </button>

          <button
            onClick={() => {
              setShowTransactionHistory(true);
              fetchTransactionHistory();
            }}
            className={`p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <TrendingUp size={20} />
            <span className="text-xs sm:text-sm">History</span>
          </button>
          
          <button 
            onClick={handleLogout} 
            className={`p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <LogOut size={20} />
            <span className="text-xs sm:text-sm">Logout</span>
          </button>
        </div>

        {/* PERSONAL INFO & SETTINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className={`p-4 sm:p-6 rounded-lg border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
          }`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-3 rounded-lg ${
                  theme === "light" ? "bg-gray-100" : "bg-gray-700"
                }`}>
                  <Sliders className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={20} />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>Profile Information</h3>
                  <p className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>Manage your account details</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm ${
                    theme === "light" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                {/* Profile Photo Section */}
                <div className={`p-4 rounded-lg border ${
                  theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 group cursor-pointer">
                      <img 
                        src={previewUrl || user.avatar} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=128`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={20} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-medium text-sm mb-1 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>Profile Photo</h4>
                      <p className={`text-xs ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}>Click to change your profile picture</p>
                      <p className={`text-xs mt-1 ${
                        theme === "light" ? "text-gray-500" : "text-gray-500"
                      }`}>JPG, PNG or GIF (max. 5MB)</p>
                    </div>
                  </div>
                </div>
                
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm ${
                        theme === "light" 
                          ? "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                          : "border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      } focus:outline-none`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm ${
                          theme === "light" 
                            ? "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            : "border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        } focus:outline-none`}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>Gender</label>
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm ${
                          theme === "light" 
                            ? "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            : "border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        } focus:outline-none`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        theme === "light" 
                          ? "border-gray-200 bg-gray-50 text-gray-500" 
                          : "border-gray-600 bg-gray-600 text-gray-400"
                      }`}
                    />
                    <p className={`text-xs mt-1 ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}>Email cannot be changed</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isProcessing}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 text-sm"
                  >
                    {isProcessing ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setEditData({
                        name: user.name || "",
                        phone: user.phone || "",
                        gender: user.gender || ""
                      });
                      setProfileData({
                        phone: user.phone || "",
                        gender: user.gender || ""
                      });
                    }}
                    className={`px-4 py-2 rounded-lg border transition-colors font-medium text-sm ${
                      theme === "light" 
                        ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Display Mode */}
                <div className={`p-4 rounded-lg border ${
                  theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
                }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>Full Name</p>
                      <p className={`text-sm mt-1 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>{user.name}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>Email Address</p>
                      <p className={`text-sm mt-1 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>{user.email}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>Phone Number</p>
                      <p className={`text-sm mt-1 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>{user.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>Gender</p>
                      <p className={`text-sm mt-1 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not specified"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Account Status */}
                <div className={`p-4 rounded-lg border ${
                  theme === "light" ? "bg-green-50 border-green-200" : "bg-green-900/20 border-green-800"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === "light" ? "text-green-800" : "text-green-300"
                      }`}>Account Status: Active</p>
                      <p className={`text-xs ${
                        theme === "light" ? "text-green-600" : "text-green-400"
                      }`}>Your account is verified and active</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACCOUNT SETTINGS */}
          <div className={`p-4 sm:p-6 rounded-lg border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
          }`}>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className={`p-2 sm:p-3 rounded-lg ${
                theme === "light" ? "bg-gray-100" : "bg-gray-700"
              }`}>
                <TrendingUp className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={20} />
              </div>
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>Account Settings</h3>
                <p className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>Security and preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>Account Type</p>
                    <p className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>{user.role === 'admin' ? 'Administrator' : 'Standard User'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' 
                      ? theme === "light" ? "bg-purple-100 text-purple-800" : "bg-purple-900 text-purple-300"
                      : theme === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-900 text-blue-300"
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>Authentication</p>
                    <p className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>{user.authProvider === 'google' ? 'Google OAuth' : 'Email & Password'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    theme === "light" ? "bg-green-100 text-green-800" : "bg-green-900 text-green-300"
                  }`}>
                    Secure
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>Account Balance</p>
                    <p className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>Current available funds</p>
                  </div>
                  <span className={`text-lg font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    ₹{user.balance || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Settings */}
            <div className="mt-6 space-y-3">
              <h4 className={`text-sm font-medium ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>Quick Actions</h4>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => { setFundType("add"); setShowFundModal(true); }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={16} />
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>Add Funds</p>
                      <p className={`text-xs ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}>Deposit money to your account</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setShowTransactionHistory(true);
                    fetchTransactionHistory();
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className={theme === "light" ? "text-gray-600" : "text-gray-400"} size={16} />
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>Transaction History</p>
                      <p className={`text-xs ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}>View your transaction records</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className={`p-4 sm:p-6 rounded-xl border ${
          theme === "light" ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200" : "bg-gradient-to-r from-red-900/20 to-pink-900/20 border-red-800"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Shield className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400">⚠️ Danger Zone</h3>
              <p className={`text-xs ${
                theme === "light" ? "text-red-600" : "text-red-400"
              }`}>Irreversible actions</p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${
            theme === "light" ? "bg-white border-red-200" : "bg-gray-800 border-red-800"
          }`}>
            <h4 className={`font-semibold mb-2 text-sm ${
              theme === "light" ? "text-red-800" : "text-red-300"
            }`}>Delete Account</h4>
            <p className={`text-xs mb-3 ${
              theme === "light" ? "text-red-600" : "text-red-400"
            }`}>
              Permanently remove all data and settings.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold text-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-96 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {fundType === "add" ? "Add Funds" : "Withdraw Funds"}
            </h3>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}>Amount (₹)</label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light" 
                    ? "border-gray-300 bg-white text-gray-900" 
                    : "border-gray-600 bg-gray-700 text-white"
                }`}
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFundOperation}
                className={`px-4 py-2 rounded-lg text-white ${
                  fundType === "add" ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : (fundType === "add" ? "Add Funds" : "Withdraw")}
              </button>
              <button
                onClick={() => { setShowFundModal(false); setFundAmount(""); }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {showTransactionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>Transaction History</h3>
              <button
                onClick={() => setShowTransactionHistory(false)}
                className={`hover:text-gray-700 ${
                  theme === "light" ? "text-gray-500" : "text-gray-300 hover:text-gray-100"
                }`}
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className={`text-center py-4 ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}>No transactions found</p>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction._id} className={`border rounded-lg p-4 flex justify-between items-center ${
                    theme === "light" ? "border-gray-200" : "border-gray-600"
                  }`}>
                    <div>
                      <p className={`font-medium ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>{transaction.description}</p>
                      <p className={`text-sm ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <p className={`text-sm ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>
                        Balance: ₹{transaction.balanceAfter}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Delete Account</h3>
            <div className={`space-y-4 text-sm ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}>
              <p className="font-medium">Are you absolutely sure you want to delete your account?</p>
              <div className={`p-4 rounded-lg border ${
                theme === "light" ? "bg-red-50 border-red-200" : "bg-red-900/20 border-red-800"
              }`}>
                <p className={`font-medium mb-2 ${
                  theme === "light" ? "text-red-800" : "text-red-300"
                }`}>This action will permanently:</p>
                <ul className={`list-disc list-inside space-y-1 ${
                  theme === "light" ? "text-red-700" : "text-red-400"
                }`}>
                  <li>Delete your profile and personal information</li>
                  <li>Remove all transaction history</li>
                  <li>Clear your account balance (₹{user.balance || 0})</li>
                  <li>Disconnect all linked accounts (Google, etc.)</li>
                  <li>Cancel all active orders and positions</li>
                </ul>
              </div>
              <p className="font-medium text-red-600">
                This action cannot be undone. All your data will be permanently lost.
              </p>
              <div className={`p-4 rounded-lg border ${
                theme === "light" ? "bg-yellow-50 border-yellow-200" : "bg-yellow-900/20 border-yellow-800"
              }`}>
                <p className={theme === "light" ? "text-yellow-800" : "text-yellow-300"}>
                  <strong>Next Step:</strong> If you proceed, an OTP will be sent to your email address ({user.email}) for final verification.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? "Sending OTP..." : "Yes, Send OTP"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-96 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <h3 className="text-lg font-semibold text-red-600 mb-4">Enter OTP</h3>
            <p className={`text-sm mb-4 ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}>
              We've sent a 6-digit OTP to your email address. Please enter it below to confirm account deletion.
            </p>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}>OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-center text-lg tracking-widest ${
                  theme === "light" 
                    ? "border-gray-300 bg-white text-gray-900" 
                    : "border-gray-600 bg-gray-700 text-white"
                }`}
                placeholder="000000"
                maxLength="6"
              />
            </div>
            <p className={`text-xs mb-4 ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}>
              OTP is valid for 10 minutes only.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAccountDeletion}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={otp.length !== 6 || isProcessing}
              >
                {isProcessing ? "Deleting..." : "Delete Account"}
              </button>
              <button
                onClick={() => { setShowOTPModal(false); setOtp(""); }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-80 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button
                onClick={() => setShowMenuModal(false)}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  toggleTheme();
                  setShowMenuModal(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                }`}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
              </button>
              <button
                onClick={handleContactClick}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                }`}
              >
                <Mail size={18} />
                Contact Support
              </button>
              <button
                onClick={handleQuit}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition text-red-600 ${
                  theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/20"
                }`}
              >
                <X size={18} />
                Quit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Loader */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 font-medium">Please wait...</p>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}

/* -------- COMPONENTS -------- */

function Card({ children, className }) {
  const { theme } = useTheme();
  return (
    <div
      className={`p-6 border transition-colors ${
        theme === "light" ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title }) {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-3 mb-5">
      <Icon size={18} className={theme === "light" ? "text-blue-600" : "text-indigo-400"} />
      <h3 className={`text-sm tracking-wide ${
        theme === "light" ? "text-gray-700" : "text-gray-300"
      }`}>{title}</h3>
    </div>
  );
}

function Metric({ label, value, highlight, positive }) {
  const { theme } = useTheme();
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>{label}</span>
      <span
        className={`font-medium ${
          highlight
            ? theme === "light" ? "text-blue-600" : "text-indigo-400"
            : positive
            ? "text-green-400"
            : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Tag({ text, accent }) {
  const { theme } = useTheme();
  return (
    <div
      className={`text-xs px-3 py-2 rounded-full inline-block mr-2 mt-2 ${
        accent
          ? theme === "light" ? "bg-blue-100 text-blue-600" : "bg-indigo-500/20 text-indigo-400"
          : theme === "light" ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-300"
      }`}
    >
      {text}
    </div>
  );
}
