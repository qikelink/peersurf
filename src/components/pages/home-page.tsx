import Navbar from "../nav-bar";
import Hero from "../hero";
import Footer from "../footer";
import { Button } from "../ui/button";
import { ArrowUpRight, Heart, MessageCircle, Twitter, Facebook, Instagram } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/swiper-bundle.css';
// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import CountUp from 'react-countup';

// Custom styles for testimonial swiper
const swiperStyles = `
  .testimonial-swiper {
    overflow: hidden !important;
    width: 100%;
  }
  
  .testimonial-swiper .swiper-wrapper {
    transition-timing-function: linear !important;
  }
  
  .testimonial-swiper .swiper-slide {
    width: 320px !important;
    flex-shrink: 0;
  }
  
  @media (max-width: 1024px) {
    .testimonial-swiper .swiper-slide {
      width: 300px !important;
    }
  }
  
  @media (max-width: 768px) {
    .testimonial-swiper .swiper-slide {
      width: 280px !important;
    }
  }
  
  .logo-swiper {
    overflow: hidden !important;
    width: 100%;
  }
  
  .logo-swiper .swiper-wrapper {
    transition-timing-function: linear !important;
    display: flex !important;
    align-items: center !important;
    will-change: transform !important;
  }
  
  .logo-swiper .swiper-slide {
    width: auto !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .logo-swiper.swiper-loop > .swiper-wrapper {
    transition-timing-function: linear !important;
  }
`;

