import React from "react";

function Brokerage() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Open a Zerodha Account
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
            F&O trades.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition">
            <a
              href="#"
              className="inline-block text-blue-600 font-semibold text-lg mb-6 hover:underline"
            >
              Brokerage calculator →
            </a>

            <ul className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <li>
                Call & Trade and RMS auto-squareoff:
                <span className="text-gray-800 font-medium">
                  {" "}
                  ₹50 + GST per order
                </span>.
              </li>
              <li>
                Digital contract notes will be sent via e-mail.
              </li>
              <li>
                Physical contract notes (if required):
                <span className="text-gray-800 font-medium">
                  {" "}
                  ₹20 per note + courier charges
                </span>.
              </li>
              <li>
                NRI (non-PIS) accounts:
                <span className="text-gray-800 font-medium">
                  {" "}
                  0.5% or ₹100 per executed order
                </span>{" "}
                (whichever is lower).
              </li>
              <li>
                NRI (PIS) accounts:
                <span className="text-gray-800 font-medium">
                  {" "}
                  0.5% or ₹200 per executed order
                </span>{" "}
                (whichever is lower).
              </li>
              <li>
                Orders placed with debit balance:
                <span className="text-gray-800 font-medium">
                  {" "}
                  ₹40 per executed order
                </span>{" "}
                instead of ₹20.
              </li>
            </ul>
          </div>

          {/* Right CTA */}
          <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl p-10 shadow-sm border hover:shadow-md transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want a detailed breakdown?
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              View the complete list of all brokerage, statutory charges,
              and taxes applicable across segments.
            </p>

            <a
              href="#"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow"
            >
              View list of charges
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Brokerage;
