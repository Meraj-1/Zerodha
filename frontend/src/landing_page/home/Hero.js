import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import { ArrowRight } from "lucide-react";

function Hero() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section
      id="openaccount"
      className={`${t.bgSecondary} py-20`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Hero Image */}
          <img
            src="https://zerodha.com/static/images/landing.png"
            alt="All-in-one investing platform"
            loading="lazy"
            className="w-full max-w-3xl mb-12 rounded-2xl shadow-lg
                       transition-transform duration-300 hover:scale-[1.03]"
          />

          {/* Heading */}
          <h1
            className={`text-3xl md:text-5xl lg:text-6xl font-extrabold
                        leading-tight ${t.text}`}
          >
            Invest in{" "}
            <span className={`${t.accent}`}>
              everything
            </span>
          </h1>

          {/* Description */}
          <p
            className={`${t.textSecondary} mt-6 text-base md:text-lg lg:text-xl
                        max-w-2xl`}
          >
            A modern platform to invest in stocks, derivatives, mutual funds,
            ETFs, bonds, and more — all in one place.
          </p>

          {/* CTA Button */}
          <Link
            to="/signup"
            className={`mt-10 inline-flex items-center gap-2
                        px-10 py-3.5 rounded-full
                        font-semibold text-lg text-white
                        bg-gradient-to-r from-blue-600 to-blue-700
                        hover:from-blue-700 hover:to-blue-800
                        shadow-lg hover:shadow-xl
                        transition focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-offset-2`}
          >
            Sign up for free
            <ArrowRight size={20} />
          </Link>

          {/* Trust text */}
          <p className={`mt-6 text-sm ${t.textSecondary}`}>
            Trusted by <strong className={t.text}>1+ crore</strong> investors
            across India
          </p>

        </div>
      </div>
    </section>
  );
}

export default Hero;
