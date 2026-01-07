import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { themes } from "../../contexts/themeConfig";
import Hero from "./Hero";
import RightImage from "./RightImage";

function Universe() {
  const { theme } = useTheme();
  const t = themes[theme];

  return (
    <section className={t.bg}>
      
      {/* Hero */}
      <Hero />

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 space-y-28 mt-24">

        <RightImage
          imageURL="https://zerodha.com/static/images/products-kite.png"
          productName="Kite"
          productDescription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
          learnmore="Learn more →"
        />

        <RightImage
          imageURL="https://zerodha.com/static/images/products-console.png"
          productName="Console"
          productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."
          learnmore="Learn more →"
        />

        <RightImage
          imageURL="https://zerodha.com/static/images/products-coin.png"
          productName="Coin"
          productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
          learnmore="Learn more →"
        />

        <RightImage
          imageURL="https://zerodha.com/static/images/products-kiteconnect.png"
          productName="Kite Connect API"
          productDescription="Build powerful trading platforms and experiences with our super-simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our client base."
          learnmore="Learn more →"
        />

        <RightImage
          imageURL="https://zerodha.com/static/images/varsity-products.png"
          productName="Varsity"
          productDescription="An easy-to-understand collection of stock market lessons with in-depth coverage and illustrations. Learn at your own pace on mobile and web."
          learnmore="Learn more →"
        />

      </div>

      {/* Bottom CTA */}
      <div className={`${t.bgSecondary} mt-32 py-16 px-6 text-center`}>
        <h6 className={`text-xl md:text-2xl font-semibold ${t.text} max-w-3xl mx-auto`}>
          Want to know more about our technology stack?
          <br className="hidden md:block" />
          Check out the{" "}
          <a
            href="#"
            className={`${t.accent} hover:underline font-medium`}
          >
            Zerodha.tech
          </a>{" "}
          blog.
        </h6>
      </div>

    </section>
  );
}

export default Universe;