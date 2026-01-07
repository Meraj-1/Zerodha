import { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useTheme } from "../contexts/ThemeContext";
import { themes } from "../contexts/themeConfig";

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();
  const t = themes[theme];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://kitebackend.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://kitebackend.vercel.app/auth/google";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${t.bg} backdrop-blur-lg w-[420px] p-8 rounded-2xl shadow-xl border ${t.border}`}
    >
      {/* Logo */}
      <h2 className={`text-2xl font-bold text-center ${t.text}`}>
        Welcome back to <span className="text-blue-600">Kite X Pro</span>
      </h2>
      <p className={`text-center text-sm mt-2 ${t.textSecondary}`}>
        Login to continue trading and managing payments
      </p>

      <form onSubmit={handleSubmit}>

      {/* Email */}
      <div className="mt-6">
        <label className={`text-xs ${t.textSecondary}`}>EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition ${t.bg} ${t.text} ${t.border}`}
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div className="mt-4">
        <label className={`text-xs ${t.textSecondary}`}>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition ${t.bg} ${t.text} ${t.border}`}
          placeholder="Enter your password"
        />
      </div>

      {/* Login Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full mt-6 py-3 rounded-md bg-blue-600 text-white text-sm font-semibold"
      >
        LOG IN
      </motion.button>
      </form>

      {/* Divider */}
      <div className={`text-center text-xs my-4 ${t.textMuted}`}>
        OR CONTINUE WITH
      </div>

      {/* Google Login */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        onClick={handleGoogleLogin}
        className={`w-full flex items-center justify-center gap-3 border py-2 rounded-md text-sm ${t.border} ${t.text}`}
      >
        <FaGoogle /> Continue with Google
      </motion.button>

      {/* Switch to Signup */}
      <p className={`text-center text-sm mt-5 ${t.textSecondary}`}>
        Don't have an account?
        <button onClick={onSwitch} className="ml-1 text-blue-500 font-medium">
          Create account
        </button>
      </p>
    </motion.div>
  );
}