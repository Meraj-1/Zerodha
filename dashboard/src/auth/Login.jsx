import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

export default function Login() {
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
        SIGN UP
      </button>

      {/* Card */}
      <div className="bg-white w-[400px] p-8 shadow-xl rounded-md">
        <h2 className="text-xl font-semibold text-center">
          Log In to <span className="font-bold">Qpay</span>
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Quick & Simple way to Automate your payment
        </p>

        {/* Email */}
        <div className="mt-6">
          <label className="text-xs text-gray-500">EMAIL ADDRESS</label>
          <input
            type="email"
            placeholder="johndoe@example.com"
            className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="text-xs text-gray-500">PASSWORD</label>
          <input
            type="password"
            placeholder="********"
            className="w-full border px-3 py-2 mt-1 text-sm outline-none focus:ring-1"
          />
        </div>

        {/* Remember / Forgot */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#" className="text-gray-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* Button */}
        <button className="w-full bg-black text-white py-3 mt-5 text-sm">
          PROCEED
        </button>

        {/* Divider */}
        <div className="text-center text-xs text-gray-400 my-4">
          OR USE
        </div>

        {/* Social */}
        <div className="flex justify-center gap-4">
          <button className="border p-2 rounded">
            <FaGoogle />
          </button>
          <button className="border p-2 rounded">
            <FaApple />
          </button>
          <button className="border p-2 rounded">
            <FaFacebookF />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-xs text-gray-400">
        © 2021 - 2025 All Rights Reserved. Qpay
      </div>
    </div>
  );
}
