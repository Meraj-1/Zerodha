import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { themes } from "../contexts/themeConfig";

function NotFound() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <div className={`min-h-screen ${t.bgSecondary} flex items-center justify-center px-6`}>
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div className="text-center md:text-left">
          <p className={`${t.accent} font-semibold mb-3 tracking-wide`}>
            ERROR 404
          </p>

          <h1 className={`text-6xl font-extrabold ${t.text} leading-tight mb-6`}>
            Page not found
          </h1>

          <p className={`text-xl ${t.textSecondary} mb-4`}>
            Kiaan couldn't find the page you're looking for.
          </p>

          <p className={`${t.textSecondary} max-w-md mb-10 mx-auto md:mx-0`}>
            The link might be broken, the page may have been removed,
            or it might never have existed.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/"
              className="inline-flex items-center justify-center px-7 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-all"
            >
              Go to home
            </a>

            <a
              href="/support"
              className={`inline-flex items-center justify-center px-7 py-3 ${t.border} border ${t.textSecondary} font-medium rounded-lg ${t.hover} transition-all`}
            >
              Visit support
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex justify-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/006/549/647/non_2x/404-landing-page-free-vector.jpg"
            alt="404 illustration"
            className="max-w-md w-full drop-shadow-xl animate-fadeIn"
          />
        </div>

      </div>
    </div>
  );
}

export default NotFound;