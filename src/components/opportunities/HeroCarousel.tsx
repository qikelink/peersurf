import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import React from "react";

type SponsorCard = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradient: string;
  accent: string;
  stats: string;
  cta: string;
};

interface HeroCarouselProps {
  user: any;
  profile: any;
  sponsorCards: SponsorCard[];
  currentCard: number;
  setCurrentCard: (idx: number) => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ user, profile, sponsorCards, currentCard, setCurrentCard }) => {
  return (
    <div className="relative mb-6 sm:mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-black">
        <div className="relative overflow-hidden rounded-xl">
          <div className="relative h-64 sm:h-72 lg:h-64">
            {sponsorCards.map((card, index) => {
              const IconComponent = card.icon;
              const isActive = index === currentCard;
              const isPrev = index === (currentCard - 1 + sponsorCards.length) % sponsorCards.length;
              const isNext = index === (currentCard + 1) % sponsorCards.length;
              
              return (
                <div
                  key={card.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    isActive 
                      ? 'opacity-100 translate-x-0 scale-100' 
                      : isPrev 
                        ? 'opacity-0 -translate-x-full scale-95' 
                        : isNext 
                          ? 'opacity-0 translate-x-full scale-95'
                          : 'opacity-0 translate-x-0 scale-95'
                  }`}
                >
                  <div className={`h-full bg-gradient-to-br ${card.gradient} p-6 sm:p-8 relative overflow-hidden`}>
                    {index === 0 && (
                      <div className="absolute inset-0 flex items-center justify-end pr-8">
                        <img 
                          src="/erased_01.png" 
                          alt="Team collaboration" 
                          className="w-1/2 h-full object-contain opacity-20 hover:opacity-30 transition-opacity duration-500"
                        />
                      </div>
                    )}
                    {index === 1 && (
                      <div className="absolute inset-0 flex items-center justify-end pr-8">
                        <img 
                          src="/erased_02.png" 
                          alt="Project launch" 
                          className="w-1/2 h-full object-contain opacity-20 hover:opacity-30 transition-opacity duration-500"
                        />
                      </div>
                    )}

                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" />
                    <div className="absolute top-1/2 right-4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" />

                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex-1">
                        {user ? (
                          <div className="mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-white/90">
                              {`Welcome back, ${profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}`}
                            </h2>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 ${card.accent} rounded-xl flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-lg sm:text-xl font-bold text-white">{card.title}</h2>
                              <p className="text-white/80 text-sm">{card.subtitle}</p>
                            </div>
                          </div>
                        )}

                        <p className="text-white/90 mb-6 max-w-2xl text-sm leading-relaxed hidden sm:block">
                          {card.description}
                        </p>

                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white/80 text-sm font-medium">{card.stats}</span>
                          </div>
                          <div className="h-4 w-px bg-white/20" />
                          <span className="text-white/60 text-sm">Trusted by 1,780+ sponsors</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Link to={profile?.role === 'SPE' ? '/profile' : '/auth?mode=signup&role=SPE'} className="w-full sm:w-auto">
                          <Button className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-105">
                            {card.cta}
                          </Button>
                        </Link>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                          <span>Join the future of work</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sponsorCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentCard 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;


