import React, { useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
// import ThemeToggle from './ThemeToggle';

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${
      theme === "light" ? "bg-white" : "bg-black"
    }`}>
      {/* <ThemeToggle /> */}
      <TopBar />
      <Dashboard />
    </div>
  );
};

export default Home;
