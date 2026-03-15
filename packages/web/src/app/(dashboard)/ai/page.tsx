'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Share2, Copy, MessageCircle, Mountain,
  UtensilsCrossed, Landmark, Wallet, Gem, Compass, MapPin,
  Clock, Route, ChevronRight, Lightbulb, Eye, Utensils,
  Globe2, Shield, Banknote, Car, Bot, Send, BookOpen,
  Hash, Smartphone, CheckCircle, Heart, Star, TrendingUp,
  Navigation, Loader2, RotateCcw, Trash2, ThumbsUp,
  ThumbsDown, ExternalLink, Map, Camera, Coffee,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface RouteCard {
  name: string;
  description: string;
  distance: string;
  days: number;
  difficulty: string;
  stops: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
}

interface RecommendationCard {
  name: string;
  category: string;
  rating: number;
  description: string;
  distance?: string;
  priceLevel: string;
  tags: string[];
  emoji: string;
}

/* ──────────────── Constants ──────────────── */

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const moods = [
  { key: 'peaceful', label: 'Peaceful', emoji: '🧘', color: 'from-teal-400 to-cyan-500', bg: 'bg-teal-50 border-teal-200', description: 'Serene & calming' },
  { key: 'adventurous', label: 'Adventurous', emoji: '🏔️', color: 'from-orange-400 to-red-500', bg: 'bg-orange-50 border-orange-200', description: 'Thrilling & bold' },
  { key: 'foodie', label: 'Foodie', emoji: '🍜', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50 border-amber-200', description: 'Culinary delights' },
  { key: 'cultural', label: 'Cultural', emoji: '🏛️', color: 'from-purple-400 to-indigo-500', bg: 'bg-purple-50 border-purple-200', description: 'Heritage & arts' },
  { key: 'budget', label: 'Budget', emoji: '💰', color: 'from-green-400 to-emerald-500', bg: 'bg-green-50 border-green-200', description: 'Maximum value' },
  { key: 'luxury', label: 'Luxury', emoji: '✨', color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50 border-pink-200', description: 'Premium & exclusive' },
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Jaipur', 'Goa', 'Kochi', 'Hyderabad', 'Pune', 'Varanasi', 'Udaipur'];

const outputFormats = [
  { key: 'blog', label: 'Blog Post', icon: BookOpen, description: 'Detailed narrative' },
  { key: 'social', label: 'Social Caption', icon: Hash, description: 'Short & catchy' },
  { key: 'whatsapp', label: 'WhatsApp Status', icon: Smartphone, description: 'Quick update' },
];

const mockTrips = [
  { id: '1', name: 'Goa Beach Escape', dates: 'Dec 2025', days: 5 },
  { id: '2', name: 'Rajasthan Heritage Tour', dates: 'Nov 2025', days: 8 },
  { id: '3', name: 'Kerala Backwaters', dates: 'Oct 2025', days: 6 },
  { id: '4', name: 'Himalayan Adventure', dates: 'Sep 2025', days: 10 },
];

const mockStories: Record<string, string> = {
  blog: `The morning sun painted the Rajasthani sky in shades of saffron and gold as we set out from Jaipur, our hearts full of anticipation. The Pink City had already captivated us with its magnificent Hawa Mahal, where a thousand windows whispered stories of queens who once watched the world through latticed screens.

The road to Jodhpur unfolded like a story itself -- vast stretches of the Thar Desert broken by occasional villages where children waved and camels ambled alongside our car. At the Mehrangarh Fort, we stood on ramparts that have guarded the Blue City for five centuries, watching the sun set over a sea of indigo-painted houses.

Our final stop, Udaipur, was pure magic. The City of Lakes lived up to every fairy tale we had ever read. Dining on a rooftop overlooking Lake Pichola, with the City Palace illuminated in the background, we realized that some journeys don't just take you places -- they transform you.

This wasn't just a trip through Rajasthan. It was a journey through time, through colors, through flavors that linger on your tongue and memories that linger in your soul. The desert taught us that beauty thrives where you least expect it, and that the most magnificent palaces are built not from stone, but from stories passed down through generations.`,

  social: `Just got back from the most INCREDIBLE Rajasthan road trip! 🏜️✨

From the pink walls of Jaipur to the blue streets of Jodhpur to the lake palaces of Udaipur -- every single day was a new fairy tale.

Highlights: Sunrise at Mehrangarh Fort, getting lost in Jodhpur's spice markets, and that magical rooftop dinner overlooking Lake Pichola 🌅

India, you never cease to amaze. 🇮🇳❤️

#Rajasthan #IncredibleIndia #TravelIndia #JaipurDiaries #Jodhpur #Udaipur #DesertVibes #TravelStory #Wanderlust #RoadTrip`,

  whatsapp: `Just wrapped up the most amazing Rajasthan road trip! 🏜️

Jaipur ➡️ Jodhpur ➡️ Udaipur

3 cities, 8 days, countless memories ✨

Best moments:
🏰 Hawa Mahal at sunrise
🌅 Sunset from Mehrangarh Fort
🛶 Boat ride on Lake Pichola
🍛 The BEST dal baati churma ever

Trust me, Rajasthan needs to be on your list! Hit me up if you want recommendations 🙌`,
};

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
    { icon: Eye, title: 'Hidden Gems', tips: ['Taj Mahal at sunrise (book tickets online)', 'Varanasi Ganga Aarti at sunset', 'Kerala backwaters houseboat overnight', 'Jaisalmer desert camping under stars'] },
  ],
  Japan: [
    { icon: Car, title: 'Getting Around', tips: ['Get a JR Rail Pass for bullet trains', 'IC cards (Suica/Pasmo) for city transport', 'Taxis are expensive but safe', 'Rent a pocket WiFi for navigation'] },
    { icon: Shield, title: 'Safety', tips: ['Japan is extremely safe for travelers', 'Lost items are often returned - check koban', 'Earthquakes: follow local emergency procedures', 'Keep your passport with you at all times'] },
    { icon: Banknote, title: 'Money', tips: ['Japan is still cash-heavy, carry yen', '7-Eleven ATMs accept foreign cards', 'Tax-free shopping available for tourists', 'Tipping is not customary'] },
    { icon: Utensils, title: 'Food', tips: ['Conveyor belt sushi for budget meals', 'Convenience store food is excellent', 'Slurping noodles is polite', 'Many restaurants use ticket vending machines'] },
    { icon: Globe2, title: 'Culture', tips: ['Bow when greeting people', 'Remove shoes indoors (look for slippers)', 'Don\'t eat while walking', 'Quiet behavior expected on trains'] },
    { icon: Eye, title: 'Hidden Gems', tips: ['Fushimi Inari at dawn (avoid crowds)', 'Mount Fuji from Hakone or Kawaguchiko', 'Shibuya Crossing at night', 'Hiroshima Peace Memorial'] },
  ],
  Thailand: [
    { icon: Car, title: 'Getting Around', tips: ['BTS/MRT in Bangkok for convenience', 'Grab app for taxis (like Uber)', 'Tuk-tuks are fun but negotiate first', 'Domestic flights are very affordable'] },
    { icon: Shield, title: 'Safety', tips: ['Be aware of common tourist scams', 'Never disrespect the monarchy', 'Watch for bag snatchers on motorbikes', 'Buy travel insurance - hospitals require payment upfront'] },
    { icon: Banknote, title: 'Money', tips: ['Thai Baht - withdraw from ATMs (150 baht fee)', 'Street food costs 40-80 baht per dish', 'Always negotiate at markets', 'Tipping 20-50 baht at restaurants is appreciated'] },
    { icon: Utensils, title: 'Food', tips: ['Pad Thai from street stalls is the best', 'Ask for "mai pet" if you can\'t handle spice', 'Night markets are food paradise', 'Try mango sticky rice for dessert'] },
    { icon: Globe2, title: 'Culture', tips: ['Wai greeting (palms together, slight bow)', 'Cover shoulders and knees at temples', 'Never touch someone\'s head', 'Remove shoes before entering homes'] },
    { icon: Eye, title: 'Hidden Gems', tips: ['Doi Suthep temple at sunrise', 'Floating markets outside Bangkok', 'Pai in northern Thailand for hippie vibes', 'Koh Lipe for unspoiled beaches'] },
  ],
};

const mockRecommendations: RecommendationCard[] = [
  { name: 'Champa Gali', category: 'Cafe District', rating: 4.7, description: 'Hidden lane of artisan cafes and boutiques in South Delhi. Perfect for a lazy afternoon.', distance: '2.3 km', priceLevel: '$$', tags: ['Coffee', 'Art', 'Hidden Gem'], emoji: '☕' },
  { name: 'Lodhi Art District', category: 'Street Art', rating: 4.8, description: 'India\'s first open-air art district with stunning murals from global artists.', distance: '1.8 km', priceLevel: 'Free', tags: ['Art', 'Photography', 'Walking'], emoji: '🎨' },
  { name: 'Agrasen ki Baoli', category: 'Historical', rating: 4.5, description: 'Ancient stepwell in the heart of Delhi. Atmospheric and uncrowded.', distance: '3.1 km', priceLevel: 'Free', tags: ['History', 'Architecture', 'Quiet'], emoji: '🏛️' },
  { name: 'Majnu Ka Tilla', category: 'Food & Culture', rating: 4.6, description: 'Tibetan colony with authentic momos, thukpa, and vibrant prayer flags.', distance: '5.2 km', priceLevel: '$', tags: ['Food', 'Tibetan', 'Budget'], emoji: '🥟' },
  { name: 'Sunder Nursery', category: 'Park & Heritage', rating: 4.9, description: 'Beautifully restored Mughal-era garden with heritage monuments and nature trails.', distance: '4.0 km', priceLevel: '$', tags: ['Nature', 'Heritage', 'Peaceful'], emoji: '🌳' },
  { name: 'Hauz Khas Village', category: 'Nightlife & Dining', rating: 4.4, description: 'Trendy neighborhood with rooftop restaurants, galleries, and lakeside ruins.', distance: '3.5 km', priceLevel: '$$$', tags: ['Dining', 'Nightlife', 'Views'], emoji: '🌃' },
];

const chatSuggestions = [
  'Where is the nearest English-speaking hospital?',
  'Best time to visit Rajasthan?',
  'How to get from Delhi to Agra cheaply?',
  'Is it safe to travel solo in Kerala?',
  'What should I pack for a Himalayan trek?',
  'Local SIM card options for tourists?',
];

const mockChatResponses: Record<string, string> = {
  'Where is the nearest English-speaking hospital?': `Based on your current location in Delhi, here are the nearest English-speaking hospitals:

**1. Max Super Speciality Hospital** - 2.3 km away
   Address: 1, Press Enclave Road, Saket
   Phone: +91-11-2651 5050
   Emergency: 24/7, English-speaking staff

**2. Apollo Hospital** - 3.8 km away
   Address: Sarita Vihar, Delhi-Mathura Road
   Phone: +91-11-2692 5858
   Emergency: 24/7, multilingual staff

**3. Fortis Hospital** - 4.1 km away
   Address: Sector B, Pocket 1, Aruna Asaf Ali Marg
   Phone: +91-11-4277 6222

All three hospitals accept international insurance. Keep your passport and insurance card ready.`,

  'Best time to visit Rajasthan?': `**Best Time: October to March** (Winter season)

**October-November** - Perfect weather, festive season (Diwali, Pushkar Mela)
- Temperature: 25-30°C days, 15-20°C nights
- Great for: Sightseeing, photography, camel safaris

**December-February** - Peak tourist season
- Temperature: 20-25°C days, 5-10°C nights (can be chilly!)
- Great for: Desert camping, fort visits, bird watching at Bharatpur
- Note: Book hotels early, prices are highest

**March** - Shoulder season, Holi celebrations!
- Temperature: 30-35°C, warming up fast
- Great for: Holi in Jaipur/Pushkar, fewer crowds

**Avoid: April-September** - Extreme heat (45°C+) and monsoon rains.

**Pro Tip:** The week around Diwali (November) transforms Rajasthan into a magical light show. Udaipur and Jaipur are especially stunning!`,

  'How to get from Delhi to Agra cheaply?': `**Cheapest Options Delhi to Agra:**

**1. Train (Recommended)** - Starting from ₹75
   - Gatimaan Express: 1h 40m, ₹750 (fastest)
   - Shatabdi Express: 2h, ₹550
   - Regular trains: 2.5-3h, ₹75-250
   - Book on IRCTC app/website

**2. Bus** - ₹300-600
   - UPSRTC buses from ISBT Kashmere Gate
   - Duration: 4-5 hours
   - Frequency: Every 30 minutes

**3. Shared Cab** - ₹400-600 per person
   - BlaBlaCar or similar ride-sharing
   - Duration: 3-4 hours via Yamuna Expressway

**4. Budget Taxi** - ₹2,500-3,500 (one way)
   - Good for groups of 3-4 people
   - Can do a day trip (Agra + Fatehpur Sikri)

**Pro Tip:** Take the early morning Gatimaan Express, visit Taj Mahal at sunrise, explore Agra Fort, and return by evening train. Total cost: ~₹1,500 including entry fees!`,

  default: `Great question! Here's what I found:

Based on current travel data and local insights, I'd recommend checking with local tourism offices for the most up-to-date information.

Here are some general tips:
- Always verify operating hours before visiting attractions
- Download offline maps for areas with poor connectivity
- Keep emergency numbers saved in your phone
- Carry both cash and cards as backup

Would you like me to help with anything more specific about your travel plans?`,
};

const quickRecommendations: Record<string, Record<string, string[]>> = {
  India: {
    'Must Visit': ['Taj Mahal, Agra', 'Jaipur\'s Amber Fort', 'Kerala Backwaters', 'Varanasi Ghats', 'Hampi Ruins', 'Ladakh Landscapes'],
    'Must Eat': ['Hyderabadi Biryani', 'Mumbai Vada Pav', 'Kolkata Rosogolla', 'Amritsari Kulcha', 'Lucknowi Kebabs', 'Mysore Pak'],
    'Avoid': ['Drinking tap water', 'Unsolicited tour guides', 'Exchanging money on streets', 'Wearing shoes in temples', 'Road travel at night in rural areas'],
    'Best Souvenirs': ['Pashmina shawls from Kashmir', 'Darjeeling tea', 'Rajasthani block prints', 'Mysore sandalwood', 'Kolhapuri chappals', 'Madhubani paintings'],
  },
  Japan: {
    'Must Visit': ['Fushimi Inari Shrine', 'Mount Fuji', 'Hiroshima Peace Park', 'Arashiyama Bamboo Grove', 'Tokyo Shibuya', 'Nara Deer Park'],
    'Must Eat': ['Fresh sushi at Tsukiji', 'Ramen in Fukuoka', 'Okonomiyaki in Osaka', 'Matcha in Kyoto', 'Wagyu beef', 'Takoyaki street food'],
    'Avoid': ['Eating while walking', 'Loud phone calls on trains', 'Tipping at restaurants', 'Wearing shoes indoors', 'Sticking chopsticks upright in rice'],
    'Best Souvenirs': ['Japanese whisky', 'Handmade ceramics', 'Furoshiki wrapping cloths', 'Matcha tea sets', 'Tenugui towels', 'Lucky cat figurines'],
  },
  Thailand: {
    'Must Visit': ['Grand Palace, Bangkok', 'Phi Phi Islands', 'Chiang Mai Old City', 'Ayutthaya Ruins', 'Railay Beach', 'Doi Inthanon'],
    'Must Eat': ['Pad Thai from street stalls', 'Mango Sticky Rice', 'Tom Yum Goong', 'Khao Soi in Chiang Mai', 'Boat noodles in Bangkok', 'Papaya salad'],
    'Avoid': ['Touching people\'s heads', 'Pointing feet at Buddha', 'Jet ski rental scams', 'Ping pong show touts', 'Buying fake goods at markets'],
    'Best Souvenirs': ['Thai silk', 'Coconut oil products', 'Hill tribe crafts', 'Thai spices & curry pastes', 'Handmade soap', 'Elephant pants'],
  },
};

/* ──────────────── Component ──────────────── */

export default function AIPage() {
  // Trip Narrator state
  const [selectedTrip, setSelectedTrip] = useState('');
  const [outputFormat, setOutputFormat] = useState('blog');
  const [story, setStory] = useState('');
  const [displayedStory, setDisplayedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mood routes state
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  // Tips & recommendations state
  const [tipsCountry, setTipsCountry] = useState('India');
  const [recoTab, setRecoTab] = useState('Must Visit');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Smart recommendations state
  const [recoCategory, setRecoCategory] = useState('all');

  // Cleanup intervals
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  /* ── Trip Narrator ── */
  const handleGenerateStory = useCallback(() => {
    if (!selectedTrip) return;
    setIsGenerating(true);
    setDisplayedStory('');
    setCopied(false);

    const fullStory = mockStories[outputFormat] || mockStories.blog;
    setStory(fullStory);

    let idx = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      idx += 2;
      setDisplayedStory(fullStory.slice(0, idx));
      if (idx >= fullStory.length) {
        clearInterval(intervalRef.current!);
        setIsGenerating(false);
      }
    }, 10);
  }, [selectedTrip, outputFormat]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const shareContent = useCallback((text: string, platform: string) => {
    const encodedText = encodeURIComponent(text.slice(0, 280));
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  }, []);

  /* ── Chat ── */
  const handleSendMessage = useCallback((message?: string) => {
    const text = message || chatInput.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = mockChatResponses[text] || mockChatResponses.default;
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsChatLoading(false);
    }, 1200 + Math.random() * 800);
  }, [chatInput]);

  const handleChatKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleMessageReaction = useCallback((msgId: string, reaction: 'liked' | 'disliked') => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId
          ? { ...msg, [reaction]: !msg[reaction], [reaction === 'liked' ? 'disliked' : 'liked']: false }
          : msg
      )
    );
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  /* ── Derived data ── */
  const routes = selectedMood ? moodRoutes[selectedMood] || [] : [];
  const tips = smartTipsData[tipsCountry] || smartTipsData['India'];
  const recos = quickRecommendations[tipsCountry] || quickRecommendations['India'];
  const recoTabs = Object.keys(recos);
  const filteredRecommendations = recoCategory === 'all'
    ? mockRecommendations
    : mockRecommendations.filter((r) => r.tags.some((t) => t.toLowerCase() === recoCategory));

  const recoCategories = ['all', 'food', 'art', 'history', 'nature', 'hidden gem'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8733A] to-orange-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              AI Travel Assistant
            </h1>
            <p className="text-gray-500 text-sm mt-1">Intelligent travel planning powered by AI</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              AI Online
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="narrator" className="w-full">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <TabsList className="w-full flex overflow-x-auto bg-gray-100/80 p-1 rounded-xl gap-1">
            <TabsTrigger value="narrator" className="flex-1 gap-1.5 text-xs sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 hidden sm:block" />
              Narrator
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex-1 gap-1.5 text-xs sm:text-sm">
              <Compass className="w-3.5 h-3.5 hidden sm:block" />
              Mood Routes
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1 gap-1.5 text-xs sm:text-sm">
              <Star className="w-3.5 h-3.5 hidden sm:block" />
              For You
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex-1 gap-1.5 text-xs sm:text-sm">
              <Lightbulb className="w-3.5 h-3.5 hidden sm:block" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 gap-1.5 text-xs sm:text-sm">
              <MessageCircle className="w-3.5 h-3.5 hidden sm:block" />
              Ask AI
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* ═══════════════ TAB 1: TRIP NARRATOR ═══════════════ */}
        <TabsContent value="narrator">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Trip Narrator
                  <Badge variant="outline" className="ml-2 text-[10px]">AI Powered</Badge>
                </CardTitle>
                <p className="text-sm text-gray-500">Transform your completed trips into beautiful stories</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Trip selector */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Select a completed trip</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {mockTrips.map((trip) => (
                      <motion.button
                        key={trip.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTrip(trip.id)}
                        className={cn(
                          'p-3 rounded-xl border-2 text-left transition-all',
                          selectedTrip === trip.id
                            ? 'border-purple-400 bg-purple-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        )}
                      >
                        <p className="font-semibold text-sm text-[#1A3C5E]">{trip.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{trip.dates} &middot; {trip.days} days</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Output format selector */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Output format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {outputFormats.map((fmt) => {
                      const Icon = fmt.icon;
                      return (
                        <motion.button
                          key={fmt.key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setOutputFormat(fmt.key)}
                          className={cn(
                            'p-3 rounded-xl border-2 text-center transition-all',
                            outputFormat === fmt.key
                              ? 'border-purple-400 bg-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          )}
                        >
                          <Icon className={cn(
                            'w-5 h-5 mx-auto mb-1',
                            outputFormat === fmt.key ? 'text-purple-600' : 'text-gray-400'
                          )} />
                          <p className="text-sm font-medium text-gray-700">{fmt.label}</p>
                          <p className="text-[10px] text-gray-400">{fmt.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate button */}
                <Button
                  onClick={handleGenerateStory}
                  disabled={!selectedTrip || isGenerating}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating your story...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Story
                    </>
                  )}
                </Button>

                {/* Story output */}
                <AnimatePresence>
                  {(displayedStory || isGenerating) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Bot className="w-4 h-4 text-purple-500" />
                          <span className="text-xs font-medium text-purple-600">
                            {outputFormat === 'blog' ? 'Blog Post' : outputFormat === 'social' ? 'Social Media Caption' : 'WhatsApp Status'}
                          </span>
                          {isGenerating && (
                            <span className="text-[10px] text-purple-400 animate-pulse">Writing...</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {displayedStory}
                          {isGenerating && <span className="inline-block w-1.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle" />}
                        </p>
                      </div>

                      {/* Action buttons for completed story */}
                      {displayedStory && !isGenerating && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className={cn('gap-1.5 text-xs', copied && 'bg-green-50 text-green-600 border-green-200')}
                            onClick={() => copyToClipboard(displayedStory)}
                          >
                            {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => shareContent(displayedStory, 'whatsapp')}
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs text-blue-500 border-blue-200 hover:bg-blue-50"
                            onClick={() => shareContent(displayedStory, 'twitter')}
                          >
                            <Share2 className="w-3.5 h-3.5" /> Share
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            onClick={() => {
                              setDisplayedStory('');
                              setStory('');
                              handleGenerateStory();
                            }}
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ TAB 2: MOOD-BASED ROUTES ═══════════════ */}
        <TabsContent value="mood">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#E8733A]" />
                  Mood-Based Route Engine
                  <Badge variant="outline" className="ml-2 text-[10px]">AI Powered</Badge>
                </CardTitle>
                <p className="text-sm text-gray-500">Select your vibe and get AI-curated routes with matching POIs</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Mood selector */}
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
                          ? 'border-[#E8733A] bg-[#E8733A]/5 shadow-lg'
                          : mood.bg
                      )}
                    >
                      <span className="text-3xl block mb-1">{mood.emoji}</span>
                      <p className="text-sm font-semibold text-gray-700">{mood.label}</p>
                      <p className="text-[10px] text-gray-400">{mood.description}</p>
                    </motion.button>
                  ))}
                </div>

                {/* City selector */}
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 bg-gray-50 rounded-xl"
                  >
                    <MapPin className="w-4 h-4 text-[#E8733A] shrink-0" />
                    <span className="text-sm text-gray-600">Starting from:</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full sm:w-48 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* Route results */}
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
                          <Card className="h-full hover:shadow-lg transition-all group">
                            <CardContent className="p-5 flex flex-col h-full">
                              <div className={cn(
                                'w-full h-2 rounded-full bg-gradient-to-r mb-4',
                                moods.find((m) => m.key === selectedMood)?.color || 'from-gray-400 to-gray-500'
                              )} />
                              <h3 className="font-bold text-[#1A3C5E] mb-2">{route.name}</h3>
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{route.description}</p>

                              <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Route className="w-3 h-3" /> {route.distance}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.days} days</span>
                                <Badge variant="outline" className="text-[10px]">{route.difficulty}</Badge>
                              </div>

                              {/* Route stops visualization */}
                              <div className="mb-4">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {route.stops.map((stop, si) => (
                                    <div key={stop} className="flex items-center">
                                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                        {stop}
                                      </span>
                                      {si < route.stops.length - 1 && (
                                        <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-auto flex gap-2">
                                <Button className="flex-1 bg-[#E8733A] hover:bg-[#d4642e] text-white gap-2 text-sm">
                                  Plan This Route <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="outline" size="icon" className="shrink-0" onClick={() => copyToClipboard(route.name + ': ' + route.stops.join(' > '))}>
                                  <Copy className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!selectedMood && (
                  <div className="text-center py-8">
                    <Compass className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Select a mood above to discover curated routes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ TAB 3: SMART RECOMMENDATIONS ═══════════════ */}
        <TabsContent value="recommendations">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="space-y-4">
            {/* Personalized POI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Recommended For You
                  <Badge variant="outline" className="ml-2 text-[10px]">Personalized</Badge>
                </CardTitle>
                <p className="text-sm text-gray-500">Based on your travel history, interests, and current location</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {recoCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setRecoCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all capitalize',
                        recoCategory === cat
                          ? 'bg-[#E8733A] text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Recommendation cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecommendations.map((rec, i) => (
                    <motion.div
                      key={rec.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all group overflow-hidden">
                        <div className="h-24 bg-gradient-to-br from-[#1A3C5E]/5 to-[#E8733A]/5 flex items-center justify-center">
                          <motion.span
                            className="text-4xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: 'spring' }}
                          >
                            {rec.emoji}
                          </motion.span>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-bold text-[#1A3C5E] text-sm">{rec.name}</h3>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-semibold text-gray-600">{rec.rating}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-[#E8733A] font-medium mb-1">{rec.category}</p>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{rec.description}</p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {rec.tags.map((tag) => (
                              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              {rec.distance && (
                                <span className="flex items-center gap-1">
                                  <Navigation className="w-3 h-3" /> {rec.distance}
                                </span>
                              )}
                              <Badge variant="outline" className="text-[10px] py-0">{rec.priceLevel}</Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(rec.name + ' - ' + rec.description)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Share2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Recommendations by Country */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#E8733A]" />
                  Quick Picks
                </CardTitle>
                <select
                  value={tipsCountry}
                  onChange={(e) => {
                    setTipsCountry(e.target.value);
                    setRecoTab(Object.keys(quickRecommendations[e.target.value] || quickRecommendations['India'])[0]);
                  }}
                  className="w-full sm:w-48 h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30"
                >
                  {Object.keys(quickRecommendations).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
                    key={recoTab + tipsCountry}
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
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-full bg-[#E8733A]/10 flex items-center justify-center text-sm font-bold text-[#E8733A] shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700 flex-1">{item}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={() => copyToClipboard(item)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ TAB 4: TRAVEL TIPS ═══════════════ */}
        <TabsContent value="tips">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Smart Travel Tips
                    <Badge variant="outline" className="ml-2 text-[10px]">AI Powered</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Destination-specific tips, hidden gems, and local secrets</p>
                </div>
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipsCountry}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {tips.map((tip, i) => {
                      const Icon = tip.icon;
                      return (
                        <motion.div
                          key={tip.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className="h-full hover:shadow-md transition-all group">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-[#1A3C5E]" />
                                  </div>
                                  <h4 className="font-bold text-sm text-[#1A3C5E]">{tip.title}</h4>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => copyToClipboard(tip.title + ':\n' + tip.tips.join('\n'))}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
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
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ TAB 5: ASK AI (CHAT) ═══════════════ */}
        <TabsContent value="chat">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-[#1A3C5E] to-[#2a5580]">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Bot className="w-5 h-5" />
                  Ask AI Travel Assistant
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </CardTitle>
                {chatMessages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5 text-xs"
                    onClick={clearChat}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {/* Chat messages area */}
                <div className="h-[450px] overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                  {/* Welcome message */}
                  {chatMessages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8733A] to-orange-600 flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-9 h-9 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1A3C5E] mb-1">How can I help you travel better?</h3>
                      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                        Ask me anything about travel -- from finding hospitals abroad to packing tips and hidden gems.
                      </p>

                      {/* Quick suggestion chips */}
                      <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                        {chatSuggestions.map((suggestion) => (
                          <motion.button
                            key={suggestion}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSendMessage(suggestion)}
                            className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 hover:border-[#E8733A] hover:text-[#E8733A] transition-all shadow-sm"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Messages */}
                  <AnimatePresence>
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                          'flex gap-3',
                          msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        )}
                      >
                        {/* Avatar */}
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                          msg.role === 'user'
                            ? 'bg-[#1A3C5E] text-white'
                            : 'bg-gradient-to-br from-[#E8733A] to-orange-600 text-white'
                        )}>
                          {msg.role === 'user' ? (
                            <span className="text-xs font-bold">You</span>
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>

                        {/* Message bubble */}
                        <div className={cn(
                          'max-w-[80%] rounded-2xl p-4 shadow-sm',
                          msg.role === 'user'
                            ? 'bg-[#1A3C5E] text-white rounded-tr-sm'
                            : 'bg-white border border-gray-200 rounded-tl-sm'
                        )}>
                          <p className={cn(
                            'text-sm leading-relaxed whitespace-pre-line',
                            msg.role === 'user' ? 'text-white' : 'text-gray-700'
                          )}>
                            {msg.content}
                          </p>
                          <div className={cn(
                            'flex items-center gap-2 mt-2 pt-2 border-t',
                            msg.role === 'user' ? 'border-white/20' : 'border-gray-100'
                          )}>
                            <span className={cn(
                              'text-[10px]',
                              msg.role === 'user' ? 'text-white/60' : 'text-gray-400'
                            )}>
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                            {msg.role === 'assistant' && (
                              <div className="flex items-center gap-1 ml-auto">
                                <button
                                  onClick={() => copyToClipboard(msg.content)}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                                  title="Copy"
                                >
                                  <Copy className="w-3 h-3 text-gray-400" />
                                </button>
                                <button
                                  onClick={() => toggleMessageReaction(msg.id, 'liked')}
                                  className={cn('p-1 rounded hover:bg-gray-100 transition-colors', msg.liked && 'bg-green-50')}
                                  title="Helpful"
                                >
                                  <ThumbsUp className={cn('w-3 h-3', msg.liked ? 'text-green-500' : 'text-gray-400')} />
                                </button>
                                <button
                                  onClick={() => toggleMessageReaction(msg.id, 'disliked')}
                                  className={cn('p-1 rounded hover:bg-gray-100 transition-colors', msg.disliked && 'bg-red-50')}
                                  title="Not helpful"
                                >
                                  <ThumbsDown className={cn('w-3 h-3', msg.disliked ? 'text-red-500' : 'text-gray-400')} />
                                </button>
                                <button
                                  onClick={() => shareContent(msg.content, 'whatsapp')}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                                  title="Share"
                                >
                                  <Share2 className="w-3 h-3 text-gray-400" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  {isChatLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8733A] to-orange-600 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick suggestions when chat has messages */}
                {chatMessages.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100 bg-white">
                    <div className="flex gap-2 overflow-x-auto scrollbar-none">
                      {chatSuggestions.slice(0, 3).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSendMessage(s)}
                          className="px-3 py-1 rounded-full bg-gray-100 text-[10px] text-gray-500 hover:bg-gray-200 transition-colors whitespace-nowrap shrink-0"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleChatKeyDown}
                      placeholder="Ask anything about travel..."
                      className="flex-1 rounded-xl"
                      disabled={isChatLoading}
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="bg-[#E8733A] hover:bg-[#d4642e] text-white rounded-xl px-4"
                    >
                      {isChatLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-center">
                    AI responses are generated suggestions. Always verify critical information locally.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
