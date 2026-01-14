import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import { ArrowRight } from "lucide-react";

function Brokerage() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-24`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-20">
          <h2 className={`text-3xl md:text-5xl font-extrabold ${t.text} mb-6`}>
            Open a Zerodha Account
          </h2>
          <p className={`text-lg md:text-xl ${t.textSecondary}`}>
            Modern platforms, ₹0 investments, and flat ₹20 intraday and F&O
            trades — no hidden fees.
          </p>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-stretch">

          {/* Left Card */}
          <div
            className={`${t.bg} rounded-3xl p-10 shadow-sm border ${t.border}
                        hover:shadow-lg transition`}
          >
            <a
              href="#"
              className={`inline-flex items-center gap-2 ${t.accent}
                          font-semibold text-lg mb-8 hover:underline
                          focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2`}
            >
              Brokerage calculator
              <ArrowRight size={18} />
            </a>

            <ul className={`space-y-5 ${t.textSecondary} text-sm leading-relaxed`}>
              <li>
                Call & Trade and RMS auto-squareoff:
                <span className={`ml-1 ${t.text} font-medium`}>
                  ₹50 + GST per order
                </span>
              </li>
              <li>Digital contract notes are sent via e-mail.</li>
              <li>
                Physical contract notes (on request):
                <span className={`ml-1 ${t.text} font-medium`}>
                  ₹20 per note + courier charges
                </span>
              </li>
              <li>
                NRI (non-PIS) accounts:
                <span className={`ml-1 ${t.text} font-medium`}>
                  0.5% or ₹100 per executed order
                </span>{" "}
                (whichever is lower)
              </li>
              <li>
                NRI (PIS) accounts:
                <span className={`ml-1 ${t.text} font-medium`}>
                  0.5% or ₹200 per executed order
                </span>{" "}
                (whichever is lower)
              </li>
              <li>
                Orders placed with debit balance:
                <span className={`ml-1 ${t.text} font-medium`}>
                  ₹40 per executed order
                </span>{" "}
                instead of ₹20
              </li>
            </ul>
          </div>

          {/* Right CTA */}
          <div
            className={`${t.bg} rounded-3xl p-12 shadow-sm border ${t.border}
                        hover:shadow-lg transition flex flex-col
                        items-center justify-center text-center`}
          >
            <h3 className={`text-2xl md:text-3xl font-bold ${t.text} mb-4`}>
              Want a detailed breakdown?
            </h3>

            <p className={`${t.textSecondary} mb-10 max-w-md`}>
              Explore the complete list of brokerage, statutory charges, and
              taxes across all segments.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 px-9 py-3.5
                         bg-blue-600 text-white font-semibold rounded-xl
                         hover:bg-blue-700 transition shadow-lg
                         focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2"
            >
              View list of charges
              <ArrowRight size={18} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Brokerage;
