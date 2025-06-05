import { motion } from "framer-motion";
import Navbar from "../nav-bar";
import Hero from "../hero";
import { Footer } from "../footer";
import FAQ from "../faq";

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
        <Hero />
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
        {" "}
        <Footer />
      </motion.section>
    </>
  );
}

export default HomePage;
