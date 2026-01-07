import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { themes } from "../contexts/themeConfig";

function Footer() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-full mx-auto px-6 py-12">
        
        {/* Top Section */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b ${t.border} pb-10`}>
          
          {/* Logo & Copyright */}
          <div className="lg:col-span-2">
            <img
              src="https://zerodha.com/static/images/logo.svg"
              alt="Zerodha Logo"
              className="w-36 mb-6"
            />
            <p className="text-sm leading-relaxed">
              © 2010 – 2024, Zerodha Broking Ltd.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Company */}
          <div>
            <h5 className={`${t.text} font-medium mb-4`}>Company</h5>
            <ul className="space-y-2">
              {[
                "About",
                "Products",
                "Pricing",
                "Referral Program",
                "Careers",
                "Zerodha.tech",
                "Press & media",
                "Zerodha Cares (CSR)",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className={`${t.hover} transition`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className={`${t.text} font-medium mb-4`}>Support</h5>
            <ul className="space-y-2">
              {[
                "Contact Us",
                "Support Portal",
                "Z-Connect Blog",
                "List of Charges",
                "Downloads & Resources",
                "Market Overview",
                "How to file a complaint?",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className={`${t.hover} transition`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h5 className={`${t.text} font-medium mb-4`}>Account</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`${t.hover} transition`}>
                  Open an account
                </a>
              </li>
              <li>
                <a href="#" className={`${t.hover} transition`}>
                  Fund transfer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Section */}
        <div className="pt-10 space-y-4 text-xs leading-relaxed">
          <p>
            Zerodha Broking Ltd.: Member of NSE, BSE & MCX. SEBI Registration
            no.: INZ000031633. CDSL/NSDL: Depository services through Zerodha
            Broking Ltd. SEBI Registration no.: IN-DP-431-2019.
          </p>

          <p>
            Procedure to file a complaint on SEBI SCORES: Register on the SCORES
            portal with mandatory details such as Name, PAN, Address, Mobile
            Number, and Email ID.
          </p>

          <p>
            Investments in securities market are subject to market risks; read
            all related documents carefully before investing.
          </p>

          <p>
            <span className={`${t.text} font-medium`}>Attention Investors:</span>
            <br />
            1. Stock brokers can accept securities as margins only via pledge in
            the depository system.
            <br />
            2. Update your email and mobile number to receive OTPs directly.
            <br />
            3. Check your consolidated account statement issued by NSDL/CDSL
            every month.
          </p>

          <p>
            Prevent unauthorized transactions in your account. KYC is a
            one-time process when dealing in securities markets through SEBI
            registered intermediaries.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;