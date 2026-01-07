import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../contexts/themeConfig';

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";

import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";
import Profile from "./Profile";

const Dashboard = () => {
  const { theme } = useTheme();
  const t = themes[theme];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <div className={`dashboard-container ${t.bg}`}>
      <GeneralContextProvider>
        <WatchList />
      </GeneralContextProvider>
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
    
      </div>
    </div>
  );
};

export default Dashboard;