import React from "react";

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Title */}
        <h3 className="text-3xl md:text-5xl font-extrabold text-blue-600 mb-6">
          Technology
        </h3>

        {/* Subtitle */}
        <h5 className="text-lg md:text-2xl font-medium text-gray-700 mb-6">
          Sleek, modern, and intuitive trading platforms
        </h5>

        {/* CTA */}
        <p className="text-gray-600 text-lg">
          Check out our{" "}
          <a
            href="#"
            className="text-blue-600 font-semibold hover:underline"
          >
            investment offerings →
          </a>
        </p>

      </div>
    </section>
  );
}

export default Hero;

