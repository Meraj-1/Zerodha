import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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
      const response = await fetch("https://kitebackend.vercel.app/auth/me", {
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

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container transition-colors bg-white text-black">
      <img src="logo.png" style={{ width: "50px" }} alt="Logo" />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={`${selectedMenu === 0 ? activeMenuClass : menuClass} text-gray-700`}>
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
              <p className={`${selectedMenu === 1 ? activeMenuClass : menuClass} text-gray-700`}>
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
              <p className={`${selectedMenu === 2 ? activeMenuClass : menuClass} text-gray-700`}>
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
              <p className={`${selectedMenu === 3 ? activeMenuClass : menuClass} text-gray-700`}>
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
              <p className={`${selectedMenu === 4 ? activeMenuClass : menuClass} text-gray-700`}>
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
              <p className={`${selectedMenu === 6 ? activeMenuClass : menuClass} text-gray-700`}>
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
                <p className={`${selectedMenu === 7 ? activeMenuClass : menuClass} text-gray-700`}>
                  Login
                </p>
              </Link>
            </li>
          )}
        </ul>
        <hr className="border-gray-300" />
        <Link 
          to="/profile"
          style={{ textDecoration: "none" }}
          className="profile cursor-pointer transition-colors hover:bg-gray-100"
        >
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
              <p className="username text-gray-700">{user.name}</p>
            </>
          ) : (
            <>
              <div className="avatar">ZU</div>
              <p className="username">USERID</p>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Menu;
