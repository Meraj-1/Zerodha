import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaUserShield, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast';

export default function SignUp({ onSwitch, theme = "light" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const passwordMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.terms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    if (!passwordMatch) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://kitebackend.vercel.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Account created successfully!");
        // Store token if provided
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  // Theme classes
  const bgClass = theme === "light" ? "bg-white/80" : "bg-gray-900/80";
  const textClass = theme === "light" ? "text-gray-900" : "text-white";
  const inputClass =
    theme === "light"
      ? "border-gray-200 placeholder-gray-400 text-gray-900 bg-white"
      : "border-gray-700 placeholder-gray-400 text-white bg-gray-800";
  const roleSelectedClass = "border-blue-600 bg-blue-50 text-blue-600";
  const roleUnselectedClass =
    theme === "light" ? "border-gray-200 text-gray-600" : "border-gray-700 text-gray-300";
  const dividerText = theme === "light" ? "text-gray-400" : "text-gray-300";
  const termsText = theme === "light" ? "text-gray-500" : "text-gray-300";

  const handleGoogleSignup = () => {
    window.location.href = "https://kitebackend.vercel.app/auth/google/callback";
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4`}>
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${bgClass} w-[440px] rounded-2xl shadow-xl p-8 border`}
      >
        {/* Logo */}
        <h2 className={`text-2xl font-bold text-center ${textClass}`}>
          Q<span className="text-blue-600">pay</span>
        </h2>
        <p className={`text-center text-sm mt-1 ${termsText}`}>
          Smart payments for modern trading
        </p>

        {/* Role Selector */}
        <div className="mt-6">
          <label className={`text-xs ${termsText}`}>SELECT ROLE</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { label: "User", value: "user", icon: <FaUser /> },
              { label: "Admin", value: "admin", icon: <FaUserShield /> },
            ].map((role) => (
              <motion.button
                type="button"
                key={role.value}
                whileHover={{ scale: 1.03 }}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: role.value }))
                }
                className={`flex items-center gap-2 justify-center border rounded-lg py-3 text-sm ${
                  formData.role === role.value
                    ? roleSelectedClass
                    : roleUnselectedClass
                }`}
              >
                {role.icon}
                {role.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        {[
          { label: "FULL NAME", name: "name", type: "text" },
          { label: "EMAIL ADDRESS", name: "email", type: "email" },
        ].map((field, i) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="mt-4"
          >
            <label className={`text-xs ${termsText}`}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${inputClass}`}
              required
            />
          </motion.div>
        ))}

        {/* Password & Confirm Password */}
        {[
          { label: "PASSWORD", name: "password", show: showPassword, toggle: setShowPassword },
          { label: "CONFIRM PASSWORD", name: "confirmPassword", show: showConfirmPassword, toggle: setShowConfirmPassword },
        ].map((field, i) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="mt-4 relative"
          >
            <label className={`text-xs ${termsText}`}>{field.label}</label>
            <input
              type={field.show ? "text" : "password"}
              name={field.name}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${inputClass}`}
              required
            />
            <button
              type="button"
              onClick={() => field.toggle(!field.show)}
              className="absolute top-9 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {field.show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>
        ))}

        {/* Password match */}
        {formData.confirmPassword && (
          <p
            className={`text-xs mt-1 ${
              passwordMatch ? "text-green-600" : "text-red-500"
            }`}
          >
            {passwordMatch ? "Passwords match ✓" : "Passwords do not match"}
          </p>
        )}

        {/* Terms */}
        <div className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="terms"
            onChange={handleChange}
            className="accent-blue-600"
          />
          <span className={termsText}>
            I agree to <b className={`text-black dark:text-white`}>Terms & Conditions</b>
          </span>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full mt-6 py-3 rounded-md bg-blue-600 text-white text-sm font-semibold"
        >
          CREATE ACCOUNT
        </motion.button>

        {/* Divider */}
        <div className={`text-center text-xs my-4 ${dividerText}`}>
          OR CONTINUE WITH
        </div>

        {/* Google */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          type="button"
          onClick={handleGoogleSignup}
          className={`w-full flex items-center justify-center gap-2 border py-2 rounded-md text-sm ${
            theme === "light" ? "border-gray-300 text-gray-700" : "border-gray-600 text-white"
          }`}
        >
          <FaGoogle /> Continue with Google
        </motion.button>

        {/* Switch */}
        <p className={`text-center text-sm mt-4 ${termsText}`}>
          Already have an account?
          <button onClick={onSwitch} className="ml-1 text-blue-600 font-medium">
            Log in
          </button>
        </p>
      </motion.form>
    </div>
  );
}
