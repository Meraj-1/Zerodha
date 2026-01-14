import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import { ArrowRight } from "lucide-react";

function Hero() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-28`}>
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <span className={`inline-block mb-4 text-sm tracking-widest uppercase ${t.textSecondary}`}>
          Our Platforms
        </span>

        {/* Title */}
        <h1 className={`text-4xl md:text-6xl font-extrabold ${t.accent} mb-6`}>
          Technology
        </h1>

        {/* Subtitle */}
        <p className={`text-lg md:text-2xl font-medium ${t.text} max-w-3xl mx-auto mb-8`}>
          Sleek, modern, and intuitive trading platforms built for speed,
          reliability, and clarity.
        </p>

        {/* CTA */}
        <a
          href="#"
          className={`inline-flex items-center gap-2 text-lg font-semibold ${t.accent}
                      hover:underline focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-offset-2`}
        >
          Explore investment offerings
          <ArrowRight size={18} />
        </a>

      </div>
    </section>
  );
}

export default Hero;
