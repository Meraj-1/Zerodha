import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import { ArrowRight } from "lucide-react";

function Education() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-20`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col-reverse md:flex-row items-center gap-14">

          {/* Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className={`text-2xl md:text-3xl font-semibold ${t.text} mb-5`}>
              Free and open market education
            </h2>

            <p className={`${t.textSecondary} text-lg leading-relaxed mb-6`}>
              <strong className={t.text}>Varsity</strong>, the largest online stock
              market education platform, covering everything from basics to
              advanced trading.
            </p>

            <a
              href="#"
              className={`inline-flex items-center gap-2 ${t.accent}
                          font-semibold hover:underline
                          focus-visible:outline focus-visible:outline-2
                          focus-visible:outline-offset-2`}
            >
              Explore Varsity
              <ArrowRight size={18} />
            </a>

            <div className="mt-10">
              <p className={`${t.textSecondary} text-lg leading-relaxed mb-3`}>
                <strong className={t.text}>TradingQ&amp;A</strong>, India’s most
                active trading and investment community for all market-related
                queries.
              </p>

              <a
                href="#"
                className={`inline-flex items-center gap-2 ${t.accent}
                            font-semibold hover:underline
                            focus-visible:outline focus-visible:outline-2
                            focus-visible:outline-offset-2`}
              >
                Visit TradingQ&amp;A
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://zerodha.com/static/images/index-education.svg"
              alt="Free and open market education"
              loading="lazy"
              className="w-full max-w-lg"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Education;