const HomePage = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, []);

  const testimonials = [
    {
      name: "dob",
      handle: "@dob",
      date: "22/10/2025",
      time: "08:10 PM",
      avatar: "https://yyz2.discourse-cdn.com/flex030/user_avatar/forum.livepeer.org/dob/288/7_2.png",
      message: "Hey, thanks for reaching out and sharing this! Looks pretty nice ✨",
      platform: "twitter" as const,
      likes: "1k",
      comments: "500"
    },
    {
      name: "DeFine",
      handle: "@define",
      date: "23/10/2025",
      time: "09:15 PM",
      avatar: "https://pbs.twimg.com/profile_images/1970519173835943936/mhpm6-zH_400x400.jpg",
      message: "Hey Chris that is interesting, we can start with a small bounty 🙂 we are looking for really passionate people to join the project once we get more funding, passion and inventiveness is a must in what we are doing",
      platform: "facebook" as const,
      likes: "1k",
      comments: "500"
    },
    {
      name: "Eneche",
      handle: "@eneche",
      date: "22/10/2025",
      time: "07:30 PM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eneche",
      message: "This is really nice. useful for the Developer Hub 🤩",
      platform: "instagram" as const,
      likes: "1k",
      comments: "500"
    },
    {
      name: "speedybird",
      handle: "@speedybird",
      date: "22/10/2025",
      time: "06:45 PM",
      avatar: "https://res.cloudinary.com/dgbreoalg/image/upload/v1761318612/speedy-bird-japan_ervnaq.png",
      message: "Hey, Anything that helps the community get a better understanding of what is available across the community is a plus for newbies!",
      platform: "twitter" as const,
      likes: "1k",
      comments: "500"
    },
    {
      name: "Marco | stronk-tech.eth",
      handle: "@marco",
      date: "23/10/2025",
      time: "10:20 PM",
      avatar: "https://hub.stronk.tech/headshot.png",
      message: "i think this is going to be very useful for the FrameWorks SPE... I've got bounty requests ready to put on it already 😊",
      platform: "facebook" as const,
      likes: "1k",
      comments: "500"
    },
    {
      name: "Jason || everest-node.eth",
      handle: "@everest-node.eth",
      date: "23/10/2025",
      time: "10:45 PM",
      avatar: "https://cdn.discordapp.com/avatars/851029949056942091/a_3a57957301e926615dd5502cd5611f1e.webp",
      message: "Great project by the way. In there past we had bounty board in github and it was quite a hassle managing the communication and coordination. This is a step in the right direction.",
      platform: "twitter" as const,
      likes: "1k",
      comments: "500"
    }
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      default:
        return <Twitter className="w-4 h-4" />;
    }
  };

  const formatMessage = (message: string) => {
    return message.split(' ').map((word, index) => {
      if (word.startsWith('@')) {
        return (
          <span key={index} className="text-blue-400">
            {word}{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  // Create extended testimonials array for infinite scroll
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Company logos data
  const companyLogos = [
    { name: 'LisarStake', className: 'text-gray-900 dark:text-gray-100 font-bold italic tracking-tight text-lg md:text-xl lg:text-lg', id: 1 },
    { name: 'Gwid.io', className: 'text-gray-700 dark:text-gray-300 font-light uppercase tracking-widest text-sm md:text-base lg:text-lg', id: 2 },
    { name: 'Framework', className: 'text-gray-700 dark:text-gray-300 font-light italic font-cursive tracking-wide text-base md:text-lg lg:text-xl', id: 3 },
    { name: 'Cedra', className: 'text-gray-700 dark:text-gray-300 font-light italic font-cursive tracking-wide text-base md:text-lg lg:text-xl', id: 4 },
    { name: 'AI SPE', className: 'text-gray-700 dark:text-gray-300 font-light italic font-cursive tracking-wide text-base md:text-lg lg:text-xl', id: 5 }
    
  ];

  // Create extended logos array for infinite scroll (repeat many times for seamless continuous scrolling)
  const extendedLogos = [...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos];

  return (
    <>
    <style>{swiperStyles}</style>
    <Navbar />
    <div className="min-h-screen text-foreground bg-background overflow-x-hidden">
      
      
      {/* Hero Section */}
      <Hero />

      {/* Metrics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-background overflow-x-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto w-full">
          {/* Company Logos Row - Scrolling Carousel */}
          <div className="mb-16 overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={60}
              slidesPerView="auto"
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                reverseDirection: false,
              }}
              speed={4000}
              loop={true}
              loopAdditionalSlides={20}
              allowTouchMove={false}
              className="logo-swiper"
            >
              {extendedLogos.map((company, index) => (
                <SwiperSlide key={`logo-${company.id}-${index}`} className="!w-auto">
                  <div className="text-center px-4">
                    <div className={`whitespace-nowrap ${company.className}`}>
                      {company.name}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                value: 50,
                prefix: '',
                suffix: '+',
                description: 'Talents Onboarded'
              },
              {
                value: 4,
                prefix: '',
                suffix: '+',
                description: 'Sponsors Actively Posting Bounties'
              },
              {
                value: 200,
                prefix: '$',
                suffix: '+',
                description: 'Total Contest Amount Posted'
              },
              {
                value: 100,
                prefix: '',
                suffix: '%',
                description: 'Average uptime'
              }
            ].map((metric, index) => (
              <div
                key={index}
                className="bg-[#f0f9f7] dark:bg-green-900/10 rounded-xl p-8 md:p-10 text-center shadow-lg hover:shadow-xl transition-shadow relative"
              >
                {/* Real-time indicator dot */}
                <div className="absolute top-3 right-3 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                  </div>
                </div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  <CountUp
                    key={`countup-${index}-${metric.value}`}
                    start={0}
                    end={metric.value}
                    duration={2.5}
                    decimals={0}
                    separator=","
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    enableScrollSpy={true}
                    scrollSpyOnce={false}
                    redraw={true}
                  />
                </div>
                <div className="text-xs md:text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-[200px] mx-auto">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Efficient and Integrated Ecosystem Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 overflow-x-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto bg-green-50 dark:bg-green-900/20 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 ">Streamlined Ecosystem Coordination</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Unify bounty discovery, contributor reputation, and payment workflows across the Livepeer ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Opportunity Feed",
                description: "Unified feed aggregating opportunities from GitHub, Discord, and forums"
              },
              {
                icon: "⭐",
                title: "Proof-of-Impact",
                description: "On-chain attestation system with multi-signal scoring for contributors"
              },
              {
                icon: "⚡",
                title: "Application Management",
                description: "Streamlined workflow from discovery to delivery with automated tracking"
              },
              {
                icon: "💰",
                title: "Instant Payouts",
                description: "SAFE multisig integration for automated, secure payments"
              },
              {
                icon: "📊",
                title: "Sponsor Dashboards",
                description: "Powerful tools for opportunity posting and contributor management"
              },
              {
                icon: "🏆",
                title: "Impact Ranking",
                description: "Seasonal leaderboards that reset to encourage new contributors"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors shadow-sm backdrop-blur-sm cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{service.icon}</div>
                  <ArrowUpRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                    </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{service.description}</p>
                  </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-background overflow-x-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto p-12 rounded-2xl border border-green-200 dark:border-green-900/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - GIF */}
            <div className="order-2 lg:order-1">
              <div className="flex justify-center">
                <img 
                  src="https://res.cloudinary.com/dgbreoalg/image/upload/v1761478393/G25-NGjW8AAz_H1_rc1jdx.jpg"
                  alt="Livepeer Ecosystem Animation"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            {/* Right Column - Text Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Powering the Livepeer Ecosystem By</h2>
              <p className=" text-muted-foreground mb-8">Our platform accelerates contributor onboarding, streamlines coordination, and drives ecosystem growth.</p>
              
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
                      <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Testimonials Section */}
      <section className="py-16 pb-20 px-4 sm:px-6 lg:px-12 overflow-x-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto rounded-2xl py-12 shadow-lg text-gray-900 dark:text-gray-100 bg-[#00796B] dark:bg-green-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What the Community Says</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Hear from ecosystem members already using the platform
            </p>
          </div>
          
          {/* Dual Row Swiper Carousel */}
          <div className="space-y-3">
            {/* Row 1 - Left to Right */}
            <div className="overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView="auto"
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  reverseDirection: false,
                }}
                speed={6000}
                loop={true}
                allowTouchMove={false}
                className="testimonial-swiper"
              >
                {extendedTestimonials.map((testimonial, index) => (
                  <SwiperSlide key={`row1-${index}`} className="!w-80">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow h-full">
                    {/* Social Media Icon */}
                    <div className="flex justify-end mb-2">
                      <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getSocialIcon(testimonial.platform)}
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex items-start gap-2 mb-2">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xs">{testimonial.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{testimonial.handle}</p>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <div className="mb-2">
                      <p className="text-gray-800 dark:text-gray-200 text-xs leading-relaxed line-clamp-3">
                        {formatMessage(testimonial.message)}
                      </p>
                    </div>
                    
                    {/* Engagement Metrics */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{testimonial.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{testimonial.comments}</span>
                        </div>
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 text-xs">
                        {testimonial.time} | {testimonial.date}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Row 2 - Right to Left (offset slightly) - Hidden on mobile */}
            <div className="ml-0 md:ml-8 hidden md:block overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView="auto"
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  reverseDirection: true,
                }}
                speed={6000}
                loop={true}
                allowTouchMove={false}
                className="testimonial-swiper"
              >
                {extendedTestimonials.map((testimonial, index) => (
                  <SwiperSlide key={`row2-${index}`} className="!w-80">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow h-full">
                      {/* Social Media Icon */}
                      <div className="flex justify-end mb-2">
                        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {getSocialIcon(testimonial.platform)}
                        </div>
                      </div>
                      
                      {/* User Info */}
                      <div className="flex items-start gap-2 mb-2">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xs">{testimonial.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{testimonial.handle}</p>
                        </div>
                      </div>
                      
                      {/* Message */}
                      <div className="mb-2">
                        <p className="text-gray-800 dark:text-gray-200 text-xs leading-relaxed line-clamp-3">
                          {formatMessage(testimonial.message)}
                        </p>
                      </div>
                      
                      {/* Engagement Metrics */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{testimonial.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{testimonial.comments}</span>
                          </div>
                        </div>
                        <div className="text-gray-400 dark:text-gray-500 text-xs">
                          {testimonial.time} | {testimonial.date}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      

      {/* From Idea to Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 overflow-x-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto text-center bg-green-50 dark:bg-green-900/20 rounded-2xl py-12 shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">From Idea to Impact in Days</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Accelerate your contribution to the Livepeer ecosystem. Find opportunities, build reputation, and get paid for your work. Start your journey today!
          </p>
          <Button className="bg-[#00796B]  dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-6">
            Start Contributing
          </Button>
        </div>
      </section>

      <Footer />
    </div>
    </>
    
  );
};

export default HomePage;
