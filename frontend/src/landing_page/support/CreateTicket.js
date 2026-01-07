import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";

function CreateTicket() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-20`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h4 className={`text-2xl md:text-3xl font-extrabold ${t.text} mb-2`}>
            Create a support ticket
          </h4>
          <p className={`${t.textSecondary} text-lg`}>
            Select a relevant topic below to get started.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card */}
          <div className={`${t.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition`}>
            <h5 className={`text-lg font-bold ${t.accent} mb-4`}>
              Account Opening
            </h5>
            <ul className={`space-y-2 ${t.textSecondary}`}>
              <li><a href="#" className={`${t.hover}`}>Trading FAQs</a></li>
              <li><a href="#" className={`${t.hover}`}>Kite</a></li>
              <li><a href="#" className={`${t.hover}`}>Margin</a></li>
              <li><a href="#" className={`${t.hover}`}>Product & Order Types</a></li>
              <li><a href="#" className={`${t.hover}`}>Corporate Actions</a></li>
              <li><a href="#" className={`${t.hover}`}>Kite Features</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className={`${t.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition`}>
            <h5 className={`text-lg font-bold ${t.accent} mb-4`}>
              Your Zerodha Account
            </h5>
            <ul className={`space-y-2 ${t.textSecondary}`}>
              <li><a href="#" className={`${t.hover}`}>Login Credentials</a></li>
              <li><a href="#" className={`${t.hover}`}>Profile</a></li>
              <li><a href="#" className={`${t.hover}`}>Account Modification</a></li>
              <li><a href="#" className={`${t.hover}`}>CMR & DP ID</a></li>
              <li><a href="#" className={`${t.hover}`}>Nomination</a></li>
              <li><a href="#" className={`${t.hover}`}>Transfer & Conversion</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className={`${t.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition`}>
            <h5 className={`text-lg font-bold ${t.accent} mb-4`}>
              Trading & Markets
            </h5>
            <ul className={`space-y-2 ${t.textSecondary}`}>
              <li><a href="#" className={`${t.hover}`}>Getting Started</a></li>
              <li><a href="#" className={`${t.hover}`}>Online Trading</a></li>
              <li><a href="#" className={`${t.hover}`}>Offline Trading</a></li>
              <li><a href="#" className={`${t.hover}`}>Charges</a></li>
              <li><a href="#" className={`${t.hover}`}>Company / Partnership / HUF</a></li>
              <li><a href="#" className={`${t.hover}`}>NRI</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className={`${t.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition`}>
            <h5 className={`text-lg font-bold ${t.accent} mb-4`}>
              Funds
            </h5>
            <ul className={`space-y-2 ${t.textSecondary}`}>
              <li><a href="#" className={`${t.hover}`}>Fund Withdrawal</a></li>
              <li><a href="#" className={`${t.hover}`}>Adding Funds</a></li>
              <li><a href="#" className={`${t.hover}`}>Bank Accounts</a></li>
              <li><a href="#" className={`${t.hover}`}>eMandate</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className={`${t.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition`}>
            <h5 className={`text-lg font-bold ${t.accent} mb-4`}>
              Console
            </h5>
            <ul className={`space-y-2 ${t.textSecondary}`}>
              <li><a href="#" className={`${t.hover}`}>IPO</a></li>
              <li><a href="#" className={`${t.hover}`}>Portfolio</a></li>
              <li><a href="#" className={`${t.hover}`}>Fund Statement</a></li>
              <li><a href="#" className={`${t.hover}`}>Profile</a></li>
              <li><a href="#" className={`${t.hover}`}>Reports</a></li>
              <li><a href="#" className={`${t.hover}`}>Referral Program</a></li>
            </ul>
          </div>

          {/* Card */}
          <div className={`${t.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition`}>
            <h5 className={`text-lg font-bold ${t.accent} mb-4`}>
              Coin
            </h5>
            <ul className={`space-y-2 ${t.textSecondary}`}>
              <li><a href="#" className={`${t.hover}`}>Mutual Funds & Coin</a></li>
              <li><a href="#" className={`${t.hover}`}>Coin App</a></li>
              <li><a href="#" className={`${t.hover}`}>Coin Web</a></li>
              <li><a href="#" className={`${t.hover}`}>Transactions & Reports</a></li>
              <li><a href="#" className={`${t.hover}`}>National Pension Scheme (NPS)</a></li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CreateTicket;