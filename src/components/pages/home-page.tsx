import Navbar from "../nav-bar";
import Hero from "../hero";
import Footer from "../footer";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUpRight, ChevronLeft, ChevronRight, Disc3Icon, Github, Group, GroupIcon } from "lucide-react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "dob",
      date: "22/10/2025",
      avatar: "https://yyz2.discourse-cdn.com/flex030/user_avatar/forum.livepeer.org/dob/288/7_2.png",
      message: "Hey, thanks for reaching out and sharing this! Looks pretty nice"
    },
    {
      name: "DeFine",
      date: "23/10/2025",
      avatar: "https://pbs.twimg.com/profile_images/1970519173835943936/mhpm6-zH_400x400.jpg",
      message: "Hey Chris that is interesting, we can start with a small bounty 🙂 we are looking for really passionate people to join the project once we get more funding, passion and inventiveness is a must in what we are doing"
    },
    {
      name: "Eneche",
      date: "22/10/2025",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eneche",
      message: "This is really nice. useful for the Developer Hub"
    },
    {
      name: "speedybird",
      date: "22/10/2025",
      avatar: "https://res.cloudinary.com/dgbreoalg/image/upload/v1761318612/speedy-bird-japan_ervnaq.png",
      message: "Hey, Anything that helps the community get a better understanding of what is available across the community is a plus for newbies!"
    },
    {
      name: "Marco | stronk-tech.eth",
      date: "23/10/2025",
      avatar: "https://hub.stronk.tech/headshot.png",
      message: "i think this is going to be very useful for the FrameWorks SPE... I've got bounty requests ready to put on it already"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Efficient and Integrated Ecosystem Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-teal-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Streamlined Ecosystem Coordination</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Unify bounty discovery, contributor reputation, and payment workflows across the Livepeer ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Bounty Discovery",
                description: "Unified feed aggregating opportunities from GitHub, Discord, and forums"
              },
              {
                icon: "⭐",
                title: "Reputation System",
                description: "On-chain attestation system with multi-signal scoring for contributors"
              },
              {
                icon: "⚡",
                title: "Application Management",
                description: "Streamlined workflow from discovery to delivery with automated tracking"
              },
              {
                icon: "💰",
                title: "Payment Processing",
                description: "SAFE multisig integration for automated, secure payments"
              },
              {
                icon: "📊",
                title: "SPE Dashboards",
                description: "Powerful tools for opportunity posting and contributor management"
              },
              {
                icon: "🏆",
                title: "Leaderboards & Competition",
                description: "Seasonal leaderboards that reset to encourage new contributors"
              }
            ].map((service, index) => (
              <div key={index} className="bg-teal-900 rounded-lg p-6 hover:bg-teal-950 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl text-white">{service.icon}</div>
                  <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-white/80 text-sm">{service.description}</p>
                  </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - GIF */}
            <div className="order-2 lg:order-1">
              <div className="flex justify-center">
                <img 
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDQyNTVsOHh3eHBwb3R5ZW11N2tiN3JwcmJjZG8yeWhnc3NlanR2dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dDYZTtiW3WdHv0nZBV/giphy.gif"
                  alt="Livepeer Ecosystem Animation"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            {/* Right Column - Text Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Powering the Livepeer Ecosystem</h2>
              <p className="text-lg text-gray-600 mb-8">Our platform accelerates contributor onboarding, streamlines coordination, and drives ecosystem growth.</p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Unified Opportunity Discovery",
                    description: "Single dashboard aggregating bounties from GitHub, Discord, and forums across the ecosystem"
                  },
                  {
                    title: "On-Chain Reputation System",
                    description: "EAS-compatible attestations with multi-signal scoring to build contributor credibility"
                  },
                  {
                    title: "AI-Powered Matching",
                    description: "Smart chatbot for opportunity discovery and personalized Livepeer documentation assistance"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Tiers Section */}
      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-teal-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What the Community Says</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Hear from ecosystem members already using the platform
            </p>
          </div>
          
          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-teal-800" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-teal-800" />
            </button>

            {/* Carousel Track */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-teal-900 rounded-lg p-6 hover:bg-teal-950 transition-colors max-w-2xl mx-auto">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full bg-white"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                          <p className="text-white/60 text-xs">{testimonial.date}</p>
                        </div>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{testimonial.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-white w-8' : 'bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Empowering the Ecosystem Section */}
<section className="py-24 px-4 sm:px-6 lg:px-12 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Left Column - Text & Button */}
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Empowering the Livepeer Ecosystem</h2>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Seamlessly integrate with existing tools and workflows. Our platform connects GitHub, Discord, forums, and blockchain infrastructure to create a unified coordination layer for the entire ecosystem.
        </p>
        <Button className="bg-green-500 hover:bg-green-600 text-white px-10 py-6 text-lg">
          Join the Ecosystem
        </Button>
      </div>
    
      {/* Right Column - Integration Graphic - Larger */}
      <div className="flex justify-center">
        <div className="bg-green-100 rounded-lg p-10 shadow-lg w-full h-96 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 w-64 h-64">
            {/* GitHub */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
            <img width="48" height="48" src="https://img.icons8.com/sf-regular-filled/48/github.png" alt="github"/>
            </div>
            {/* Discord */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
              <img src="https://res.cloudinary.com/dgbreoalg/image/upload/v1761321173/discord_cdzuin.png" alt="Discord" className="w-10 h-10" />
            </div>
            {/* Forums */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
                <img width="40" height="40" src="https://img.icons8.com/ios/50/people-working-together.png" alt="people-working-together"/>
              
            </div>
            {/* Arbitrum */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
              <img src="https://res.cloudinary.com/dgbreoalg/image/upload/v1761320757/cryptocurrency_v0d2cd.png" alt="Arbitrum" className="w-12 h-12" />
            </div>
            {/* Center PeerSurf logo */}
            <div className="bg-teal-500 rounded-lg p-3 shadow-sm flex items-center justify-center">
              <img src="onyx.png" alt="Arbitrum" className="w-12 h-12" />
            </div>
            {/* SAFE */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
              <img src="https://res.cloudinary.com/dgbreoalg/image/upload/v1761321470/wallet_ijoebh.png" alt="SAFE" className="w-12 h-12" />
            </div>
            {/* EAS */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
              <img src="https://attest.org/logo2.png" alt="EAS" className="w-12 h-12" />
            </div>
            {/* Supabase */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
              <img width="48" height="48" src="https://img.icons8.com/fluency/48/supabase.png" alt="supabase"/>
            </div>
            {/* Livepeer */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
              <img width="48" height="48" src="https://img.icons8.com/external-black-fill-lafs/64/external-Livepeer-cryptocurrency-black-fill-lafs.png" alt="external-Livepeer-cryptocurrency-black-fill-lafs"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* From Idea to Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-teal-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">From Idea to Impact in Days</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Accelerate your contribution to the Livepeer ecosystem. Find opportunities, build reputation, and get paid for your work. Start your journey today!
          </p>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-6">
            Start Contributing
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
