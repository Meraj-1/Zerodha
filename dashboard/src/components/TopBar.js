import React from "react";
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../contexts/themeConfig';

import Menu from "./Menu";

const TopBar = () => {
  const { theme } = useTheme();
  const t = themes[theme];
  
  return (
    <div className={`topbar-container ${t.bg} ${t.border} border-b`}>
      <div className="indices-container">
        <div className="nifty">
          <p className={`index ${t.text}`}>NIFTY 50</p>
          <p className="index-points profit text-green-500">{100.2} </p>
          <p className="percent"> </p>
        </div>
        <div className="sensex">
          <p className={`index ${t.text}`}>SENSEX</p>
          <p className="index-points profit text-green-500">{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;