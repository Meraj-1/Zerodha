import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";

function Pricing() {
  const {theme} = useTheme();
  const t  = themes[theme];
  
  return (
    <section className={`${t.bgSecondary} py-20`}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className={`text-3xl md:text-5xl font-extrabold ${t.text}`}>
            Unbeatable Pricing
          </h2>
          <p className={`${t.theme} mt-4 text-lg max-w-3xl mx-auto`}>
            We pioneered the concept of discount broking and price transparency in India.
            Flat fees with absolutely no hidden charges.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Info Card */}
          <div className="rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h3 className={`text-xl font-bold ${t.text} mb-4`}>
              Simple & Transparent
            </h3>
            <p className={`${t.text}`}>
              No gimmicks. No complex slabs. Just straightforward pricing designed for traders
              and long-term investors.
            </p>
          </div>

          {/* ₹0 Card */}
          <div className="rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h1 className={`text-5xl font-extrabold  ${t.text}`}>₹0</h1>
            <p className={`${t.text} font-semibold mt-4 text-lg`}>
              Free equity delivery
            </p>
            <p className={`${t.text} mt-2`}>
              & direct mutual funds
            </p>
          </div>

          {/* ₹20 Card */}
          <div className="rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h1 className={`text-5xl font-extrabold ${t.text}`}>₹20</h1>
            <p className={`${t.text} font-semibold mt-4 text-lg`}>
              Intraday & F&O
            </p>
            <p className={`${t.text} mt-2`}>
              Per executed order
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Pricing;

