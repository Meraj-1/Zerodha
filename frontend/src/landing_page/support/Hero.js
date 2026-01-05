import React from "react";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-600 py-14">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

        {/* Left Content */}
        <div>
          <h4 className="text-white text-3xl md:text-4xl font-extrabold mb-3">
            Support Portal
          </h4>

          <p className="text-blue-100 text-lg md:text-xl max-w-md">
            Search for answers or browse help topics to easily create and manage
            your support tickets.
          </p>
        </div>

        {/* CTA */}
        <div>
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-700 text-lg font-semibold rounded-lg shadow hover:bg-blue-50 transition"
          >
            Track tickets →
          </a>
        </div>

      </div>
    </section>
  );
}

export default Hero;
