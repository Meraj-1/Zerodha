import React from "react";
import Hero from "./Hero";
import Brokerage from "./Brokerage";

function PricingPage() {
  return (
    <main role="main">
      {/* Pricing Hero */}
      <Hero />

      {/* Brokerage & Charges */}
      <Brokerage />
    </main>
  );
}

export default PricingPage;
