import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";

function Hero() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-20`}>
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <header className="mb-20">
          <h1 className={`text-4xl md:text-5xl font-extrabold ${t.accent} mb-5`}>
            Pricing
          </h1>

          <p
            className={`text-lg md:text-xl ${t.textSecondary} font-medium max-w-2xl mx-auto`}
          >
            Free equity investments and flat ₹20 on intraday and F&O trades.
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Card 1 */}
          <div
            className={`${t.bg} rounded-3xl p-10 shadow-sm border ${t.border}
                        hover:shadow-lg transition`}
          >
            <img
              src="https://zerodha.com/static/images/pricing-eq.svg"
              alt="Free equity delivery"
              className="w-24 mx-auto mb-8"
            />

            <h2 className={`text-2xl font-bold mb-4 ${t.text}`}>
              Free equity delivery
            </h2>

            <p className={`${t.textSecondary} leading-relaxed`}>
              All equity delivery investments (NSE, BSE) are absolutely free —
              <span className={`ml-1 font-semibold ${t.text}`}>
                ₹0 brokerage
              </span>.
            </p>
          </div>

          {/* Card 2 – Primary */}
          <div
            className={`${t.bg} rounded-3xl p-10 shadow-md border ${t.border}
                        ring-2 ring-blue-500 hover:shadow-xl transition
                        scale-[1.03]`}
          >
            <img
              src="https://zerodha.com/static/images/other-trades.svg"
              alt="Flat ₹20 trades"
              className="w-24 mx-auto mb-8"
            />

            <h2 className={`text-2xl font-bold mb-4 ${t.text}`}>
              Flat ₹20 per trade
            </h2>

            <p className={`${t.textSecondary} leading-relaxed`}>
              ₹20 or 0.03% (whichever is lower) per executed order on intraday
              trades across equity, currency, and commodities.
              <br />
              <span className={`font-semibold ${t.text}`}>
                Flat ₹20 on all options trades.
              </span>
            </p>
          </div>

          {/* Card 3 */}
          <div
            className={`${t.bg} rounded-3xl p-10 shadow-sm border ${t.border}
                        hover:shadow-lg transition`}
          >
            <img
              src="https://zerodha.com/static/images/pricing-eq.svg"
              alt="Free direct mutual funds"
              className="w-24 mx-auto mb-8"
            />

            <h2 className={`text-2xl font-bold mb-4 ${t.text}`}>
              Free direct MF
            </h2>

            <p className={`${t.textSecondary} leading-relaxed`}>
              All direct mutual fund investments are absolutely free —
              <span className={`ml-1 font-semibold ${t.text}`}>
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
