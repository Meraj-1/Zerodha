import React from 'react';
import Education from './Education';
import Stats from './Stats';
import OpenAccount from './OpenAcount';
import Hero from './Hero';
import Pricing from './Pricing';

function Homepage() {
  return (
    <>
      <Hero />
      <Stats />
      <Pricing />
      <Education />
      <OpenAccount />
    </>
  );
}

export default Homepage;