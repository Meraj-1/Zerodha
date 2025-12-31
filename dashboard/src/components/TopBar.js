import React from "react";
import { useTheme } from '../context/ThemeContext';

import Menu from "./Menu";

const TopBar = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`topbar-container ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="indices-container">
        <div className="nifty">
          <p className={`index ${theme === 'dark' ? 'text-white' : ''}`}>NIFTY 50</p>
          <p className={`index-points profit ${theme === 'dark' ? 'text-green-400' : ''}`}>{100.2} </p>
          <p className="percent"> </p>
        </div>
        <div className="sensex">
          <p className={`index ${theme === 'dark' ? 'text-white' : ''}`}>SENSEX</p>
          <p className={`index-points profit ${theme === 'dark' ? 'text-green-400' : ''}`}>{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
