import React from "react";

function RightImage({ imageURL, productName, productDescription, learnmore }) {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <div className="text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {productName}
          </h3>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {productDescription}
          </p>

          <a
            href="#"
            className="inline-flex items-center text-blue-600 font-semibold hover:underline"
          >
            {learnmore || "Learn more →"}
          </a>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={imageURL}
            alt={productName}
            className="w-full max-w-xl rounded-xl shadow-md hover:shadow-xl transition"
          />
        </div>

      </div>
    </section>
  );
}

export default RightImage;

