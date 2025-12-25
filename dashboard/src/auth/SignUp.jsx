// import { useState } from "react";
// import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     terms: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.terms) {
//       alert("Please accept Terms & Conditions");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     console.log("Register Data:", formData);
//   };

//   const handleGoogleSignup = () => {
//     // console.log("Continue with Google");
//      window.location.href = "http://localhost:8000/auth/google";
//     // Google OAuth logic yaha lagega
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-green-200 to-yellow-200 relative">

//       {/* Top Bar */}
//       <div className="absolute top-6 left-8 flex items-center gap-2">
//         <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
//           Qp
//         </div>
//         <span className="font-semibold">QPAY</span>
//       </div>

//       <button className="absolute top-6 right-8 border px-4 py-1 text-sm font-medium">
//         LOG IN
//       </button>

//       {/* Card */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white w-[420px] p-8 shadow-xl rounded-md"
//       >
//         <h2 className="text-xl font-semibold text-center">
//           Create your <span className="font-bold">Qpay</span> Account
//         </h2>
//         <p className="text-center text-sm text-gray-500 mt-1">
//           Start automating your payments easily
//         </p>

//         {/* Name */}
//         <div className="mt-6">
//           <label className="text-xs text-gray-500">FULL NAME</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="John Doe"
//             className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div className="mt-4">
//           <label className="text-xs text-gray-500">EMAIL ADDRESS</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="johndoe@example.com"
//             className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
//             required
//           />
//         </div>

//         {/* Password */}
//         <div className="mt-4">
//           <label className="text-xs text-gray-500">PASSWORD</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="********"
//             className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
//             required
//           />
//         </div>

//         {/* Confirm Password */}
//         <div className="mt-4">
//           <label className="text-xs text-gray-500">CONFIRM PASSWORD</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             placeholder="********"
//             className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
//             required
//           />
//         </div>

//         {/* Terms */}
//         <div className="flex items-start gap-2 mt-4 text-sm">
//           <input
//             type="checkbox"
//             name="terms"
//             checked={formData.terms}
//             onChange={handleChange}
//           />
//           <p className="text-gray-500">
//             I agree to the{" "}
//             <span className="text-black font-medium cursor-pointer">
//               Terms & Conditions
//             </span>
//           </p>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-3 mt-5 text-sm hover:opacity-90"
//         >
//           CREATE ACCOUNT
//         </button>

//         {/* Divider */}
//         <div className="text-center text-xs text-gray-400 my-4">
//           OR CONTINUE WITH
//         </div>

//         {/* Google */}
//         <button
//           type="button"
//           onClick={handleGoogleSignup}
//           className="w-full flex items-center justify-center gap-3 border py-2 text-sm hover:bg-gray-50"
//         >
//           <FaGoogle />
//           Continue with Google
//         </button>

//         {/* Other Social */}
//         <div className="flex justify-center gap-4 mt-4">
//           <button type="button" className="border p-2 rounded">
//             <FaApple />
//           </button>
//           <button type="button" className="border p-2 rounded">
//             <FaFacebookF />
//           </button>
//         </div>
//       </form>

//       {/* Footer */}
//       <div className="absolute bottom-4 text-xs text-gray-400">
//         © 2021 - 2025 All Rights Reserved. Qpay
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaUserShield, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

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
    window.location.href = "http://localhost:8000/auth/google";
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
