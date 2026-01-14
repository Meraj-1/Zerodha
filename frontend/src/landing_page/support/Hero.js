import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import { ArrowRight } from "lucide-react";

function Hero() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section
      className="py-16"
      style={{
        background: `linear-gradient(90deg, ${t.primary}, ${t.secondary})`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left"
        >
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Support Portal
            </h1>

            <p className="text-white/90 text-lg md:text-xl">
              Find answers fast or browse help topics to create, manage, and
              track your support tickets with ease.
            </p>
          </div>

          {/* CTA */}
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-lg font-semibold rounded-xl shadow-lg
                         hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-white transition"
              style={{ color: t.primary }}
            >
              Track Tickets
              <ArrowRight size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
