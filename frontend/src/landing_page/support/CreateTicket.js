import React from "react";

function CreateTicket() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Create a support ticket
          </h4>
          <p className="text-gray-600 text-lg">
            Select a relevant topic below to get started.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-bold text-blue-700 mb-4">
              Account Opening
            </h5>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-blue-600">Trading FAQs</a></li>
              <li><a href="#" className="hover:text-blue-600">Kite</a></li>
              <li><a href="#" className="hover:text-blue-600">Margin</a></li>
              <li><a href="#" className="hover:text-blue-600">Product & Order Types</a></li>
              <li><a href="#" className="hover:text-blue-600">Corporate Actions</a></li>
              <li><a href="#" className="hover:text-blue-600">Kite Features</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-bold text-blue-700 mb-4">
              Your Zerodha Account
            </h5>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-blue-600">Login Credentials</a></li>
              <li><a href="#" className="hover:text-blue-600">Profile</a></li>
              <li><a href="#" className="hover:text-blue-600">Account Modification</a></li>
              <li><a href="#" className="hover:text-blue-600">CMR & DP ID</a></li>
              <li><a href="#" className="hover:text-blue-600">Nomination</a></li>
              <li><a href="#" className="hover:text-blue-600">Transfer & Conversion</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-bold text-blue-700 mb-4">
              Trading & Markets
            </h5>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-blue-600">Getting Started</a></li>
              <li><a href="#" className="hover:text-blue-600">Online Trading</a></li>
              <li><a href="#" className="hover:text-blue-600">Offline Trading</a></li>
              <li><a href="#" className="hover:text-blue-600">Charges</a></li>
              <li><a href="#" className="hover:text-blue-600">Company / Partnership / HUF</a></li>
              <li><a href="#" className="hover:text-blue-600">NRI</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-bold text-blue-700 mb-4">
              Funds
            </h5>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-blue-600">Fund Withdrawal</a></li>
              <li><a href="#" className="hover:text-blue-600">Adding Funds</a></li>
              <li><a href="#" className="hover:text-blue-600">Bank Accounts</a></li>
              <li><a href="#" className="hover:text-blue-600">eMandate</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-bold text-blue-700 mb-4">
              Console
            </h5>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-blue-600">IPO</a></li>
              <li><a href="#" className="hover:text-blue-600">Portfolio</a></li>
              <li><a href="#" className="hover:text-blue-600">Fund Statement</a></li>
              <li><a href="#" className="hover:text-blue-600">Profile</a></li>
              <li><a href="#" className="hover:text-blue-600">Reports</a></li>
              <li><a href="#" className="hover:text-blue-600">Referral Program</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-bold text-blue-700 mb-4">
              Coin
            </h5>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-blue-600">Mutual Funds & Coin</a></li>
              <li><a href="#" className="hover:text-blue-600">Coin App</a></li>
              <li><a href="#" className="hover:text-blue-600">Coin Web</a></li>
              <li><a href="#" className="hover:text-blue-600">Transactions & Reports</a></li>
              <li><a href="#" className="hover:text-blue-600">National Pension Scheme (NPS)</a></li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CreateTicket;
