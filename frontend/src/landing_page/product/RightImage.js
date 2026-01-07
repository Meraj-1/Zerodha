import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";

function RightImage({ imageURL, productName, productDescription, learnmore }) {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <div className="text-center md:text-left">
          <h3 className={`text-3xl md:text-4xl font-extrabold ${t.text} mb-4`}>
            {productName}
          </h3>

          <p className={`text-lg ${t.textSecondary} leading-relaxed mb-6`}>
            {productDescription}
          </p>

          <a
            href="#"
            className={`inline-flex items-center ${t.accent} font-semibold hover:underline`}
          >
            {learnmore || "Learn more →"}
          </a>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={imageURL}
            alt={productName}
            className="w-full max-w-xl rounded-xl shadow-md hover:shadow-xl transition"
          />
        </div>

      </div>
    </section>
  );
}

export default RightImage;