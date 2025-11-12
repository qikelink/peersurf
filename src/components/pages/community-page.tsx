import Navbar from "../nav-bar";
import Footer from "../footer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { useRef } from 'react';
import { 
  Twitter, 
  Github, 
  MessageCircle, 
  ExternalLink, 
  Users, 
  Calendar,
  Globe,
  Youtube,
  Linkedin,
  BookOpen,
  Zap,
  Heart,
  ArrowRight,
  Star,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const CommunityPage = () => {
  // Swiper navigation refs
  const roadmapSwiperRef = useRef<any>(null);
  // Blockchain social media handles and links
  const socialPlatforms = [
    {
      name: "Twitter",
      handle: "@peersurf",
      url: "https://x.com/peersurf",
      icon: Twitter,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "Follow us for the latest updates and announcements",
      followers: "45.2K"
    },
    {
      name: "Discord",
      handle: "peersurf",
      url: "#",
      icon: MessageCircle,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      description: "Join our community discussions and get help",
      followers: "12.8K"
    },
    {
      name: "GitHub",
      handle: "peersurf",
      url: "#",
      icon: Github,
      color: "text-gray-300",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
      description: "Explore our open source code and contribute",
      followers: "2.1K"
    },
    {
      name: "YouTube",
      handle: "peersurf",
      url: "https://www.youtube.com/@peersurf",
      icon: Youtube,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "Watch tutorials, demos, and community content",
      followers: "8.5K"
    },
    {
      name: "LinkedIn",
      handle: "peersurf",
      url: "#",
      icon: Linkedin,
      color: "text-blue-300",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/20",
      description: "Connect with our professional network",
      followers: "3.2K"
    },
    {
      name: "Documentation",
      handle: "peersurf.xyz",
      url: "#",
      icon: BookOpen,
      color: "text-[#3366FF]",
      bgColor: "bg-[#3366FF]/10",
      borderColor: "border-[#3366FF]/20",
      description: "Comprehensive guides and API documentation",
      followers: "Developer Resource"
    }
  ];

  // Community events and activities
  const communityEvents = [
    {
      id: 1,
      title: "Blockchain Community Call",
      date: "Every Monday & Wed",
      time: "8pm and 6pm UTC+1",
      type: "Community Call",
      description: "Weekly Watercooler and Fireside sessions",
      platform: "Discord",
      status: "Ongoing"
    },
    {
      id: 2,
      title: "Developer Workshop: Building with Blockchain",
      date: "Dec 15, 2024",
      time: "3:00 PM EST",
      type: "Workshop",
      description: "Hands-on workshop for developers new to Blockchain",
      platform: "YouTube Live",
      status: "Upcoming"
    },
    {
      id: 3,
      title: "Governance Proposal Discussion",
      date: "Dec 20, 2024",
      time: "4:00 PM EST",
      type: "Governance",
      description: "Community discussion on upcoming governance proposals",
      platform: "Discord",
      status: "Scheduled"
    }
  ];

  // Recent community highlights
  const communityHighlights = [
   
    {
      id: 1,
      title: "Community Spotlight: Video NFT Platform Launch",
      description: "Featured project built by community member using Blockchain infrastructure",
      platform: "Discord",
      engagement: "500+ reactions",
      date: "5 days ago"
    },
    {
      id: 2,
      title: "New Developer Documentation Released",
      description: "Comprehensive guides for AI video processing and transcoding",
      platform: "GitHub",
      engagement: "150+ stars",
      date: "1 week ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3366FF]/5 via-[#3366FF]/10 to-[#ECF3FF]/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3366FF]/5 to-[#ECF3FF]/5" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#3366FF]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#ECF3FF]/10 rounded-full blur-3xl animate-float" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#3366FF] to-[#ECF3FF] bg-clip-text text-transparent">
              PeerSurf - Blockchain
            </h1>
            <Heart className="w-8 h-8 text-red-400 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of developers, creators, and innovators building the future of decentralized video infrastructure
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Users className="w-4 h-4 mr-2" />
              650+ Members
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Globe className="w-4 h-4 mr-2" />
              Global Community
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Open Source
            </Badge>
          </div>
        </div>
      </section>

      {/* Strategic Roadmap Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-background">
        <div className="relative">
          {/* Timeline Banner */}
          <div className="flex items-center justify-center my-12 relative">
            {/* Left triangle edge */}
            <div className="relative flex-1 h-1 bg-foreground/20">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-r-8 border-r-foreground/20 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
            {/* Central label with pointed sides */}
            <div className="flex items-center">
              {/* Left Point */}
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#3366FF]"></div>
              <div className="px-6 py-2 bg-gradient-to-r from-[#3366FF] to-[#2952CC]">
                <span className="text-white font-bold text-sm md:text-base uppercase tracking-wide">
                  12-Month Strategic Roadmap
                </span>
              </div>
              {/* Right Point */}
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-[#3366FF]"></div>
            </div>
            {/* Right triangle edge */}
            <div className="relative flex-1 h-1 bg-foreground/20">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-foreground/20 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>

          {/* Roadmap Carousel */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={4}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={800}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 8,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 8,
                },
              }}
              onSwiper={(swiper) => {
                roadmapSwiperRef.current = swiper;
              }}
              className="roadmap-swiper"
            >
              {[
                {
                  period: "October 2025",
                  phaseTitle: "FOUNDATION",
                  phaseSubtitle: "Launch & Validation",
                  objectives: [
                    "Ship the foundation: Launch MVP with core discovery, profiles, and applications live",
                    "Validate with fireSide: Demo to Blockchain leadership, secure \"highest impact\" recognition",
                    "Gather intel: Collect feedback from early SPEs and contributors to guide next moves"
                  ],
                  color: "from-[#3366FF] to-[#2952CC]",
                  status: "✅"
                },
                {
                  period: "November 2025",
                  phaseTitle: "CORE FEATURES",
                  phaseSubtitle: "Payments & Growth",
                  objectives: [
                    "Nail the basics: Ship automated payments, enhanced profiles, and reputation tracking",
                    "Activate the flywheel: Onboard 5-10 SPEs posting real opportunities, get 50+ talents registered",
                    "Prove it works: Close 10+ completed transactions from post to payment"
                  ],
                  color: "from-[#2952CC] to-[#1F3FA3]",
                  status: "🔄"
                },
                {
                  period: "December 2025",
                  phaseTitle: "INTELLIGENCE",
                  phaseSubtitle: "AI & Integration",
                  objectives: [
                    "Go smart: Launch AI matching algorithm connecting right talents to right opportunities",
                    "Integrate everything: Deploy Discord bot, GitHub sync, and multi-payment options",
                    "Build trust systems: Roll out comprehensive reputation, endorsements, and on-chain credentials"
                  ],
                  color: "from-[#1F3FA3] to-[#101B44]"
                },
                {
                  period: "January 2026",
                  phaseTitle: "SCALING",
                  phaseSubtitle: "Growth & Expansion",
                  objectives: [
                    "Scale the engine: Hit 50+ monthly transactions with 15+ active SPEs",
                    "Expand opportunity types: Support quick bounties, long-term roles, and grants",
                    "Own the narrative: Launch content marketing engine and referral programs"
                  ],
                  color: "from-[#101B44] to-[#0A1533]"
                },
                {
                  period: "February 2026",
                  phaseTitle: "INFRASTRUCTURE",
                  phaseSubtitle: "Default Tool",
                  objectives: [
                    "Become default infrastructure: Reach 80%+ SPE adoption as primary talent tool",
                    "Ship analytics dashboards: Give SPEs and talents data-driven insights on performance",
                    "Integrate into official docs: Get featured in Blockchain's core documentation"
                  ],
                  color: "from-[#0A1533] to-[#1F3FA3]"
                },
                {
                  period: "March 2026",
                  phaseTitle: "CRITICAL MASS",
                  phaseSubtitle: "Scale & Mobile",
                  objectives: [
                    "Hit critical mass: Achieve 75+ monthly transactions with 500+ registered talents",
                    "Launch mobile: Ship iOS and Android apps for on-the-go coordination",
                    "Build community programs: Start grants, mentorship matching, and ambassador network"
                  ],
                  color: "from-[#1F3FA3] to-[#2952CC]"
                },
                {
                  period: "April 2026",
                  phaseTitle: "GLOBAL EXPANSION",
                  phaseSubtitle: "Worldwide Reach",
                  objectives: [
                    "Go global: Add multi-language support and expand contributor base worldwide",
                    "Ship advanced tools: Deploy team formation, dispute resolution, and project management suite",
                    "Expand SPE capabilities: Launch custom templates, bulk posting, and pipeline management"
                  ],
                  color: "from-[#2952CC] to-[#3366FF]"
                },
                {
                  period: "May 2026",
                  phaseTitle: "DOMINANCE",
                  phaseSubtitle: "Ecosystem Leadership",
                  objectives: [
                    "Dominate the ecosystem: Process 80%+ of all Blockchain opportunities through PeerSurf",
                    "Launch public API: Enable third-party integrations and ecosystem extensions",
                    "Scale marketing: Partner with Web3 influencers, sponsor major events, launch YouTube series"
                  ],
                  color: "from-[#3366FF] to-[#4A7AFF]"
                },
                {
                  period: "June 2026",
                  phaseTitle: "SUSTAINABILITY",
                  phaseSubtitle: "Self-Sustaining",
                  objectives: [
                    "Hit 100+ monthly transactions: Process $1M+ total payment volume",
                    "Achieve sustainability: Implement revenue model and reach self-sustaining operations",
                    "Establish thought leadership: Publish white papers, speak at conferences, position as DAO coordination blueprint"
                  ],
                  color: "from-[#4A7AFF] to-[#5C8AFF]"
                },
                {
                  period: "Q3 2026",
                  phaseTitle: "IRREPLACEABLE",
                  phaseSubtitle: "Standard Infrastructure",
                  objectives: [
                    "Become irreplaceable: Every active Blockchain SPE uses PeerSurf as standard infrastructure",
                    "Explore multi-chain: Research expansion to 3+ adjacent ecosystems",
                    "Ship AI innovation: Deploy predictive analytics and automated skill gap identification"
                  ],
                  color: "from-[#5C8AFF] to-[#6D9AFF]"
                },
                {
                  period: "Q4 2026 & Beyond",
                  phaseTitle: "CROSS-CHAIN",
                  phaseSubtitle: "Multi-Protocol Future",
                  objectives: [
                    "Go cross-chain: Successfully deploy PeerSurf in 3+ other protocol ecosystems",
                    "Build network effects: Enable portable reputation across chains and protocols",
                    "Scale to $10M+ impact: Facilitate massive contributor earnings, explore DAO governance and Web3 talent marketplace infrastructure"
                  ],
                  color: "from-[#6D9AFF] to-[#ECF3FF]"
                }
              ].map((phase, index) => (
                <SwiperSlide key={index}>
                  <Card className="h-full hover:shadow-lg transition-shadow border-2 py-0 overflow-hidden">
                    {/* Period Badge */}
                    <div className={`bg-gradient-to-r ${phase.color} p-4 text-white`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center font-bold text-foreground text-sm">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm md:text-base">{phase.period}</p>
                          {phase.status && <span className="text-lg">{phase.status}</span>}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                          {phase.phaseTitle}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground">
                          {phase.phaseSubtitle}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {phase.objectives.map((objective, objIndex) => (
                          <li key={objIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#3366FF] mt-2"></div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {objective}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Controls - Bottom Right */}
            <div className="flex items-center justify-end gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white transition-colors"
                onClick={() => roadmapSwiperRef.current?.slidePrev()}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white transition-colors"
                onClick={() => roadmapSwiperRef.current?.slideNext()}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      

      {/* Social Media Platforms */}
      <section className=" px-4 sm:px-6 lg:px-8 bg-muted/20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect With Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow Blockchain across all platforms to stay updated and engage with our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPlatforms.map((platform) => (
            <Card 
              key={platform.name} 
              className={`hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group ${platform.borderColor} border-2`}
              onClick={() => window.open(platform.url, '_blank')}
            >
              <CardContent className="px-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${platform.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <platform.icon className={`w-6 h-6 ${platform.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">{platform.handle}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#3366FF] transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{platform.followers}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#3366FF] hover:text-white hover:bg-[#3366FF]"
                  >
                    Visit
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Events */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community events, workshops, and calls to connect with fellow developers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={event.status === 'Ongoing' ? 'default' : event.status === 'Upcoming' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {event.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{event.platform}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Highlights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recent updates and achievements from our vibrant community
          </p>
        </div>
        
        <div className="space-y-6">
          {communityHighlights.map((highlight) => (
            <Card key={highlight.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3366FF]/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-[#3366FF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{highlight.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {highlight.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{highlight.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{highlight.engagement}</span>
                      <span>{highlight.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card className="relative overflow-hidden bg-gradient-to-r from-[#3366FF]/10 to-[#ECF3FF]/10 border-[#3366FF]/20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3366FF]/5 to-[#ECF3FF]/5" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3366FF]/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#ECF3FF]/10 rounded-full blur-2xl" />
          
          <CardContent className="relative p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-8 h-8 text-[#3366FF]" />
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Join Our Community?</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building the future of decentralized video with thousands of developers worldwide
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#3366FF] to-[#2952CC] hover:from-[#2952CC] hover:to-[#1F3FA3] text-white px-8 py-3"
                onClick={() => window.open('https://discord.gg/blockchain', '_blank')}
              >
                Join Discord
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-3"
                onClick={() => window.open('https://docs.blockchain.org', '_blank')}
              >
                Read Documentation
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default CommunityPage;
