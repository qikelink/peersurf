import Navbar from "../nav-bar";
import Hero from "../hero";
import Footer from "../footer";
import { UseCasesSection } from "../usecases";
import { Currencies } from "../currencies";
import FAQ from "../faq";


function HomePage() {
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
