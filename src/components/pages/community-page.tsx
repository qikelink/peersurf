import Navbar from "../nav-bar";
import Footer from "../footer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
  Award
} from "lucide-react";

const CommunityPage = () => {
  // Livepeer social media handles and links
  const socialPlatforms = [
    {
      name: "Twitter",
      handle: "@Livepeer",
      url: "https://twitter.com/Livepeer",
      icon: Twitter,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "Follow us for the latest updates and announcements",
      followers: "45.2K"
    },
    {
      name: "Discord",
      handle: "Livepeer Community",
      url: "https://discord.gg/livepeer",
      icon: MessageCircle,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      description: "Join our community discussions and get help",
      followers: "12.8K"
    },
    {
      name: "GitHub",
      handle: "livepeer",
      url: "https://github.com/livepeer",
      icon: Github,
      color: "text-gray-300",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
      description: "Explore our open source code and contribute",
      followers: "2.1K"
    },
    {
      name: "YouTube",
      handle: "Livepeer",
      url: "https://youtube.com/@livepeer",
      icon: Youtube,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "Watch tutorials, demos, and community content",
      followers: "8.5K"
    },
    {
      name: "LinkedIn",
      handle: "Livepeer",
      url: "https://linkedin.com/company/livepeer",
      icon: Linkedin,
      color: "text-blue-300",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/20",
      description: "Connect with our professional network",
      followers: "3.2K"
    },
    {
      name: "Documentation",
      handle: "docs.livepeer.org",
      url: "https://docs.livepeer.org",
      icon: BookOpen,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: "Comprehensive guides and API documentation",
      followers: "Developer Resource"
    }
  ];

  // Community events and activities
  const communityEvents = [
    {
      id: 1,
      title: "Livepeer Community Call",
      date: "Every Tuesday",
      time: "2:00 PM EST",
      type: "Community Call",
      description: "Weekly community updates and Q&A sessions",
      platform: "Discord",
      status: "Ongoing"
    },
    {
      id: 2,
      title: "Developer Workshop: Building with Livepeer",
      date: "Dec 15, 2024",
      time: "3:00 PM EST",
      type: "Workshop",
      description: "Hands-on workshop for developers new to Livepeer",
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

  // Community stats
  const communityStats = [
    {
      label: "Total Community Members",
      value: "650+",
      icon: Users,
      color: "text-green-400"
    },
    {
      label: "Active Developers",
      value: "25+",
      icon: Github,
      color: "text-blue-400"
    },
    {
      label: "Projects Built",
      value: "15+",
      icon: Zap,
      color: "text-purple-400"
    },
    {
      label: "Community Events",
      value: "2+",
      icon: Calendar,
      color: "text-orange-400"
    }
  ];

  // Recent community highlights
  const communityHighlights = [
    {
      id: 1,
      title: "Livepeer Foundation Announces $2M Grant Program",
      description: "New funding opportunities for developers building on Livepeer",
      platform: "Twitter",
      engagement: "1.2K likes, 340 retweets",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Community Spotlight: Video NFT Platform Launch",
      description: "Featured project built by community member using Livepeer infrastructure",
      platform: "Discord",
      engagement: "500+ reactions",
      date: "5 days ago"
    },
    {
      id: 3,
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Livepeer Community
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

      {/* Community Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-2 flex items-center gap-4">
                <div className={`w-12 h-12 flex-2 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-2">
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Media Platforms */}
      <section className=" px-4 sm:px-6 lg:px-8 bg-muted/20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect With Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow Livepeer across all platforms to stay updated and engage with our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPlatforms.map((platform, index) => (
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
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{platform.followers}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary-foreground hover:bg-primary"
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
          {communityEvents.map((event, index) => (
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
          {communityHighlights.map((highlight, index) => (
            <Card key={highlight.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary" />
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
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
          
          <CardContent className="relative p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Join Our Community?</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building the future of decentralized video with thousands of developers worldwide
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-3"
                onClick={() => window.open('https://discord.gg/livepeer', '_blank')}
              >
                Join Discord
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-3"
                onClick={() => window.open('https://docs.livepeer.org', '_blank')}
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
