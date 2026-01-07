import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";

function Hero() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-16`}>
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h3 className={`text-4xl md:text-5xl font-extrabold ${t.accent} mb-4`}>
          Pricing
        </h3>

        <p className={`text-lg md:text-xl ${t.textSecondary} font-medium max-w-2xl mx-auto mb-16`}>
          Free equity investments and flat ₹20 on intraday and F&O trades
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className={`${t.bg} rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all`}>
            <img
              src="https://zerodha.com/static/images/pricing-eq.svg"
              alt="Free equity delivery"
              className="w-28 mx-auto mb-6"
            />
            <h4 className={`text-2xl font-bold mb-3 ${t.text}`}>
              Free equity delivery
            </h4>
            <p className={`${t.textSecondary} leading-relaxed`}>
              All equity delivery investments (NSE, BSE) are absolutely free —
              <span className={`font-semibold ${t.text}`}> ₹0 brokerage</span>.
            </p>
          </div>

          {/* Card 2 (Highlighted) */}
          <div className={`${t.bg} rounded-2xl p-8 shadow-md ring-2 ring-blue-500 hover:shadow-xl transition-all scale-[1.02]`}>
            <img
              src="https://zerodha.com/static/images/other-trades.svg"
              alt="Flat ₹20 trades"
              className="w-28 mx-auto mb-6"
            />
            <h4 className={`text-2xl font-bold mb-3 ${t.text}`}>
              Flat ₹20 per trade
            </h4>
            <p className={`${t.textSecondary} leading-relaxed`}>
              Flat ₹20 or 0.03% (whichever is lower) per executed order on
              intraday trades across equity, currency & commodities.
              <br />
              <span className={`font-semibold ${t.text}`}>
                Flat ₹20 on all option trades.
              </span>
            </p>
          </div>

          {/* Card 3 */}
          <div className={`${t.bg} rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all`}>
            <img
              src="https://zerodha.com/static/images/pricing-eq.svg"
              alt="Free direct MF"
              className="w-28 mx-auto mb-6"
            />
            <h4 className={`text-2xl font-bold mb-3 ${t.text}`}>
              Free direct MF
            </h4>
            <p className={`${t.textSecondary} leading-relaxed`}>
              All direct mutual fund investments are absolutely free —
              <span className={`font-semibold ${t.text}`}>
                {" "}
                ₹0 commissions & DP charges
              </span>.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;