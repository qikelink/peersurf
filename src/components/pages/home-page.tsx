import Navbar from "../nav-bar";
import Hero from "../hero";
import Footer from "../footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default HomePage;
