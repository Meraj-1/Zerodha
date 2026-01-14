import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import { ArrowRight } from "lucide-react";

const TICKET_CATEGORIES = [
  {
    title: "Account Opening",
    items: [
      "Trading FAQs",
      "Kite",
      "Margin",
      "Product & Order Types",
      "Corporate Actions",
      "Kite Features",
    ],
  },
  {
    title: "Your Zerodha Account",
    items: [
      "Login Credentials",
      "Profile",
      "Account Modification",
      "CMR & DP ID",
      "Nomination",
      "Transfer & Conversion",
    ],
  },
  {
    title: "Trading & Markets",
    items: [
      "Getting Started",
      "Online Trading",
      "Offline Trading",
      "Charges",
      "Company / Partnership / HUF",
      "NRI",
    ],
  },
  {
    title: "Funds",
    items: ["Fund Withdrawal", "Adding Funds", "Bank Accounts", "eMandate"],
  },
  {
    title: "Console",
    items: [
      "IPO",
      "Portfolio",
      "Fund Statement",
      "Profile",
      "Reports",
      "Referral Program",
    ],
  },
  {
    title: "Coin",
    items: [
      "Mutual Funds & Coin",
      "Coin App",
      "Coin Web",
      "Transactions & Reports",
      "National Pension Scheme (NPS)",
    ],
  },
];

function CreateTicket() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={`${t.bgSecondary} py-20`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <header className="mb-14 max-w-2xl">
          <h2 className={`text-3xl md:text-4xl font-extrabold ${t.text} mb-3`}>
            Create a support ticket
          </h2>
          <p className={`${t.textSecondary} text-lg`}>
            Choose a category below to find relevant help topics or raise a ticket.
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TICKET_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className={`${t.bg} rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
            >
              <h3 className={`text-xl font-bold ${t.accent} mb-5`}>
                {category.title}
              </h3>

              <ul className={`space-y-3 ${t.textSecondary}`}>
                {category.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`group inline-flex items-center gap-2 ${t.hover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                    >
                      <span>{item}</span>
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CreateTicket;
