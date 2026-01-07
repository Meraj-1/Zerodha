import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../contexts/themeConfig';

function Hero() {

 const {theme} = useTheme();
 const t = themes[theme];

  return (
    <section
      id="openacount"
      className={` ${t.bgSecondary} `}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Hero Image */}
          <img
            src="https://zerodha.com/static/images/landing.png"
            alt="Investing Platform"
            className="w-full max-w-3xl mb-10 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
          />

          {/* Heading */}
          <h1 className={`text-3xl ${t.text} md:text-4xl lg:text-6xl font-extrabold  leading-tight`}>
            Invest in <span className={`text-blue-600 ${t.text}`}>everything</span>
          </h1>

          {/* Description */}
          <p className={`${t.text} mt-6 text-gray-600 text-sm md:text-lg lg:text-xl max-w-2xl`}>
            A modern online platform to invest in stocks, derivatives, mutual funds,
            ETFs, bonds, and more — all in one place.
          </p>

          {/* CTA Button */}
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center justify-center
                       bg-gradient-to-r from-blue-600 to-blue-700
                       text-white font-bold text-lg
                       py-3 px-8 rounded-full
                       shadow-lg hover:shadow-xl
                       hover:from-blue-700 hover:to-blue-800
                       transition-all duration-300"
          >
            Sign up for free →
          </Link>

          {/* Trust text */}
          <p className={`mt-4 text-sm text-gray-500 ${t.text}`}>
            Trusted by 1+ crore investors across India
          </p>

        </div>
      </div>
    </section>
  );
}

export default Hero;
