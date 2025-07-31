import Navbar from "../nav-bar";
import Hero from "../hero";
import Footer from "../footer";
import { UseCasesSection } from "../usecases";
import { Currencies } from "../currencies";
import FAQ from "../faq";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';


function HomePage() {
  const { authenticated, ready } = usePrivy();
  const navigate = useNavigate();

  // No automatic redirect - users can stay on home page even when authenticated

  return (
    <div className="lg:px-20">
      <Navbar />
      <Hero />
      <Currencies />
      <UseCasesSection />
      <FAQ/>
      <Footer/>
    </div>
  );
}

export default HomePage;
