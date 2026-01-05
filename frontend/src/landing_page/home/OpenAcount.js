import React from "react";

function OpenAccount() {
  return (
    <section
      id="open-account"
      className="bg-gradient-to-r from-blue-50 to-white py-20 mt-20"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Open a Zerodha account
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday & F&O trades.
        </p>

        {/* CTA Button (External Redirect) */}
        <a
          href="https://dashboardclone.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center
                     bg-gradient-to-r from-blue-600 to-blue-700
                     text-white font-bold text-lg
                     py-3 px-10 rounded-full
                     shadow-lg hover:shadow-xl
                     hover:from-blue-700 hover:to-blue-800
                     transition-all duration-300"
          id="SIGN-UP"
        >
          Sign up for free →
        </a>

        {/* Sub text */}
        <p className="mt-4 text-sm text-gray-500">
          Takes less than 5 minutes
        </p>

      </div>
    </section>
  );
}

export default OpenAccount;
