import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { themes } from "../contexts/themeConfig";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {theme} = useTheme();
  const t = themes[theme];
  
  return (
    <div className={`${t.bg} ${t.border} border-b-2`}>
      <div className="container mx-auto flex items-center justify-between p-6">
        <Link to="/">
          <img
            src="https://zerodha.com/static/images/logo.svg"
            alt="Logo"
            className="h-5"
          />
        </Link> 
        <ul className={`hidden sm:flex items-center gap-10 ${t.text}`}>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <a
              href="https://dashboardclone.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${t.hover} font-bold`}
            >
              Sign Up
            </a>
          </li>
          <li>
            <NavLink to="/Pricing" className={`${t.hover} font-bold`}>Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/About" className={`${t.hover} font-bold`}>About</NavLink>
          </li>
          <li>
            <NavLink to="/Product" className={`${t.hover} font-bold`}>Product</NavLink>
          </li>
          <li>
            <NavLink
              className={`${t.hover} font-bold`}
              to="/Support">
              Support
            </NavLink>
          </li>
        </ul>
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <img
            onClick={() => setVisible(true)}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYftBHUiUU-9L8NljTc4AACBVPdqzDLYrwKWCjddKNBHRb_bs-02eXzHUa07cKQTyWjSc&usqp=CAU"
            className="w-6 cursor-pointer"
            alt="Menu"
          />
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 h-full ${t.bg} transition-all ${
          visible ? "w-64" : "w-0"
        } overflow-hidden shadow-lg`}
      >
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xl font-semibold ${t.text}`}>Menu</span>
            <img
              onClick={() => setVisible(false)}
              src="https://icons.veryicon.com/png/o/miscellaneous/medium-thin-linear-icon/cross-23.png"
              className="h-6 cursor-pointer"
              alt="Close"
            />
          </div>
          <NavLink onClick={() => setVisible(false)} to="/" className={`py-2 ${t.border} border-b font-bold ${t.text}`}>Home</NavLink>
          <NavLink onClick={() => setVisible(false)} to="/Pricing" className={`py-2 ${t.border} border-b font-bold ${t.text}`}>Pricing</NavLink>
          <NavLink onClick={() => setVisible(false)} to="/About" className={`py-2 ${t.border} border-b font-bold ${t.text}`}>About</NavLink>
          <NavLink onClick={() => setVisible(false)} to="/Product" className={`py-2 ${t.border} border-b font-bold ${t.text}`}>Product</NavLink>
          <NavLink onClick={() => setVisible(false)} to="/Support" className={`py-2 ${t.border} border-b font-bold ${t.text}`}>Support</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;