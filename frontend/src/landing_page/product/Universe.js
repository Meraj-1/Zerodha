import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import Hero from "./Hero";
import RightImage from "./RightImage";

const PRODUCTS = [
  {
    imageURL: "https://zerodha.com/static/images/products-kite.png",
    productName: "Kite",
    productDescription:
      "Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.",
  },
  {
    imageURL: "https://zerodha.com/static/images/products-console.png",
    productName: "Console",
    productDescription:
      "The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations.",
  },
  {
    imageURL: "https://zerodha.com/static/images/products-coin.png",
    productName: "Coin",
    productDescription:
      "Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices.",
  },
  {
    imageURL: "https://zerodha.com/static/images/products-kiteconnect.png",
    productName: "Kite Connect API",
    productDescription:
      "Build powerful trading platforms and experiences with our super-simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our client base.",
  },
  {
    imageURL: "https://zerodha.com/static/images/varsity-products.png",
    productName: "Varsity",
    productDescription:
      "An easy-to-understand collection of stock market lessons with in-depth coverage and illustrations. Learn at your own pace on mobile and web.",
  },
];

function Universe() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={t.bg}>

      {/* Hero */}
      <Hero />

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 mt-28 space-y-32">
        {PRODUCTS.map((product) => (
          <RightImage
            key={product.productName}
            imageURL={product.imageURL}
            productName={product.productName}
            productDescription={product.productDescription}
            learnmore="Learn more"
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <section className={`${t.bgSecondary} mt-36 py-20 px-6`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>
            Want to know more about our technology stack?
          </h2>

          <p className={`${t.textSecondary} text-lg mt-4`}>
            Dive deeper into our engineering culture on{" "}
            <a
              href="#"
              className={`${t.accent} font-semibold hover:underline`}
            >
              Zerodha.tech
            </a>
            .
          </p>
        </div>
      </section>

    </section>
  );
}

export default Universe;
