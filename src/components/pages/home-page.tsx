import Navbar from "../nav-bar";
import Hero from "../hero";
import Footer from "../footer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowRight, TrendingUp, Users, DollarSign, Zap, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoCarousel from "../ui/logo-carousel";

const HomePage = () => {
  const navigate = useNavigate();

  // Mock data for ecosystem metrics
  const ecosystemMetrics = [
    { label: "Livepeer Price", value: "$12.45", change: "+5.2%", icon: TrendingUp },
    { label: "Total Value Locked", value: "$89.2M", change: "+12.8%", icon: DollarSign },
    { label: "Active Projects", value: "156", change: "+8", icon: Zap },
    { label: "Community Members", value: "12.4K", change: "+234", icon: Users },
  ];

  // Mock data for latest news
  const latestNews = [
    {
      id: 1,
      title: "New Video Streaming Protocol Launched",
      excerpt: "Revolutionary decentralized video infrastructure now live on mainnet",
      source: "Forum",
      time: "2 hours ago",
      author: "Livepeer Team",
      avatar: "https://altcoinsbox.com/wp-content/uploads/2023/04/livepeer-logo.png"
    },
    {
      id: 2,
      title: "Community Governance Proposal #42",
      excerpt: "Proposal to increase staking rewards for active validators",
      source: "X (Twitter)",
      time: "4 hours ago",
      author: "@livepeer_dev",
      avatar: "https://pbs.twimg.com/profile_images/1234567890/avatar.jpg"
    },
    {
      id: 3,
      title: "Developer Spotlight: Video NFT Platform",
      excerpt: "How one team built a complete video NFT marketplace using Livepeer",
      source: "Blog",
      time: "1 day ago",
      author: "Community",
      avatar: "https://via.placeholder.com/40"
    }
  ];

  // Mock data for spotlight projects
  const spotlightProjects = [
    {
      id: 1,
      name: "Cloud SPE",
      description: "Decentralized video NFT marketplace",
      logo: "https://picsum.photos/60/60?random=1",
      status: "Funded",
      amount: "$25,000",
      contributors: 12
    },
    {
      id: 2,
      name: "Stream.place",
      description: "Community-governed streaming platform",
      logo: "https://picsum.photos/60/60?random=2",
      status: "Active",
      amount: "$18,500",
      contributors: 8
    },
    {
      id: 3,
      name: "Lisarstake",
      description: "Professional live streaming toolkit",
      logo: "https://picsum.photos/60/60?random=3",
      status: "Completed",
      amount: "$32,000",
      contributors: 15
    },
    {
      id: 4,
      name: "Gwid.io",
      description: "DeFi integration for video creators",
      logo: "https://picsum.photos/60/60?random=4",
      status: "Funded",
      amount: "$28,500",
      contributors: 11
    }
  ];

  // Logo carousel data - using real crypto project logos
  const projectLogos = [
    { id: 1, src: "https://cryptologos.cc/logos/stellar-xlm-logo.png?v=040", alt: "Stellar", name: "Stellar" },
    { id: 2, src: "https://cryptologos.cc/logos/internet-computer-icp-logo.png?v=040", alt: "Internet Computer", name: "Internet Computer" },
    { id: 3, src: "https://cryptologos.cc/logos/unus-sed-leo-leo-logo.png?v=040", alt: "UNUS SED LEO", name: "UNUS SED LEO" },
    { id: 4, src: "https://cryptologos.cc/logos/the-graph-grt-logo.png?v=040", alt: "The Graph", name: "The Graph" },
    { id: 5, src: "https://cryptologos.cc/logos/jupiter-ag-jup-logo.png?v=040", alt: "Jupiter", name: "Jupiter" },
    { id: 6, src: "https://cryptologos.cc/logos/reserve-rights-rsr-logo.png?v=040", alt: "Reserve Rights", name: "Reserve Rights" },
    { id: 7, src: "https://cryptologos.cc/logos/harmony-one-logo.png?v=040", alt: "Harmony", name: "Harmony" },
    { id: 8, src: "https://cryptologos.cc/logos/grin-grin-logo.png?v=040", alt: "Grin", name: "Grin" },
    { id: 9, src: "https://cryptologos.cc/logos/tellor-trb-logo.png?v=040", alt: "Tellor", name: "Tellor" },
    { id: 10, src: "https://cryptologos.cc/logos/arweave-ar-logo.png?v=040", alt: "Arweave", name: "Arweave" },
    { id: 11, src: "https://cryptologos.cc/logos/audius-audio-logo.png?v=040", alt: "Audius", name: "Audius" },
    { id: 12, src: "https://cryptologos.cc/logos/basic-attention-token-bat-logo.png?v=040", alt: "Basic Attention Token", name: "BAT" },
  ];

  // Mock data for ecosystem needs
  const ecosystemNeeds = [
    {
      id: 1,
      title: "Mobile SDK Development",
      description: "Create a comprehensive mobile SDK for iOS and Android platforms",
      category: "Development",
      priority: "High",
      reward: "$15,000 - $25,000"
    },
    {
      id: 2,
      title: "Content Moderation System",
      description: "Build AI-powered content moderation for decentralized video",
      category: "AI/ML",
      priority: "Medium",
      reward: "$20,000 - $35,000"
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      description: "Create comprehensive analytics for video creators and viewers",
      category: "Analytics",
      priority: "Medium",
      reward: "$12,000 - $18,000"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Ecosystem Overview Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8  max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ecosystem Overview</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the current state of the Livepeer ecosystem and track key metrics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemMetrics.map((metric, index) => (
              <Card key={index} className="relative overflow-hidden" data-aos="fade-up" data-aos-delay={`${200 + index * 100}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                    <metric.icon className="w-12 h-12 text-green-600 " />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {metric.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Updates Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News & Updates</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest developments in the Livepeer ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <Card key={news.id} className="hover:shadow-lg transition-shadow cursor-pointer" data-aos="fade-up" data-aos-delay={`${200 + index * 100}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={news.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {news.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {news.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{news.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{news.author}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2 line-clamp-2">{news.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{news.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Spotlight Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover funded projects and top contributors in the Livepeer ecosystem
            </p>
          </div>
          
          {/* Logo Carousel */}
          <div className="mb-12">
            
            <div className="h-24">
              <LogoCarousel logos={projectLogos} className="h-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spotlightProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={project.logo} 
                      alt={project.name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge 
                        variant={project.status === 'Completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400 font-semibold">{project.amount}</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{project.contributors}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Needs CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-primary/10 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ideas & RFPs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore open-ended project ideas and specific Requests for Projects (RFPs)
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {ecosystemNeeds.map((need) => (
              <Card key={need.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{need.category}</Badge>
                    <Badge 
                      variant={need.priority === 'High' ? 'destructive' : 'secondary'}
                    >
                      {need.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{need.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {need.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      {need.reward}
                    </span>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-3"
              onClick={() => navigate("/opportunities")}
            >
              Explore All Opportunities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
