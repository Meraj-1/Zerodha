import React, { useEffect } from "react";
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../contexts/themeConfig';

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const { theme } = useTheme();
  const t = themes[theme];
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${t.bg}`}>
      <TopBar />
      <Dashboard />
    </div>
  );
};

export default Home;