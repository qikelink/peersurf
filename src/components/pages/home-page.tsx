import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../nav-bar";
import Hero from "../hero";
import { Footer } from "../footer";
import FAQ from "../faq";
import ClipsPage from "../clips";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const viewportSettings = {
  once: true,
  margin: "-100px 0px",
  amount: "some" as const,
};

function HomePage() {
  const [showClips, setShowClips] = useState(false);

  const handleSeeClips = () => {
    setShowClips(true);
  };

  const handleBackToHome = () => {
    setShowClips(false);
  };

  // Show clips page (hides all other sections)
  if (showClips) {
    return (
      <motion.section
        className="section gradient-right max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={sectionVariants}
      >
        <ClipsPage onBack={handleBackToHome} />
      </motion.section>
    );
  }

  // Show normal homepage with all sections
  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="section gradient-right max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={sectionVariants}
      >
        <Navbar />
        <Hero onSeeClips={handleSeeClips} />
      </motion.section>

      <motion.section
        className="section gradient-right max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={sectionVariants}
      >
        <FAQ />
      </motion.section>

      <motion.section
        className="section gradient-right max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={sectionVariants}
      >
        <Footer />
      </motion.section>
    </>
  );
}

export default HomePage;
