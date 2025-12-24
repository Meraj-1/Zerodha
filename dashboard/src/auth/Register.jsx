import { useState } from "react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Register Data:", formData);
  };

  const handleGoogleSignup = () => {
    // console.log("Continue with Google");
     window.location.href = "http://localhost:8000/auth/google";
    // Google OAuth logic yaha lagega
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-green-200 to-yellow-200 relative">

      {/* Top Bar */}
      <div className="absolute top-6 left-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
          Qp
        </div>
        <span className="font-semibold">QPAY</span>
      </div>

      <button className="absolute top-6 right-8 border px-4 py-1 text-sm font-medium">
        LOG IN
      </button>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[420px] p-8 shadow-xl rounded-md"
      >
        <h2 className="text-xl font-semibold text-center">
          Create your <span className="font-bold">Qpay</span> Account
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Start automating your payments easily
        </p>

        {/* Name */}
        <div className="mt-6">
          <label className="text-xs text-gray-500">FULL NAME</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
            required
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="text-xs text-gray-500">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johndoe@example.com"
            className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
            required
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="text-xs text-gray-500">PASSWORD</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <label className="text-xs text-gray-500">CONFIRM PASSWORD</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="********"
            className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
            required
          />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          <p className="text-gray-500">
            I agree to the{" "}
            <span className="text-black font-medium cursor-pointer">
              Terms & Conditions
            </span>
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 mt-5 text-sm hover:opacity-90"
        >
          CREATE ACCOUNT
        </button>

        {/* Divider */}
        <div className="text-center text-xs text-gray-400 my-4">
          OR CONTINUE WITH
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border py-2 text-sm hover:bg-gray-50"
        >
          <FaGoogle />
          Continue with Google
        </button>

        {/* Other Social */}
        <div className="flex justify-center gap-4 mt-4">
          <button type="button" className="border p-2 rounded">
            <FaApple />
          </button>
          <button type="button" className="border p-2 rounded">
            <FaFacebookF />
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="absolute bottom-4 text-xs text-gray-400">
        © 2021 - 2025 All Rights Reserved. Qpay
      </div>
    </div>
  );
}
