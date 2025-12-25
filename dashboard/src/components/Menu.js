import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import { Edit, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Menu = () => {
  const { theme } = useTheme();
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '', gender: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setEditData({ 
      name: user?.name || '', 
      phone: user?.phone || '', 
      gender: user?.gender || '' 
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
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

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('phone', editData.phone);
      formData.append('gender', editData.gender);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      const response = await fetch("http://localhost:8000/auth/profile", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setShowEditModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setIsProcessing(false);
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className={`menu-container transition-colors ${
      theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
    }`}>
      <img src="logo.png" style={{ width: "50px" }} alt="Logo" />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={`${selectedMenu === 0 ? activeMenuClass : menuClass} ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={`${selectedMenu === 1 ? activeMenuClass : menuClass} ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={`${selectedMenu === 2 ? activeMenuClass : menuClass} ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={`${selectedMenu === 3 ? activeMenuClass : menuClass} ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={`${selectedMenu === 4 ? activeMenuClass : menuClass} ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={`${selectedMenu === 6 ? activeMenuClass : menuClass} ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}>
                Apps
              </p>
            </Link>
          </li>
          {!isAuthenticated && (
            <li>
              <Link
                style={{ textDecoration: "none" }}
                to="/auth"
                onClick={() => handleMenuClick(7)}
              >
                <p className={`${selectedMenu === 7 ? activeMenuClass : menuClass} ${
                  theme === "light" ? "text-gray-700" : "text-gray-200"
                }`}>
                  Login
                </p>
              </Link>
            </li>
          )}
        </ul>
        <hr className={theme === "light" ? "border-gray-300" : "border-gray-600"} />
        <div className={`profile cursor-pointer transition-colors ${
          theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
        }`} onClick={handleProfileClick}>
          {user ? (
            <>
              <img 
                src={user.avatar} 
                alt={user.name}
                className="avatar"
                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=128`;
                }}
              />
              <p className={`username ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}>{user.name}</p>
              <Edit size={14} className={`ml-2 ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`} />
            </>
          ) : (
            <>
              <div className="avatar">ZU</div>
              <p className="username">USERID</p>
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-8 rounded-2xl w-[500px] max-h-[80vh] overflow-y-auto ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>Edit Profile</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className={`p-2 rounded-full transition ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                }`}
              >
                <X size={20} className={theme === "light" ? "text-gray-600" : "text-gray-300"} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden group">
                  <img 
                    src={previewUrl || user?.avatar} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&color=fff&size=128`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>Profile Photo</h3>
                  <p className={`text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}>Click to change your profile picture</p>
                  <p className={`text-xs mt-1 ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}>JPG, PNG up to 5MB</p>
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
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      theme === "light" 
                        ? "border-gray-300 bg-white text-gray-900 focus:border-blue-500" 
                        : "border-gray-600 bg-gray-700 text-white focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      theme === "light" 
                        ? "border-gray-300 bg-white text-gray-900 focus:border-blue-500" 
                        : "border-gray-600 bg-gray-700 text-white focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>Gender</label>
                  <select
                    name="gender"
                    value={editData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition ${
                      theme === "light" 
                        ? "border-gray-300 bg-white text-gray-900 focus:border-blue-500" 
                        : "border-gray-600 bg-gray-700 text-white focus:border-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                  {isProcessing ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className={`px-6 py-3 rounded-lg border transition font-medium ${
                    theme === "light" 
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
