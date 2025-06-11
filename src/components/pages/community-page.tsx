import { motion } from "framer-motion";
import Gallery from "../gallery";

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

function CommunityPage() {
  return (
    <>
      {/* Gallery Section */}
      <motion.section
        className="section gradient-right"
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={sectionVariants}
      >
        <Gallery />
      </motion.section>
    </>
  );
}

export default CommunityPage;
