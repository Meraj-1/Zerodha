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
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('phone', profileData.phone);
      formData.append('gender', profileData.gender);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      const response = await fetch("https://kitebackend.vercel.app/auth/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
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
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('phone', user.phone || '');
      formData.append('gender', user.gender || '');

      const response = await fetch("https://kitebackend.vercel.app/auth/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success("Profile photo updated!");
      } else {
        toast.error("Failed to update photo");
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Error updating photo");
    } finally {
      setIsProcessing(false);
    }
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
      const response = await fetch("http://localhost:8000/auth/request-deletion-otp", {
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
      const response = await fetch("http://localhost:8000/auth/delete-account", {
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
        theme === "light" ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-black via-gray-900 to-black border-b border-green-500/20"
      }`}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Trading Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Row 1: Avatar + Name + Menu */}
          <div className="flex items-center justify-between mb-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-green-500 shadow-2xl shadow-green-500/20">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=128`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-green-400" size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="text-white">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <p className="text-green-100 text-xs sm:text-sm flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live Trading • Market Hours
                </p>
              </div>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setShowMenuModal(true)}
              className="p-3 sm:p-4 rounded-full bg-black/30 backdrop-blur-sm hover:bg-green-500/20 transition-all duration-200 border border-green-500/30"
            >
              <MoreVertical className="text-green-400" size={20} />
            </button>
          </div>

          {/* Row 2: Two Components */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Component 1: Balance */}
            <div className="text-center sm:text-left text-white">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400">₹{user.balance || 0}</p>
              <p className="text-green-200 text-sm sm:text-base">Available Balance</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Real-time</span>
              </div>
            </div>

            {/* Component 2: Role & Status */}
            <div className="text-center sm:text-right text-white">
              <div className="flex flex-col sm:items-end gap-2">
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-green-500/30 text-green-400 inline-block">
                  {user.role === 'admin' ? '👑 Administrator' : '📈 Professional Trader'}
                </span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-black inline-block">
                  ✅ Verified Account
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
          <div className={`p-3 sm:p-4 rounded-xl border ${
            theme === "light" ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <Wallet className={theme === "light" ? "text-green-600" : "text-green-400"} size={18} />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${
              theme === "light" ? "text-green-700" : "text-green-300"
            }`}>₹{user.balance || 0}</p>
            <p className={`text-xs ${theme === "light" ? "text-green-600" : "text-green-400"}`}>Available Funds</p>
          </div>

          <div className={`p-3 sm:p-4 rounded-xl border ${
            theme === "light" ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" : "bg-gradient-to-br from-gray-900/50 to-black border-gray-700/50"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <Shield className={theme === "light" ? "text-blue-600" : "text-gray-400"} size={18} />
            </div>
            <p className={`text-lg sm:text-xl font-bold ${
              theme === "light" ? "text-blue-700" : "text-gray-300"
            }`}>₹0</p>
            <p className={`text-xs ${theme === "light" ? "text-blue-600" : "text-gray-400"}`}>Used Margin</p>
          </div>

          <div className={`p-3 sm:p-4 rounded-xl border ${
            theme === "light" ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200" : "bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className={theme === "light" ? "text-purple-600" : "text-green-400"} size={18} />
              <span className="text-xs text-green-500">+2.8%</span>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${
              theme === "light" ? "text-purple-700" : "text-green-300"
            }`}>+₹1,550</p>
            <p className={`text-xs ${theme === "light" ? "text-purple-600" : "text-green-400"}`}>Today's P&L</p>
          </div>

          <div className={`p-3 sm:p-4 rounded-xl border ${
            theme === "light" ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200" : "bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${
                theme === "light" ? "text-orange-600" : "text-orange-400"
              }`}>87%</span>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${
              theme === "light" ? "text-orange-700" : "text-orange-300"
            }`}>Win Rate</p>
            <p className={`text-xs ${theme === "light" ? "text-orange-600" : "text-orange-400"}`}>Success Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => { setFundType("add"); setShowFundModal(true); }}
            className={`p-3 sm:p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600" 
                : "bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 border border-green-500/30"
            }`}
          >
            <Wallet size={20} />
            <span className="text-xs sm:text-sm">Add Funds</span>
          </button>
          
          <button
            onClick={() => { setFundType("withdraw"); setShowFundModal(true); }}
            className={`p-3 sm:p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600" 
                : "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 border border-gray-600"
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
            className={`p-3 sm:p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 border border-blue-500/30"
            }`}
          >
            <TrendingUp size={20} />
            <span className="text-xs sm:text-sm">History</span>
          </button>
          
          <button 
            onClick={handleLogout} 
            className={`p-3 sm:p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
              theme === "light" 
                ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800" 
                : "bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-400 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30"
            }`}
          >
            <LogOut size={20} />
            <span className="text-xs sm:text-sm">Logout</span>
          </button>
        </div>

        {/* PERSONAL INFO & SETTINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className={`p-4 sm:p-6 rounded-xl border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-black border-green-500/20"
          }`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-3 rounded-lg ${
                  theme === "light" ? "bg-indigo-100" : "bg-green-500/10 border border-green-500/30"
                }`}>
                  <Sliders className={theme === "light" ? "text-indigo-600" : "text-green-400"} size={20} />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>Account Details</h3>
                  <p className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-500" : "text-green-400"}`}>Manage information</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm ${
                    theme === "light" 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700" 
                      : "bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 border border-green-500/30"
                  }`}
                >
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-lg ${
                  theme === "light" ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "bg-gradient-to-r from-blue-900/20 to-indigo-900/20"
                }`}>
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg group">
                    <img 
                      src={previewUrl || user.avatar} 
                      alt="Profile"
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
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>Profile Photo</h4>
                    <p className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>Click to update</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        theme === "light" 
                          ? "border-gray-200 bg-white text-gray-900 focus:border-blue-500" 
                          : "border-gray-600 bg-gray-700 text-white focus:border-blue-400"
                      } focus:outline-none`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        theme === "light" 
                          ? "border-gray-200 bg-white text-gray-900 focus:border-blue-500" 
                          : "border-gray-600 bg-gray-700 text-white focus:border-blue-400"
                      } focus:outline-none`}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      theme === "light" 
                        ? "border-gray-200 bg-white text-gray-900 focus:border-blue-500" 
                        : "border-gray-600 bg-gray-700 text-white focus:border-blue-400"
                    } focus:outline-none`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isProcessing}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold disabled:opacity-50 text-sm"
                  >
                    {isProcessing ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 font-semibold text-sm ${
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
                <div className={`p-4 rounded-lg border ${
                  theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700/50 border-gray-600"
                }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs font-medium ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>Phone Number</p>
                      <p className={`text-sm font-semibold mt-1 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>{user.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>Gender</p>
                      <p className={`text-sm font-semibold mt-1 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>{user.gender || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className={`text-xs font-medium ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}>Email Address</p>
                    <p className={`text-sm font-semibold mt-1 ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TRADING STATS */}
          <div className={`p-4 sm:p-6 rounded-xl border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-black border-green-500/20"
          }`}>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className={`p-2 sm:p-3 rounded-lg ${
                theme === "light" ? "bg-green-100" : "bg-green-500/10 border border-green-500/30"
              }`}>
                <TrendingUp className={theme === "light" ? "text-green-600" : "text-green-400"} size={20} />
              </div>
              <div>
                <h3 className={`text-lg sm:text-xl font-bold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>Trading Performance</h3>
                <p className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-500" : "text-green-400"}`}>Market metrics</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className={`p-3 sm:p-4 rounded-lg border ${
                theme === "light" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30"
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${theme === "light" ? "text-green-700" : "text-green-300"}`}>Risk Level</span>
                  <span className={`font-bold text-sm ${theme === "light" ? "text-green-800" : "text-green-200"}`}>Conservative</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full w-3/5"></div>
                </div>
              </div>
              
              <div className={`p-3 sm:p-4 rounded-lg border ${
                theme === "light" ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" : "bg-gradient-to-r from-gray-900/50 to-black border-gray-700/50"
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${theme === "light" ? "text-blue-700" : "text-gray-300"}`}>Max Drawdown</span>
                  <span className={`font-bold text-sm ${theme === "light" ? "text-blue-800" : "text-gray-200"}`}>-2.1%</span>
                </div>
              </div>
              
              <div className={`p-3 sm:p-4 rounded-lg border ${
                theme === "light" ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200" : "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/20"
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${theme === "light" ? "text-purple-700" : "text-green-400"}`}>Win Rate</span>
                  <span className={`font-bold text-sm ${theme === "light" ? "text-purple-800" : "text-green-200"}`}>87%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                theme === "light" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-green-500/10 text-green-300 border-green-500/30"
              }`}>🚀 Scalping</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                theme === "light" ? "bg-green-100 text-green-700 border-green-200" : "bg-green-500/10 text-green-300 border-green-500/30"
              }`}>🎯 Risk Manager</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                theme === "light" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-green-500/10 text-green-300 border-green-500/30"
              }`}>⚡ Day Trader</span>
            </div>

            {/* Market Status */}
            <div className={`mt-4 p-3 rounded-lg border ${
              theme === "light" ? "bg-gray-50 border-gray-200" : "bg-green-500/5 border-green-500/20"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-green-400"}`}>Market Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-500 font-semibold text-sm">OPEN</span>
                </div>
              </div>
              <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-green-300"}`}>NSE: 09:15 - 15:30 IST</p>
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
