import React from "react";
import LandingHero from "./LandingHero";
import LandingNav from "./LandingNav";
function LandingPage() {
  return (
    <div>
      <LandingNav hasButtons={true}></LandingNav>
      <LandingHero></LandingHero>
    </div>
  );
}

export default LandingPage;
