import Navbar from "../nav-bar";
import Hero from "../hero";
import Footer from "../footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default HomePage;
