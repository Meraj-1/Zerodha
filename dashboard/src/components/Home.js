import React, { useEffect } from "react";
// import ThemeToggle from './ThemeToggle';

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <div className="min-h-screen transition-colors bg-white">
      {/* <ThemeToggle /> */}
      <TopBar />
      <Dashboard />
    </div>
  );
};

export default Home;
