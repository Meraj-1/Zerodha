import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../contexts/themeConfig';

function Stats() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-20`}>
      <div className="container mx-auto px-6 lg:px-20">

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16">

          {/* Left Text Section */}
          <div className="lg:w-1/2 space-y-8">
            <h1 className={`text-4xl md:text-5xl font-extrabold ${t.text}`}>
              Trust with confidence
            </h1>

            <div className="space-y-6">
              <div>
                <h4 className={`text-2xl font-bold ${t.text} mb-2`}>Customer-first always</h4>
                <p className={`${t.textSecondary} leading-relaxed`}>
                  1.5+ crore customers trust Zerodha with ₹4.5+ lakh crores of equity investments
                  and contribute to 15% of daily retail exchange volumes in India.
                </p>
              </div>

              <div>
                <h4 className={`text-2xl font-bold ${t.text} mb-2`}>No spam or gimmicks</h4>
                <p className={`${t.textSecondary} leading-relaxed`}>
                  No gimmicks, spam, "gamification", or annoying push notifications. High quality apps 
                  that you use at your pace, the way you like.
                </p>
              </div>

              <div>
                <h4 className={`text-2xl font-bold ${t.text} mb-2`}>The Zerodha universe</h4>
                <p className={`${t.textSecondary} leading-relaxed`}>
                  Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups 
                  offer you tailored services specific to your needs. Do better with money.
                </p>
              </div>

              <div>
                <h4 className={`text-2xl font-bold ${t.text} mb-2`}>Do better with money</h4>
                <p className={`${t.textSecondary} leading-relaxed`}>
                  With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, 
                  but actively help you do better with your money.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image + CTA */}
          <div className="lg:w-1/2 flex flex-col items-center space-y-6">
            <img
              src="https://zerodha.com/static/images/ecosystem.png"
              alt="Zerodha Ecosystem"
              className="w-full max-w-lg rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />

            {/* CTA Links */}
            <div className="flex flex-wrap justify-center gap-6 mt-2">
              <a
                href="#"
                className={`${t.accent} font-semibold text-lg hover:underline transition`}
              >
                Explore Our Product →
              </a>
              <a
                href="#"
                className={`${t.accent} font-semibold text-lg hover:underline transition`}
              >
                Try Kite Demo →
              </a>
            </div>

            {/* Press Logos */}
            <div className="mt-8 w-full overflow-x-auto">
              <div className="flex gap-6 items-center justify-center min-w-max">
                <img
                  src="https://zerodha.com/static/images/press-logos.png"
                  alt="Companies"
                  className="h-12 object-contain"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Stats;
