'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Compass, Plane, Bus, Eye, Backpack, ShoppingBag,
  UtensilsCrossed, Beer, Bed, Shield, Wifi, Search, Star,
  ChevronDown, MapPin, Clock, Globe, ArrowLeft, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  image: string;
  summary: string;
  quickFacts: {
    language: string;
    currency: string;
    timezone: string;
    emergency: string;
  };
  sections: Record<string, string>;
}

/* ──────────────── Mock Data ──────────────── */

const destinations: Destination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '\u{1F1EF}\u{1F1F5}',
    image: 'bg-gradient-to-br from-pink-300 via-red-200 to-orange-200',
    summary: 'Tokyo, Japan\'s bustling capital, mixes ultramodern with traditional, from neon-lit skyscrapers and anime shops to cherry trees and historic temples. It is one of the world\'s most populous metropolitan areas and a global center for technology, fashion, and cuisine.',
    quickFacts: {
      language: 'Japanese',
      currency: 'Japanese Yen (\u00A5)',
      timezone: 'JST (UTC+9)',
      emergency: '110 (Police) / 119 (Fire/Ambulance)',
    },
    sections: {
      Understand: 'Tokyo is the political, economic, and cultural center of Japan. With a population of over 13 million in the city proper, it is a vibrant metropolis that seamlessly blends ancient traditions with cutting-edge innovation. The city is divided into 23 special wards, each with its own character. Shinjuku is the commercial hub, Shibuya the youth fashion center, Akihabara the electronics and anime district, and Asakusa preserves old-town charm. Japanese politeness and efficiency are evident everywhere, from the impeccably clean streets to the trains that run on time to the second.',
      'Get In': 'Narita International Airport (NRT) is the main international gateway, located about 60km east of the city center. The Narita Express train takes about 60 minutes to reach Tokyo Station. Haneda Airport (HND) is closer to the city center and increasingly handles international flights. The Airport Limousine Bus is a comfortable alternative. Japan Rail Pass holders can use the Narita Express for free. Shinkansen (bullet trains) connect Tokyo to all major Japanese cities including Osaka (2.5 hours), Kyoto (2 hours 15 minutes), and Hiroshima (4 hours).',
      'Get Around': 'Tokyo has one of the world\'s most extensive and efficient public transit systems. The Tokyo Metro and Toei Subway operate 13 subway lines covering most of the city. Get a Suica or Pasmo IC card for convenient tap-and-go payment on all trains, subways, and buses. The JR Yamanote Line loops around central Tokyo connecting major stations. Taxis are safe but expensive; a short ride can cost \u00A51,000-2,000. Cycling is popular in many neighborhoods and rental bikes are widely available.',
      See: 'Must-see attractions include Senso-ji Temple in Asakusa, the Meiji Shrine surrounded by forest in Harajuku, the Imperial Palace and its beautiful gardens, and Tokyo Tower or Tokyo Skytree for panoramic views. The Tsukiji Outer Market (the inner wholesale market moved to Toyosu) is a food lover\'s paradise. Akihabara dazzles with its electronic shops and anime culture. Shinjuku Gyoen is a stunning garden especially during cherry blossom season (late March to mid-April). The teamLab exhibitions offer immersive digital art experiences.',
      Do: 'Experience a traditional tea ceremony, visit a sumo tournament (held in January, May, and September), or relax in an onsen (hot spring bath). Take a cooking class to learn how to make sushi, ramen, or tempura. Explore the nightlife in Roppongi or Golden Gai in Shinjuku, where tiny bars line narrow alleys. Visit themed cafes from cat cafes to robot restaurants. Catch a baseball game at Tokyo Dome. Take a day trip to Mount Fuji, Nikko, or Kamakura.',
      Buy: 'Harajuku\'s Takeshita Street is the epicenter of youth fashion. Ginza features luxury department stores like Mitsukoshi and high-end boutiques. Nakamise Shopping Street near Senso-ji has traditional souvenirs and snacks. Don Quijote (Donki) discount stores have everything imaginable at bargain prices. For electronics, Akihabara still leads though Yodobashi Camera stores throughout the city also offer great selections. Tax-free shopping is available for foreign visitors at many stores with a minimum purchase of \u00A55,000.',
      Eat: 'Tokyo has more Michelin stars than any other city in the world. Try authentic sushi at Tsukiji or upscale omakase counters. Ramen lovers should seek out shops in areas like Shinjuku and Ikebukuro. Izakayas (Japanese pubs) serve great food with drinks. Don\'t miss tempura, tonkatsu (pork cutlet), yakitori (grilled chicken skewers), and wagyu beef. Convenience stores (konbini) like 7-Eleven and FamilyMart offer surprisingly delicious and affordable meals. Depachika (department store basement food halls) are a gourmet paradise.',
      Drink: 'Japan\'s drinking culture is vibrant. Try sake (nihonshu) at a specialized bar, Japanese whisky at one of Ginza\'s sophisticated bars, or local craft beer at taprooms in Shimokitazawa. Izakayas are the quintessential Japanese drinking experience. Golden Gai in Shinjuku has over 200 tiny bars, each seating only 5-10 people. Highball (whisky and soda) is extremely popular. Non-drinkers can enjoy matcha, hojicha, and amazing coffee at the city\'s thriving specialty coffee scene.',
      Sleep: 'Options range from ultra-luxury hotels in Ginza and Marunouchi to budget-friendly capsule hotels and hostels. Business hotels like Toyoko Inn and APA Hotel offer clean, compact rooms at reasonable prices. Ryokans (traditional Japanese inns) provide a cultural experience with futon beds and onsen baths. Airbnb options are available but regulated. Shinjuku and Shibuya are convenient bases for nightlife, while Asakusa and Ueno offer a more traditional atmosphere.',
      'Stay Safe': 'Tokyo is one of the safest major cities in the world. Violent crime is extremely rare. Petty theft is uncommon but keep an eye on belongings in crowded areas. Japan has strict drug laws with severe penalties. Earthquakes occur frequently; familiarize yourself with safety procedures. Carry your passport at all times as police may request identification. Emergency numbers: Police 110, Fire/Ambulance 119. Most police boxes (koban) have officers who can help with directions.',
      Connect: 'Free Wi-Fi is available at many train stations, convenience stores, and tourist spots, though it can be unreliable. Pocket Wi-Fi rentals are highly recommended and can be picked up at airports. Tourist SIM cards are available at airports and electronics stores. Japan uses Type A and B electrical outlets (same as US/Canada) at 100V. The voltage difference rarely causes issues with modern electronics. Download offline maps and a translation app before arrival.',
    },
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    flag: '\u{1F1EB}\u{1F1F7}',
    image: 'bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200',
    summary: 'Paris, the City of Light, is the capital of France and one of the most visited cities in the world. Renowned for its art, fashion, gastronomy, and culture, Paris offers iconic landmarks, world-class museums, charming neighborhoods, and an unrivaled joie de vivre.',
    quickFacts: {
      language: 'French',
      currency: 'Euro (\u20AC)',
      timezone: 'CET (UTC+1)',
      emergency: '112 (Universal) / 17 (Police) / 15 (SAMU)',
    },
    sections: {
      Understand: 'Paris is divided into 20 arrondissements (districts) spiraling clockwise from the center. Each has its own personality: the 1st-4th arrondissements form the historic heart, the 5th-6th are the intellectual Left Bank, the 7th has the Eiffel Tower, and the 18th includes bohemian Montmartre. Paris is a compact city best explored on foot, with each neighborhood revealing hidden courtyards, charming cafes, and architectural wonders. The French take pride in their culture and language; even a few words of French will be warmly received.',
      'Get In': 'Charles de Gaulle Airport (CDG) is the main international airport, connected to the city center by RER B train (35 minutes to Chatelet), Roissybus, or taxi (45-70 minutes depending on traffic, fixed fare \u20AC55 to Right Bank). Orly Airport (ORY) handles mostly European and domestic flights, reachable by Orlybus or Orlyval+RER B. Eurostar trains from London arrive at Gare du Nord (2h15min). TGV high-speed trains connect Paris to major French and European cities. Gare de Lyon serves southern France, Gare du Nord serves northern Europe.',
      'Get Around': 'The Paris Metro is one of the world\'s best urban transit systems with 16 lines and over 300 stations. Buy a Navigo Easy card for convenient travel. Single tickets (t+ tickets) work on Metro, bus, and RER within central Paris. The bus network is extensive and offers scenic routes. Velib\' bike-sharing stations are everywhere; the system is affordable and efficient. Walking is the best way to discover Paris. Taxis and ride-sharing (Uber, Bolt) are widely available. Batobus river shuttles offer scenic transport along the Seine.',
      See: 'The Eiffel Tower is unmissable; book tickets online to skip the line. The Louvre houses the Mona Lisa and 35,000 other works of art. Musee d\'Orsay features the world\'s finest Impressionist collection in a stunning former train station. Notre-Dame Cathedral is undergoing restoration but remains an iconic sight. Sacre-Coeur in Montmartre offers panoramic views. The Arc de Triomphe crowns the Champs-Elysees. Sainte-Chapelle has breathtaking stained glass. The Palace of Versailles is an essential day trip.',
      Do: 'Stroll along the Seine at sunset, browse bouquinistes (booksellers) along the riverbanks, and picnic in the Luxembourg Gardens or along Canal Saint-Martin. Attend a cabaret show at the Moulin Rouge or Lido. Take a wine tasting class or a French cooking workshop. Explore the Marais for boutique shopping and falafel. Visit Pere Lachaise Cemetery to see the graves of Jim Morrison, Oscar Wilde, and Edith Piaf. Catch a performance at the Opera Garnier. Browse flea markets at Puces de Saint-Ouen.',
      Buy: 'The Champs-Elysees and Avenue Montaigne feature luxury fashion houses. Le Marais has trendy boutiques and vintage shops. Rue de Rivoli and Les Halles offer mainstream shopping. Galeries Lafayette and Le Bon Marche are iconic department stores. For food souvenirs, visit La Grande Epicerie or Fauchon. Bring home French cheese (hard cheeses travel best), wine, chocolate, and macarons from Laduree or Pierre Herme. Many shops offer tax-free shopping for non-EU residents on purchases over \u20AC100.',
      Eat: 'Paris is the world capital of gastronomy. Start mornings with a croissant and cafe creme at a neighborhood boulangerie. Enjoy a prix-fixe lunch at a bistro for the best value. Try classic dishes: steak frites, duck confit, onion soup gratinee, coq au vin, and croque monsieur. The 11th and 10th arrondissements have the trendiest restaurant scene. Markets like Marche d\'Aligre offer fresh produce and prepared foods. Food halls like Beaupassage and La Felicita are excellent. Michelin-starred restaurants range from accessible to extravagant.',
      Drink: 'Wine is integral to Parisian life. Natural wine bars (caves a manger) are hugely popular, especially in the 10th and 11th arrondissements. Aperitif hour (apero) is sacred; try a Kir (white wine with blackcurrant liqueur) or pastis. Historic cafes like Cafe de Flore and Les Deux Magots offer timeless atmosphere. Cocktail bars in the Marais and Saint-Germain rival the world\'s best. French beer has improved dramatically with many craft breweries. Coffee culture is evolving with specialty roasters like Coutume and Belleville Brulerie.',
      Sleep: 'Paris offers accommodation from palace hotels to charming guesthouses. The 1st-8th arrondissements are most central and priciest. The Marais (3rd-4th) is trendy and well-located. Saint-Germain (6th) is classically Parisian. Montmartre (18th) is charming but hilly. Budget options include hostels in the 10th-11th and hotels in the 13th-14th. Apartment rentals are popular for longer stays. Boutique hotels are a Paris specialty, often in historic buildings with unique character. Book well in advance for high season (April-October).',
      'Stay Safe': 'Paris is generally safe but be vigilant against pickpockets, especially on the Metro, around tourist sites, and on the Champs-Elysees. Be wary of common scams: the ring trick, petition signers, and fake charity collectors. Avoid the areas around Gare du Nord and Chateau Rouge late at night. Keep valuables in front pockets or hidden pouches. The emergency number for all services is 112. Police (17), Fire (18), SAMU/Medical (15). Pharmacies (green cross sign) can provide basic medical advice.',
      Connect: 'Free Wi-Fi is available in many cafes, museums, and public spaces. The city has a free public Wi-Fi network called Paris Wi-Fi available in parks and public buildings. French SIM cards can be purchased at tabacs (tobacconists) or phone shops. France uses Type C and E electrical outlets at 230V; bring an adapter if coming from outside Europe. Most Parisians under 40 speak some English, but making an effort in French is always appreciated. Download the RATP app for Metro navigation.',
    },
  },
];

