import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import { ArrowRight } from "lucide-react";

function RightImage({
  imageURL,
  productName,
  productDescription,
  learnmore = "Learn more",
}) {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* Text */}
        <div className="text-center md:text-left">
          <h2 className={`text-3xl md:text-4xl font-extrabold ${t.text} mb-5`}>
            {productName}
          </h2>

          <p className={`text-lg ${t.textSecondary} leading-relaxed mb-7 max-w-xl`}>
            {productDescription}
          </p>

          <a
            href="#"
            className={`inline-flex items-center gap-2 ${t.accent} font-semibold
                        hover:underline focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-2`}
          >
            {learnmore}
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={imageURL}
            alt={`${productName} product preview`}
            loading="lazy"
            className="w-full max-w-xl rounded-2xl shadow-lg
                       transition-transform duration-300 hover:-translate-y-1
                       hover:shadow-xl"
          />
        </div>

      </div>
    </section>
  );
}

export default RightImage;
