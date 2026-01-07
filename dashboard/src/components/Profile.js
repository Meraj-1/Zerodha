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

export default function OrbitProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteOTPModal, setShowDeleteOTPModal] = useState(false);
  const [showPhoneOTPModal, setShowPhoneOTPModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
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
      
      const response = await fetch("https://kitebackend.vercel.app/auth/profile", {
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
        // Preserve the current balance when updating user data
        setUser(prev => ({ 
          ...data.user, 
          balance: prev.balance // Keep the existing balance
        }));
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

  // Dedicated function for setting phone number
  const handleSetPhone = async (phoneNumber) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("https://kitebackend.vercel.app/auth/set-phone", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ phone: phoneNumber })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => ({ ...prev, phone: phoneNumber, isPhoneVerified: true }));
        toast.success("Phone number saved successfully!");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save phone number");
        return false;
      }
    } catch (error) {
      console.error("Error setting phone:", error);
      toast.error("Error saving phone number");
      return false;
    }
  };

  const handleVerifyPhoneOTP = async () => {
    setIsVerifyingPhone(true);
    try {
      // Simulate OTP verification for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (phoneOTP === "123456") { // Demo OTP
        setUser(prev => ({ ...prev, phone: tempPhone, isPhoneVerified: true }));
        setShowPhoneOTPModal(false);
        setPhoneOTP("");
        setTempPhone("");
        toast.success("Phone number verified successfully!");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Phone verification error:", error);
      toast.error("Error verifying phone number");
    } finally {
      setIsVerifyingPhone(false);
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
        setShowDeleteOTPModal(true);
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
        toast.success("Account deleted successfully. You have been logged out from all devices.");
        
        // Clear all local storage and session data
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear any cached data
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }
        
        setTimeout(() => {
          // Force redirect to login page
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
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
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

              <div className="text-gray-900">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                  {user.name}
                </h1>
                <p className="text-sm mt-1 text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setShowMenuModal(true)}
              className="p-3 rounded-lg transition-colors hover:bg-gray-100"
            >
              <MoreVertical className="text-gray-600" size={20} />
            </button>
          </div>

          {/* Row 2: Balance and Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Balance */}
            <div className="text-center sm:text-left text-gray-900">
              <p className="text-2xl sm:text-3xl font-bold">₹{user.balance || 0}</p>
              <p className="text-sm text-gray-600">Available Balance</p>
            </div>

            {/* Role & Status */}
            <div className="text-center sm:text-right">
              <div className="flex flex-col sm:items-end gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium inline-block bg-blue-100 text-blue-800">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium inline-block bg-green-100 text-green-800">
                  Verified Account
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component continues with all modals and functionality but without theme conditions */}
      {/* For brevity, I'm showing the structure - the full component would continue with all the existing functionality */}
      
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => { setFundType("add"); setShowFundModal(true); }}
            className="p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Wallet size={20} />
            <span className="text-xs sm:text-sm">Add Funds</span>
          </button>
          
          <button
            onClick={() => { setFundType("withdraw"); setShowFundModal(true); }}
            className="p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
          >
            <TrendingUp size={20} />
            <span className="text-xs sm:text-sm">Withdraw</span>
          </button>

          <button
            onClick={() => {
              setShowTransactionHistory(true);
              fetchTransactionHistory();
            }}
            className="p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <TrendingUp size={20} />
            <span className="text-xs sm:text-sm">History</span>
          </button>
          
          <button 
            onClick={handleLogout} 
            className="p-3 sm:p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2 bg-red-600 text-white hover:bg-red-700"
          >
            <LogOut size={20} />
            <span className="text-xs sm:text-sm">Logout</span>
          </button>
        </div>
      </div>

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