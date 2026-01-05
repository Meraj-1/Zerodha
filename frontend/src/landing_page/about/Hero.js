import React from "react";

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-block border-b-4 border-blue-600 pb-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              We pioneered the discount broking model in India.
            </h2>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
              Now, we are breaking ground with our technology.
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-700 leading-relaxed">

          <div className="space-y-5 text-lg">
            <p>
              We kick-started operations on the 15th of August, 2010 with the goal
              of breaking all barriers that traders and investors face in India
              in terms of cost, support, and technology. We named the company
              <span className="font-semibold text-gray-900"> Zerodha</span>, a
              combination of Zero and “Rodha”, the Sanskrit word for barrier.
            </p>

            <p>
              Today, our disruptive pricing models and in-house technology have
              made us the{" "}
              <span className="font-semibold text-gray-900">
                largest stock broker in India
              </span>.
            </p>

            <p>
              Over{" "}
              <span className="font-semibold text-gray-900">
                1+ crore clients
              </span>{" "}
              place millions of orders every day through our powerful ecosystem
              of investment platforms, contributing over{" "}
              <span className="font-semibold text-gray-900">
                15% of all Indian retail trading volumes
              </span>.
            </p>
          </div>

          <div className="space-y-5 text-lg">
            <p>
              In addition, we run a number of popular open online educational and
              community initiatives to empower retail traders and investors.
            </p>

            <p>
              Rainmatter, our fintech fund and incubator, has invested in several
              fintech startups with the goal of growing the Indian capital
              markets.
            </p>

            <p>
              And yet, we are always up to something new every day. Catch up on
              the latest updates on our blog or see what the media is saying
              about us.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