const popularDestinations = [
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', color: 'from-pink-400 to-red-400' },
  { id: 'paris', name: 'Paris', country: 'France', flag: '\u{1F1EB}\u{1F1F7}', color: 'from-blue-400 to-indigo-400' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', color: 'from-amber-400 to-orange-400' },
  { id: 'newyork', name: 'New York', country: 'USA', flag: '\u{1F1FA}\u{1F1F8}', color: 'from-slate-400 to-zinc-500' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', color: 'from-green-400 to-emerald-400' },
  { id: 'rome', name: 'Rome', country: 'Italy', flag: '\u{1F1EE}\u{1F1F9}', color: 'from-yellow-400 to-amber-500' },
];

const sectionIcons: Record<string, React.ElementType> = {
  Understand: BookOpen,
  'Get In': Plane,
  'Get Around': Bus,
  See: Eye,
  Do: Compass,
  Buy: ShoppingBag,
  Eat: UtensilsCrossed,
  Drink: Beer,
  Sleep: Bed,
  'Stay Safe': Shield,
  Connect: Wifi,
};

const nearbyGuides = [
  { name: 'Kyoto', country: 'Japan', distance: '476 km from Tokyo', flag: '\u{1F1EF}\u{1F1F5}' },
  { name: 'Osaka', country: 'Japan', distance: '515 km from Tokyo', flag: '\u{1F1EF}\u{1F1F5}' },
  { name: 'Nikko', country: 'Japan', distance: '140 km from Tokyo', flag: '\u{1F1EF}\u{1F1F5}' },
  { name: 'Versailles', country: 'France', distance: '22 km from Paris', flag: '\u{1F1EB}\u{1F1F7}' },
  { name: 'Lyon', country: 'France', distance: '465 km from Paris', flag: '\u{1F1EB}\u{1F1F7}' },
  { name: 'Brussels', country: 'Belgium', distance: '315 km from Paris', flag: '\u{1F1E7}\u{1F1EA}' },
];

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ──────────────── Component ──────────────── */

export default function TravelGuidesPage() {
  const [search, setSearch] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('Understand');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const destination = destinations.find((d) => d.id === selectedDestination);

  const filteredPopular = search
    ? popularDestinations.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.country.toLowerCase().includes(search.toLowerCase())
      )
    : popularDestinations;

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectDestination = (id: string) => {
    const found = destinations.find((d) => d.id === id);
    if (found) {
      setSelectedDestination(id);
      setExpandedSection('Understand');
    }
  };

  const sectionOrder = ['Understand', 'Get In', 'Get Around', 'See', 'Do', 'Buy', 'Eat', 'Drink', 'Sleep', 'Stay Safe', 'Connect'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <div className="flex items-center gap-3">
          {selectedDestination && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDestination(null)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A3C5E]" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-[#1A3C5E]">Travel Guides</h1>
            <p className="text-gray-500 mt-1">Comprehensive destination guides powered by community knowledge</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedDestination ? (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 text-lg rounded-xl"
                />
              </div>
            </motion.div>

            {/* Popular Destinations Grid */}
            <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
              <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#E8733A]" />
                Popular Destinations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPopular.map((dest, index) => {
                  const hasGuide = destinations.some((d) => d.id === dest.id);
                  return (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <Card
                        className={cn(
                          'overflow-hidden cursor-pointer hover:shadow-lg transition-all group',
                          !hasGuide && 'opacity-60'
                        )}
                        onClick={() => hasGuide && handleSelectDestination(dest.id)}
                      >
                        <div className={cn('h-32 bg-gradient-to-br flex items-center justify-center relative', dest.color)}>
                          <span className="text-5xl">{dest.flag}</span>
                          {hasGuide && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(dest.id); }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors"
                            >
                              <Star className={cn(
                                'w-4 h-4',
                                bookmarked.has(dest.id) ? 'text-amber-400 fill-amber-400' : 'text-gray-400'
                              )} />
                            </button>
                          )}
                          {!hasGuide && (
                            <Badge className="absolute bottom-2 right-2 bg-white/80 text-gray-600 text-[10px]">Coming Soon</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-[#1A3C5E] group-hover:text-[#E8733A] transition-colors">{dest.name}</h3>
                          <p className="text-sm text-gray-500">{dest.country}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Nearby Guides */}
            <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#E8733A]" />
                    Nearby Guides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {nearbyGuides.map((guide, index) => (
                      <motion.div
                        key={guide.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="p-3 rounded-xl border border-gray-100 hover:border-[#E8733A]/30 hover:bg-[#E8733A]/5 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{guide.flag}</span>
                          <div>
                            <p className="font-semibold text-sm text-[#1A3C5E]">{guide.name}</p>
                            <p className="text-[10px] text-gray-500">{guide.distance}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : destination ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Destination Header */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="overflow-hidden">
                <div className={cn('h-48 flex items-center justify-center relative', destination.image)}>
                  <div className="text-center">
                    <span className="text-6xl block mb-2">{destination.flag}</span>
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">{destination.name}</h2>
                    <p className="text-white/80 drop-shadow">{destination.country}</p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(destination.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors"
                  >
                    <Star className={cn(
                      'w-5 h-5',
                      bookmarked.has(destination.id) ? 'text-amber-400 fill-amber-400' : 'text-gray-400'
                    )} />
                  </button>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 leading-relaxed">{destination.summary}</p>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Guide Sections (Accordion) */}
              <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#E8733A]" />
                      Travel Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sectionOrder.map((sectionName, index) => {
                        const content = destination.sections[sectionName];
                        if (!content) return null;
                        const Icon = sectionIcons[sectionName] || Info;
                        const isExpanded = expandedSection === sectionName;
                        return (
                          <motion.div
                            key={sectionName}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.03 }}
                          >
                            <button
                              onClick={() => setExpandedSection(isExpanded ? null : sectionName)}
                              className="w-full text-left"
                            >
                              <div className={cn(
                                'p-4 rounded-xl border transition-all',
                                isExpanded
                                  ? 'bg-[#1A3C5E]/5 border-[#1A3C5E]/20 shadow-sm'
                                  : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              )}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      'w-9 h-9 rounded-lg flex items-center justify-center',
                                      isExpanded ? 'bg-[#E8733A] text-white' : 'bg-[#E8733A]/10 text-[#E8733A]'
                                    )}>
                                      <Icon className="w-4.5 h-4.5" />
                                    </div>
                                    <span className={cn(
                                      'font-semibold text-sm',
                                      isExpanded ? 'text-[#1A3C5E]' : 'text-gray-700'
                                    )}>
                                      {sectionName}
                                    </span>
                                  </div>
                                  <ChevronDown className={cn(
                                    'w-4 h-4 text-gray-400 transition-transform',
                                    isExpanded && 'rotate-180'
                                  )} />
                                </div>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-12">
                                        {content}
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Facts Sidebar */}
              <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#E8733A]" />
                      Quick Facts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-xl bg-[#1A3C5E]/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Language</p>
                      <p className="text-sm font-semibold text-[#1A3C5E]">{destination.quickFacts.language}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#E8733A]/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Currency</p>
                      <p className="text-sm font-semibold text-[#1A3C5E]">{destination.quickFacts.currency}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1A3C5E]/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Timezone</p>
                      <p className="text-sm font-semibold text-[#1A3C5E]">{destination.quickFacts.timezone}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Emergency Numbers</p>
                      <p className="text-sm font-semibold text-[#1A3C5E]">{destination.quickFacts.emergency}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Nearby from this destination */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E8733A]" />
                      Nearby Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {nearbyGuides
                      .filter((g) =>
                        (destination.id === 'tokyo' && g.country === 'Japan') ||
                        (destination.id === 'paris' && (g.country === 'France' || g.country === 'Belgium'))
                      )
                      .map((guide) => (
                        <div
                          key={guide.name}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <span className="text-lg">{guide.flag}</span>
                          <div>
                            <p className="text-xs font-semibold text-[#1A3C5E]">{guide.name}</p>
                            <p className="text-[10px] text-gray-400">{guide.distance}</p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
