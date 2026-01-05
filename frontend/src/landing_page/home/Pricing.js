import React from "react";

function Pricing() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800">
            Unbeatable Pricing
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
            We pioneered the concept of discount broking and price transparency in India.
            Flat fees with absolutely no hidden charges.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Info Card */}
          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Simple & Transparent
            </h3>
            <p className="text-gray-600">
              No gimmicks. No complex slabs. Just straightforward pricing designed for traders
              and long-term investors.
            </p>
          </div>

          {/* ₹0 Card */}
          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h1 className="text-5xl font-extrabold text-blue-600">₹0</h1>
            <p className="text-gray-700 font-semibold mt-4 text-lg">
              Free equity delivery
            </p>
            <p className="text-gray-500 mt-2">
              & direct mutual funds
            </p>
          </div>

          {/* ₹20 Card */}
          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h1 className="text-5xl font-extrabold text-blue-600">₹20</h1>
            <p className="text-gray-700 font-semibold mt-4 text-lg">
              Intraday & F&O
            </p>
            <p className="text-gray-500 mt-2">
              Per executed order
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Pricing;

