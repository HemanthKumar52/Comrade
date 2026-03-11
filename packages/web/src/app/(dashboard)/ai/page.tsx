'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Share2, Copy, Twitter, MessageCircle, Mountain,
  UtensilsCrossed, Landmark, Wallet, Gem, Compass, MapPin,
  Clock, Route, ChevronRight, Lightbulb, Eye, Utensils,
  AlertTriangle, ShoppingBag, Globe2, Shield, Banknote, Car,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const moods = [
  { key: 'peaceful', label: 'Peaceful', emoji: '🧘', color: 'from-teal-400 to-cyan-500', bg: 'bg-teal-50 border-teal-200' },
  { key: 'adventurous', label: 'Adventurous', emoji: '🏔️', color: 'from-orange-400 to-red-500', bg: 'bg-orange-50 border-orange-200' },
  { key: 'foodie', label: 'Foodie', emoji: '🍜', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50 border-amber-200' },
  { key: 'cultural', label: 'Cultural', emoji: '🏛️', color: 'from-purple-400 to-indigo-500', bg: 'bg-purple-50 border-purple-200' },
  { key: 'budget', label: 'Budget', emoji: '💰', color: 'from-green-400 to-emerald-500', bg: 'bg-green-50 border-green-200' },
  { key: 'luxury', label: 'Luxury', emoji: '✨', color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50 border-pink-200' },
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Jaipur', 'Goa', 'Kochi', 'Hyderabad', 'Pune'];

const mockTrips = [
  { id: '1', name: 'Goa Beach Escape' },
  { id: '2', name: 'Rajasthan Heritage Tour' },
  { id: '3', name: 'Kerala Backwaters' },
  { id: '4', name: 'Himalayan Adventure' },
];

const mockStory = `The morning sun painted the Rajasthani sky in shades of saffron and gold as we set out from Jaipur, our hearts full of anticipation. The Pink City had already captivated us with its magnificent Hawa Mahal, where a thousand windows whispered stories of queens who once watched the world through latticed screens.

The road to Jodhpur unfolded like a story itself -- vast stretches of the Thar Desert broken by occasional villages where children waved and camels ambled alongside our car. At the Mehrangarh Fort, we stood on ramparts that have guarded the Blue City for five centuries, watching the sun set over a sea of indigo-painted houses.

Our final stop, Udaipur, was pure magic. The City of Lakes lived up to every fairy tale we had ever read. Dining on a rooftop overlooking Lake Pichola, with the City Palace illuminated in the background, we realized that some journeys don't just take you places -- they transform you.`;

interface RouteCard {
  name: string;
  description: string;
  distance: string;
  days: number;
  difficulty: string;
  stops: string[];
}

const moodRoutes: Record<string, RouteCard[]> = {
  peaceful: [
    { name: 'Kerala Serenity Trail', description: 'Glide through backwaters, meditate in ashrams, and unwind on pristine beaches.', distance: '320 km', days: 5, difficulty: 'Easy', stops: ['Kochi', 'Alleppey', 'Varkala', 'Kovalam'] },
    { name: 'Himalayan Mindfulness Path', description: 'Mountain monasteries, yoga retreats, and silent valleys.', distance: '180 km', days: 7, difficulty: 'Moderate', stops: ['Rishikesh', 'Dehradun', 'Mussoorie', 'Landour'] },
    { name: 'Goan Slow Route', description: 'Quiet beaches, heritage houses, and spice plantations.', distance: '120 km', days: 4, difficulty: 'Easy', stops: ['Panjim', 'Old Goa', 'Palolem', 'Cabo de Rama'] },
  ],
  adventurous: [
    { name: 'Ladakh Frontier Run', description: 'Conquer the highest motorable passes and camp under starlit skies.', distance: '1200 km', days: 10, difficulty: 'Hard', stops: ['Manali', 'Rohtang', 'Keylong', 'Leh', 'Pangong', 'Nubra'] },
    { name: 'Western Ghats Explorer', description: 'Dense forests, waterfalls, and winding mountain roads.', distance: '450 km', days: 6, difficulty: 'Moderate', stops: ['Coorg', 'Chikmagalur', 'Jog Falls', 'Gokarna'] },
    { name: 'Northeast Discovery', description: 'Unexplored hills, living root bridges, and tribal villages.', distance: '600 km', days: 8, difficulty: 'Hard', stops: ['Guwahati', 'Shillong', 'Cherrapunji', 'Kaziranga'] },
  ],
  foodie: [
    { name: 'South Indian Spice Route', description: 'A culinary journey through the birthplace of spices.', distance: '400 km', days: 6, difficulty: 'Easy', stops: ['Chennai', 'Pondicherry', 'Thanjavur', 'Madurai', 'Chettinad'] },
    { name: 'Street Food Trail', description: 'From chaat to kebabs, taste the best street food in India.', distance: '800 km', days: 7, difficulty: 'Easy', stops: ['Delhi', 'Lucknow', 'Varanasi', 'Kolkata'] },
    { name: 'Coastal Flavors', description: 'Seafood paradise along the western coast.', distance: '500 km', days: 5, difficulty: 'Easy', stops: ['Mumbai', 'Ratnagiri', 'Goa', 'Mangalore'] },
  ],
  cultural: [
    { name: 'Golden Triangle Classic', description: 'India\'s most iconic heritage circuit.', distance: '720 km', days: 6, difficulty: 'Easy', stops: ['Delhi', 'Agra', 'Jaipur', 'Pushkar'] },
    { name: 'Temple Trail South', description: 'Ancient temples and Dravidian architecture.', distance: '600 km', days: 7, difficulty: 'Easy', stops: ['Chennai', 'Mahabalipuram', 'Thanjavur', 'Madurai', 'Rameswaram'] },
    { name: 'Buddhist Circuit', description: 'Walk in the footsteps of Buddha.', distance: '900 km', days: 8, difficulty: 'Moderate', stops: ['Varanasi', 'Bodh Gaya', 'Rajgir', 'Nalanda', 'Sarnath'] },
  ],
  budget: [
    { name: 'Backpacker\'s Paradise', description: 'Maximum experiences, minimum spend.', distance: '350 km', days: 7, difficulty: 'Easy', stops: ['Hampi', 'Gokarna', 'Murudeshwar', 'Udupi'] },
    { name: 'Himachal on a Shoestring', description: 'Budget hostels and free mountain views.', distance: '400 km', days: 8, difficulty: 'Moderate', stops: ['Kasol', 'Manali', 'Bir Billing', 'Dharamshala'] },
    { name: 'Rajasthan Budget Loop', description: 'Heritage stays and thali meals under budget.', distance: '600 km', days: 6, difficulty: 'Easy', stops: ['Jaipur', 'Pushkar', 'Jodhpur', 'Jaisalmer'] },
  ],
  luxury: [
    { name: 'Royal Rajasthan Experience', description: 'Palace hotels, private safaris, and royal dining.', distance: '800 km', days: 7, difficulty: 'Easy', stops: ['Jaipur', 'Ranthambore', 'Jodhpur', 'Udaipur'] },
    { name: 'Kerala Luxury Cruise', description: 'Premium houseboats, Ayurvedic spas, and plantation stays.', distance: '300 km', days: 5, difficulty: 'Easy', stops: ['Kochi', 'Munnar', 'Thekkady', 'Alleppey', 'Kumarakom'] },
    { name: 'Goa Luxe Retreat', description: 'Five-star resorts, private beaches, and gourmet dining.', distance: '100 km', days: 4, difficulty: 'Easy', stops: ['Candolim', 'Sinquerim', 'Cavelossim', 'Palolem'] },
  ],
};

const smartTipsData: Record<string, { icon: React.ElementType; title: string; tips: string[] }[]> = {
  India: [
    { icon: Car, title: 'Getting Around', tips: ['Download Ola/Uber for city travel', 'Book trains via IRCTC app 2 months ahead', 'Auto-rickshaws: agree on fare before riding', 'Domestic flights are cheap - book 3 weeks early'] },
    { icon: Shield, title: 'Safety', tips: ['Keep photocopies of documents separately', 'Use hotel safes for valuables', 'Avoid isolated areas after dark', 'Register with your embassy for long stays'] },
    { icon: Banknote, title: 'Money', tips: ['UPI (Google Pay/PhonePe) accepted everywhere', 'Keep small change for street vendors', 'ATMs charge fees for foreign cards', 'Negotiate prices at markets (start at 50%)'] },
    { icon: Utensils, title: 'Food', tips: ['Street food is amazing but choose busy stalls', 'Drink only bottled/filtered water', 'South India is generally spicier', 'Thalis offer best value for money'] },
    { icon: Globe2, title: 'Culture', tips: ['Remove shoes before entering temples', 'Dress modestly at religious sites', 'Use right hand for greetings and eating', 'Head wobble means "yes/okay"'] },
    { icon: Eye, title: 'Must-See', tips: ['Taj Mahal at sunrise (book tickets online)', 'Varanasi Ganga Aarti at sunset', 'Kerala backwaters houseboat overnight', 'Jaisalmer desert camping under stars'] },
  ],
  Japan: [
    { icon: Car, title: 'Getting Around', tips: ['Get a JR Rail Pass for bullet trains', 'IC cards (Suica/Pasmo) for city transport', 'Taxis are expensive but safe', 'Rent a pocket WiFi for navigation'] },
    { icon: Shield, title: 'Safety', tips: ['Japan is extremely safe for travelers', 'Lost items are often returned - check koban', 'Earthquakes: follow local emergency procedures', 'Keep your passport with you at all times'] },
    { icon: Banknote, title: 'Money', tips: ['Japan is still cash-heavy, carry yen', '7-Eleven ATMs accept foreign cards', 'Tax-free shopping available for tourists', 'Tipping is not customary'] },
    { icon: Utensils, title: 'Food', tips: ['Conveyor belt sushi for budget meals', 'Convenience store food is excellent', 'Slurping noodles is polite', 'Many restaurants use ticket vending machines'] },
    { icon: Globe2, title: 'Culture', tips: ['Bow when greeting people', 'Remove shoes indoors (look for slippers)', 'Don\'t eat while walking', 'Quiet behavior expected on trains'] },
    { icon: Eye, title: 'Must-See', tips: ['Fushimi Inari at dawn (avoid crowds)', 'Mount Fuji from Hakone or Kawaguchiko', 'Shibuya Crossing at night', 'Hiroshima Peace Memorial'] },
  ],
};

const quickRecommendations: Record<string, Record<string, string[]>> = {
  India: {
    'What to See': ['Taj Mahal, Agra', 'Jaipur\'s Amber Fort', 'Kerala Backwaters', 'Varanasi Ghats', 'Hampi Ruins', 'Ladakh Landscapes'],
    'What to Eat': ['Hyderabadi Biryani', 'Mumbai Vada Pav', 'Kolkata Rosogolla', 'Amritsari Kulcha', 'Lucknowi Kebabs', 'Mysore Pak'],
    'What to Avoid': ['Drinking tap water', 'Unsolicited tour guides', 'Exchanging money on streets', 'Wearing shoes in temples', 'Road travel at night in rural areas'],
    'Best Souvenirs': ['Pashmina shawls from Kashmir', 'Darjeeling tea', 'Rajasthani block prints', 'Mysore sandalwood', 'Kolhapuri chappals', 'Madhubani paintings'],
  },
};

export default function AIPage() {
  const [selectedTrip, setSelectedTrip] = useState('');
  const [story, setStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [tipsCountry, setTipsCountry] = useState('India');
  const [recoTab, setRecoTab] = useState('What to See');
  const [displayedStory, setDisplayedStory] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleGenerateStory = () => {
    setIsGenerating(true);
    setDisplayedStory('');
    setStory(mockStory);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      setDisplayedStory(mockStory.slice(0, idx));
      if (idx >= mockStory.length) {
        clearInterval(intervalRef.current!);
        setIsGenerating(false);
      }
    }, 15);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const routes = selectedMood ? moodRoutes[selectedMood] || [] : [];
  const tips = smartTipsData[tipsCountry] || smartTipsData['India'];
  const recos = quickRecommendations[tipsCountry] || quickRecommendations['India'];
  const recoTabs = Object.keys(recos);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-[#E8733A]" />
          AI Travel Assistant
        </h1>
        <p className="text-gray-500 text-sm mt-1">Intelligent travel planning powered by AI</p>
      </motion.div>

      {/* Trip Narrator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Trip Narrator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="flex-1 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
              >
                <option value="">Select a completed trip...</option>
                {mockTrips.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <Button
                onClick={handleGenerateStory}
                disabled={!selectedTrip || isGenerating}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white gap-2 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate Story'}
              </Button>
            </div>

            {(displayedStory || isGenerating) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200"
              >
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {displayedStory}
                  {isGenerating && <span className="inline-block w-1.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle" />}
                </p>
              </motion.div>
            )}

            {displayedStory && !isGenerating && (
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => copyToClipboard(displayedStory)}>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs text-green-600 border-green-200 hover:bg-green-50">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs text-blue-500 border-blue-200 hover:bg-blue-50">
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood-Based Routes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#E8733A]" />
              Mood-Based Routes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {moods.map((mood) => (
                <motion.button
                  key={mood.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(selectedMood === mood.key ? null : mood.key)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-center transition-all',
                    selectedMood === mood.key
                      ? 'border-[#E8733A] bg-[#E8733A]/5 shadow-md'
                      : mood.bg
                  )}
                >
                  <span className="text-3xl block mb-2">{mood.emoji}</span>
                  <p className="text-sm font-semibold text-gray-700">{mood.label}</p>
                </motion.button>
              ))}
            </div>

            {selectedMood && (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <span className="text-sm text-gray-500">Starting from:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-48 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            <AnimatePresence mode="wait">
              {selectedMood && routes.length > 0 && (
                <motion.div
                  key={selectedMood}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {routes.map((route, i) => (
                    <motion.div
                      key={route.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all">
                        <CardContent className="p-5 flex flex-col h-full">
                          <h3 className="font-bold text-[#1A3C5E] mb-2">{route.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{route.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Route className="w-3 h-3" /> {route.distance}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.days} days</span>
                            <Badge variant="outline" className="text-[10px]">{route.difficulty}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {route.stops.map((stop) => (
                              <span key={stop} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {stop}
                              </span>
                            ))}
                          </div>
                          <div className="mt-auto">
                            <Button className="w-full bg-[#E8733A] hover:bg-[#d4642e] text-white gap-2 text-sm">
                              Plan This Route <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Smart Travel Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Smart Travel Tips
            </CardTitle>
            <select
              value={tipsCountry}
              onChange={(e) => setTipsCountry(e.target.value)}
              className="w-full sm:w-48 h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30"
            >
              {Object.keys(smartTipsData).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-[#1A3C5E]" />
                          </div>
                          <h4 className="font-bold text-sm text-[#1A3C5E]">{tip.title}</h4>
                        </div>
                        <ul className="space-y-2">
                          {tip.tips.map((t, j) => (
                            <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E8733A] shrink-0 mt-1.5" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#E8733A]" />
              Quick Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
              {recoTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRecoTab(tab)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
                    recoTab === tab
                      ? 'bg-[#1A3C5E] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={recoTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {recos[recoTab]?.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#E8733A]/10 flex items-center justify-center text-sm font-bold text-[#E8733A] shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
