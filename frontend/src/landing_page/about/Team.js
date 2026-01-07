import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";

function Team() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bg} py-20`}>
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 items-center">

          {/* Image & Name */}
          <div className="flex flex-col items-center text-center">
            <img
              src="https://zerodha.com/static/images/nithin-kamath.jpg"
              alt="Nithin Kamath"
              className="w-64 h-64 object-cover rounded-full shadow-lg ring-4 ring-gray-100"
            />

            <h4 className={`mt-6 text-3xl font-serif font-bold ${t.text}`}>
              Nithin Kamath
            </h4>

            <p className={`text-lg ${t.textSecondary} mt-1`}>
              Founder & CEO
            </p>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <div className={`space-y-5 text-lg ${t.textSecondary} leading-relaxed`}>
              <p>
                Nithin bootstrapped and founded{" "}
                <span className={`font-semibold ${t.text}`}>Zerodha</span> in
                2010 to overcome the hurdles he faced during his decade-long
                stint as a trader. Today, Zerodha has fundamentally changed the
                landscape of the Indian broking industry.
              </p>

              <p>
                He is a member of the{" "}
                <span className={`font-semibold ${t.text}`}>
                  SEBI Secondary Market Advisory Committee (SMAC)
                </span>{" "}
                and the{" "}
                <span className={`font-semibold ${t.text}`}>
                  Market Data Advisory Committee (MDAC)
                </span>.
              </p>

              <p>
                When he isn't building products or thinking about markets,
                playing basketball is his zen.
              </p>

              {/* Social Links */}
              <div className="pt-4">
                <span className={`${t.textSecondary} mr-2`}>Connect on:</span>
                <a
                  href="https://nithinkamath.me/"
                  className={`${t.accent} hover:underline mr-4`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Homepage
                </a>
                <a
                  href="https://tradingqna.com/u/nithin/summary"
                  className={`${t.accent} hover:underline mr-4`}
                  target="_blank"
                  rel="noreferrer"
                >
                  TradingQnA
                </a>
                <a
                  href="https://x.com/Nithin0dha"
                  className={`${t.accent} hover:underline`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Team;