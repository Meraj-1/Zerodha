import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { motion } from "framer-motion";
import { FaBolt, FaLock, FaChartLine, FaUsers, FaEllipsisV, FaMoon, FaSun } from "react-icons/fa";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState("signup"); // login/signup
  const [theme, setTheme] = useState("light"); // light/dark
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    setMenuOpen(false);
  };

  const handleMenuClick = (option) => {
    setMenuOpen(false);
    if (option === "exit") {
      alert("Exiting application...");
    } else if (option === "contact") {
      window.location.href = "mailto:support@kitexpro.com";
    }
  };

  // Theme-based classes
  const bgClass =
    theme === "light"
      ? "bg-gradient-to-br from-gray-50 to-gray-100"
      : "bg-gradient-to-br from-gray-900 to-gray-800 text-white";
  const panelBg =
    theme === "light"
      ? "from-blue-50 to-white"
      : "from-gray-900 to-gray-800 text-white";

  return (
    <div className={`min-h-screen flex relative overflow-hidden ${bgClass}`}>
      {/* TOP-RIGHT 3-DOT MENU */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <FaEllipsisV className={theme === "light" ? "text-gray-600" : "text-gray-200"} />
          </button>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border overflow-hidden ${
                theme === "light" ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"
              }`}
            >
              <MenuItem
                text={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                icon={theme === "light" ? <FaMoon /> : <FaSun />}
                onClick={toggleTheme}
              />
              <MenuItem text="Exit Application" onClick={() => handleMenuClick("exit")} />
              <MenuItem text="Contact" onClick={() => handleMenuClick("contact")} />
            </motion.div>
          )}
        </div>
      </div>

      {/* LEFT SIDE PANEL */}
      <div className={`hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br ${panelBg}`}>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse" />

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md px-10 py-12"
        >
          <h1 className={`text-5xl font-extrabold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Kite <span className="text-blue-600">X Pro</span>
          </h1>
          <p className={`mt-4 text-base leading-relaxed ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
            Smart trading & automated payments platform built for speed, security and professional traders.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4">
            <Feature icon={<FaBolt className="text-blue-500" />} text="⚡ Lightning fast transactions" theme={theme} />
            <Feature icon={<FaLock className="text-green-500" />} text="🔐 Bank-grade security" theme={theme} />
            <Feature icon={<FaChartLine className="text-purple-500" />} text="📊 Real-time analytics" theme={theme} />
            <Feature icon={<FaUsers className="text-yellow-500" />} text="🤝 Trusted by traders & admins" theme={theme} />
          </div>

          <p className={`mt-10 text-xs ${theme === "light" ? "text-gray-400" : "text-gray-400"}`}>
            © 2025 Kite X Pro. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE AUTH FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4">
        <motion.div
          key={authMode + theme}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {authMode === "signup" ? (
            <SignUp theme={theme} onSwitch={() => setAuthMode("login")} />
          ) : (
            <Login theme={theme} onSwitch={() => setAuthMode("signup")} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, text, theme }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm cursor-pointer transition ${
        theme === "light"
          ? "bg-white/30 backdrop-blur-md border-gray-200"
          : "bg-gray-800/40 border-gray-700 text-white"
      }`}
    >
      <div className="text-xl">{icon}</div>
      <span className={`font-medium text-sm ${theme === "light" ? "text-gray-800" : "text-white"}`}>{text}</span>
    </motion.div>
  );
}

function MenuItem({ text, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-200"
    >
      {icon} {text}
    </button>
  );
}
