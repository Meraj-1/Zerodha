import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";

function Hero() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-24`}>
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Title */}
        <h3 className={`text-3xl md:text-5xl font-extrabold ${t.accent} mb-6`}>
          Technology
        </h3>

        {/* Subtitle */}
        <h5 className={`text-lg md:text-2xl font-medium ${t.text} mb-6`}>
          Sleek, modern, and intuitive trading platforms
        </h5>

        {/* CTA */}
        <p className={`${t.textSecondary} text-lg`}>
          Check out our{" "}
          <a
            href="#"
            className={`${t.accent} font-semibold hover:underline`}
          >
            investment offerings →
          </a>
        </p>

      </div>
    </section>
  );
}

export default Hero;