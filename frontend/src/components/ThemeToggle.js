import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {Sun, Moon} from "lucide-react"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className=""
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  );
};

export default ThemeToggle;