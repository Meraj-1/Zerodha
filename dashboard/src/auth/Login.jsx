import { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

export default function Login({ onSwitch, theme = "light" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  // Theme classes
  const bgClass = theme === "light" ? "bg-white/80" : "bg-gray-900/80";
  const textClass = theme === "light" ? "text-gray-900" : "text-white";
  const inputClass =
    theme === "light"
      ? "border-gray-200 placeholder-gray-400 text-gray-900 bg-white"
      : "border-gray-700 placeholder-gray-400 text-white bg-gray-800";
  const dividerText = theme === "light" ? "text-gray-400" : "text-gray-300";
  const smallText = theme === "light" ? "text-gray-500" : "text-gray-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${bgClass} backdrop-blur-lg w-[420px] p-8 rounded-2xl shadow-xl border ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}
    >
      {/* Logo */}
      <h2 className={`text-2xl font-bold text-center ${textClass}`}>
        Welcome back to <span className="text-blue-600">Kite X Pro</span>
      </h2>
      <p className={`text-center text-sm mt-2 ${smallText}`}>
        Login to continue trading and managing payments
      </p>

      {/* Email */}
      <div className="mt-6">
        <label className={`text-xs ${smallText}`}>EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition ${inputClass}`}
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div className="mt-4">
        <label className={`text-xs ${smallText}`}>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition ${inputClass}`}
          placeholder="Enter your password"
        />
      </div>

      {/* Login Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full mt-6 py-3 rounded-md bg-blue-600 text-white text-sm font-semibold"
      >
        LOG IN
      </motion.button>

      {/* Divider */}
      <div className={`text-center text-xs my-4 ${dividerText}`}>
        OR CONTINUE WITH
      </div>

      {/* Google Login */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        onClick={handleGoogleLogin}
        className={`w-full flex items-center justify-center gap-3 border py-2 rounded-md text-sm ${theme === "light" ? "border-gray-300 text-gray-700" : "border-gray-600 text-white"}`}
      >
        <FaGoogle /> Continue with Google
      </motion.button>

      {/* Switch to Signup */}
      <p className={`text-center text-sm mt-5 ${smallText}`}>
        Don’t have an account?
        <button onClick={onSwitch} className="ml-1 text-blue-500 font-medium">
          Create account
        </button>
      </p>
    </motion.div>
  );
}
