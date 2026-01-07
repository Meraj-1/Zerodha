import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../contexts/themeConfig';

function Education() {
  const {theme} = useTheme();
  const t = themes[theme];

  return (
    <div className={`flex flex-col ${t.bgSecondary}  md:flex-row`}> {/* Main container */}
      <div className="flex-shrink-0 justify-center w-full md:w-1/2"> {/* Image container */}
        <img
          className="mt:x md:pl-20"
          src="https://zerodha.com/static/images/index-education.svg"
          alt="Free and open market education"
        />
      </div>
      <div className="flex-grow md:p-8 sm:mt-20"> {/* Content container */}
        <h3 className={` ${t.text} text-2xl font-medium mb-4`}>Free and open market education</h3>
        <p className={`${t.textSecondary} mb-4`}>
          Varsity, the largest online stock market education book in the world
          covering everything from the basics to advanced trading.
          <a href="#" className={`${t.accent} hover:underline mx-2 md:mx-5`}>
        Varsity →
        </a>
        </p>
    
        <div className="mt-4"> {/* TradingQ&A section */}
          <p className={`${t.textSecondary} mb-2`}>
            TradingQ&A, the most active trading and investment community in India
            for all your market related queries.
            <a href="#" className={`${t.accent} hover:underline mx-2 md:mx-5`}>
            TradingQ&A →
          </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Education;