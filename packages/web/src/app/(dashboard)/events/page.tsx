'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Star, Sun, Sunrise, Sunset, Clock,
  Sparkles, Music, Trophy, Palette, ChevronLeft, ChevronRight,
  Ticket, Filter, Search, Heart, Plus, Check, Eye,
  Mountain, ChefHat, Hammer, TreePine, Globe, Users,
  PartyPopper, Timer, Camera, Bookmark, Share2, Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/* ──────────────── Animation presets ──────────────── */

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ──────────────── Types ──────────────── */

type EventCategory = 'All' | 'Festivals' | 'Concerts' | 'Sports' | 'Cultural' | 'Local Experiences';

interface EventItem {
  id: number;
  name: string;
  type: string;
  category: EventCategory;
  dateStart: string;
  dateEnd: string;
  location: string;
  country: string;
  description: string;
  image: string;
  price: string;
  attendees: number;
  isOnRoute: boolean;
  isFeatured: boolean;
}

interface LocalExperience {
  id: number;
  name: string;
  type: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: string;
  location: string;
  host: string;
  maxGroupSize: number;
  tags: string[];
  emoji: string;
  bgColor: string;
  highlights: string[];
}

interface FestivalEntry {
  name: string;
  date: string;
  country: string;
  significance: string;
  bestSpots: string[];
  tips: string;
  type: 'religious' | 'cultural' | 'harvest' | 'national';
}

interface SunData {
  location: string;
  sunrise: string;
  sunset: string;
  goldenHourStart: string;
  goldenHourEnd: string;
  blueHourStart: string;
  blueHourEnd: string;
  dayLength: string;
  bestViewpoints: { name: string; type: string; rating: number }[];
}

/* ──────────────── Category config ──────────────── */

const categoryConfig: Record<EventCategory, { icon: React.ElementType; color: string; bg: string }> = {
  All: { icon: Sparkles, color: 'text-[#E8733A]', bg: 'bg-orange-100' },
  Festivals: { icon: PartyPopper, color: 'text-purple-700', bg: 'bg-purple-100' },
  Concerts: { icon: Music, color: 'text-pink-700', bg: 'bg-pink-100' },
  Sports: { icon: Trophy, color: 'text-green-700', bg: 'bg-green-100' },
  Cultural: { icon: Palette, color: 'text-amber-700', bg: 'bg-amber-100' },
  'Local Experiences': { icon: Heart, color: 'text-rose-700', bg: 'bg-rose-100' },
};

const typeColors: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  Festival: { border: 'border-l-purple-500', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  Concert: { border: 'border-l-pink-500', bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  Sports: { border: 'border-l-green-500', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  Workshop: { border: 'border-l-blue-500', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  Cultural: { border: 'border-l-amber-500', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Experience: { border: 'border-l-rose-500', bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  'Food & Drink': { border: 'border-l-orange-500', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Heritage Walk': { border: 'border-l-teal-500', bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' },
  Trek: { border: 'border-l-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

/* ──────────────── Mock Data: Events Along Route ──────────────── */

const mockEvents: EventItem[] = [
  {
    id: 1, name: 'Holi - Festival of Colors', type: 'Festival', category: 'Festivals',
    dateStart: 'Mar 14, 2026', dateEnd: 'Mar 15, 2026', location: 'Mathura, Uttar Pradesh', country: 'India',
    description: 'Celebrate the vibrant festival of colors with music, dance, and gulal in the birthplace of Lord Krishna. One of the most visually spectacular festivals on earth.',
    image: '', price: 'Free', attendees: 50000, isOnRoute: true, isFeatured: true,
  },
  {
    id: 2, name: 'Diwali - Festival of Lights', type: 'Festival', category: 'Festivals',
    dateStart: 'Oct 20, 2026', dateEnd: 'Oct 24, 2026', location: 'Varanasi, Uttar Pradesh', country: 'India',
    description: 'Witness thousands of diyas illuminating the ghats of Varanasi during the grandest celebration of lights. The Dev Deepawali spectacle is unforgettable.',
    image: '', price: 'Free', attendees: 100000, isOnRoute: true, isFeatured: true,
  },
  {
    id: 3, name: 'Pongal Harvest Festival', type: 'Cultural', category: 'Cultural',
    dateStart: 'Jan 14, 2027', dateEnd: 'Jan 17, 2027', location: 'Thanjavur, Tamil Nadu', country: 'India',
    description: 'Experience the traditional harvest festival with kolam art, Jallikattu bull-taming, and sweet pongal cooking in the rice bowl of Tamil Nadu.',
    image: '', price: 'Free', attendees: 25000, isOnRoute: false, isFeatured: false,
  },
  {
    id: 4, name: 'Durga Puja Pandal Walk', type: 'Festival', category: 'Festivals',
    dateStart: 'Oct 1, 2026', dateEnd: 'Oct 5, 2026', location: 'Kolkata, West Bengal', country: 'India',
    description: 'Marvel at artistic pandals and immerse yourself in the electrifying energy of Kolkata during Durga Puja. A UNESCO Intangible Cultural Heritage.',
    image: '', price: 'Free', attendees: 200000, isOnRoute: true, isFeatured: true,
  },
  {
    id: 5, name: 'Onam Snake Boat Race', type: 'Sports', category: 'Sports',
    dateStart: 'Sep 5, 2026', dateEnd: 'Sep 5, 2026', location: 'Alappuzha, Kerala', country: 'India',
    description: 'Watch the thrilling Vallam Kali snake boat races on the backwaters of Alappuzha during Onam celebrations. Over 100 rowers per boat.',
    image: '', price: '500', attendees: 15000, isOnRoute: false, isFeatured: false,
  },
  {
    id: 6, name: 'Pushkar Camel Fair', type: 'Cultural', category: 'Cultural',
    dateStart: 'Nov 6, 2026', dateEnd: 'Nov 14, 2026', location: 'Pushkar, Rajasthan', country: 'India',
    description: 'One of the world\'s largest camel fairs featuring trading, folk music, cultural performances, and hot air balloon rides over the Thar.',
    image: '', price: '200', attendees: 30000, isOnRoute: true, isFeatured: true,
  },
  {
    id: 7, name: 'Hornbill Festival', type: 'Festival', category: 'Festivals',
    dateStart: 'Dec 1, 2026', dateEnd: 'Dec 10, 2026', location: 'Kisama, Nagaland', country: 'India',
    description: 'The "Festival of Festivals" showcasing Naga tribal heritage with warrior dances, crafts, indigenous games, and traditional cuisine.',
    image: '', price: 'Free', attendees: 10000, isOnRoute: false, isFeatured: false,
  },
  {
    id: 8, name: 'Rann Utsav', type: 'Cultural', category: 'Cultural',
    dateStart: 'Nov 7, 2026', dateEnd: 'Feb 20, 2027', location: 'Kutch, Gujarat', country: 'India',
    description: 'Experience the white salt desert under full moonlight with folk performances, handicrafts, adventure activities, and luxury tent stays.',
    image: '', price: '1500', attendees: 8000, isOnRoute: true, isFeatured: false,
  },
  {
    id: 9, name: 'NH7 Weekender Music Festival', type: 'Concert', category: 'Concerts',
    dateStart: 'Nov 28, 2026', dateEnd: 'Nov 30, 2026', location: 'Pune, Maharashtra', country: 'India',
    description: 'India\'s happiest music festival with multiple stages, indie artists, international headliners, food stalls, and art installations.',
    image: '', price: '3500', attendees: 20000, isOnRoute: false, isFeatured: true,
  },
  {
    id: 10, name: 'Magnetic Fields Festival', type: 'Concert', category: 'Concerts',
    dateStart: 'Dec 12, 2026', dateEnd: 'Dec 14, 2026', location: 'Alsisar, Rajasthan', country: 'India',
    description: 'Electronic music festival in a stunning 17th-century palace in the Rajasthani desert. Art, music, and Rajput heritage blend seamlessly.',
    image: '', price: '8000', attendees: 5000, isOnRoute: false, isFeatured: false,
  },
  {
    id: 11, name: 'Indian Premier League Match', type: 'Sports', category: 'Sports',
    dateStart: 'Apr 15, 2026', dateEnd: 'Apr 15, 2026', location: 'Wankhede Stadium, Mumbai', country: 'India',
    description: 'Catch the electric atmosphere of a T20 cricket match at one of India\'s most iconic stadiums. An unmissable sporting spectacle.',
    image: '', price: '2000', attendees: 33000, isOnRoute: true, isFeatured: false,
  },
  {
    id: 12, name: 'Spiti Valley Photography Workshop', type: 'Workshop', category: 'Local Experiences',
    dateStart: 'Jun 10, 2026', dateEnd: 'Jun 17, 2026', location: 'Spiti, Himachal Pradesh', country: 'India',
    description: 'Week-long landscape photography expedition through ancient monasteries, high-altitude lakes, and remote Himalayan villages.',
    image: '', price: '25000', attendees: 15, isOnRoute: false, isFeatured: false,
  },
];

/* ──────────────── Mock Data: Local Experiences ──────────────── */

const localExperiences: LocalExperience[] = [
  {
    id: 1, name: 'Varanasi Ghat Sunrise Walk', type: 'Heritage Walk',
    description: 'Morning walk through ancient ghats with a local historian guide, ending with a traditional chai at a 200-year-old shop.',
    rating: 4.8, reviewCount: 342, price: 1200, duration: '3 hours', location: 'Varanasi, UP',
    host: 'Rajesh Mishra', maxGroupSize: 8, tags: ['History', 'Photography', 'Spiritual'],
    emoji: '', bgColor: 'bg-amber-50',
    highlights: ['Guided by 4th-generation local', 'See Ganga Aarti preparation', 'Visit hidden temples'],
  },
  {
    id: 2, name: 'Jaipur Block Printing Masterclass', type: 'Workshop',
    description: 'Learn traditional Rajasthani block printing on fabric with artisans who have practiced for five generations.',
    rating: 4.6, reviewCount: 189, price: 1500, duration: '4 hours', location: 'Jaipur, Rajasthan',
    host: 'Priya Sharma', maxGroupSize: 6, tags: ['Art', 'Craft', 'Traditional'],
    emoji: '', bgColor: 'bg-blue-50',
    highlights: ['Take home your creation', 'Meet master artisans', 'Learn natural dye techniques'],
  },
  {
    id: 3, name: 'Kerala Backwater Cooking Experience', type: 'Cooking Class',
    description: 'Cook a traditional Kerala Sadya feast on a houseboat using fresh ingredients from local markets and backwater fish.',
    rating: 4.9, reviewCount: 467, price: 2800, duration: '5 hours', location: 'Alleppey, Kerala',
    host: 'Lakshmi Nair', maxGroupSize: 4, tags: ['Food', 'Cooking', 'Cultural'],
    emoji: '', bgColor: 'bg-green-50',
    highlights: ['Market visit included', 'Learn 5 signature dishes', 'Eat on the houseboat'],
  },
  {
    id: 4, name: 'Darjeeling Tea Estate Tour', type: 'Food & Drink',
    description: 'Visit a heritage tea estate, walk through rolling plantations, and taste first-flush varieties with a certified tea sommelier.',
    rating: 4.7, reviewCount: 256, price: 800, duration: '2.5 hours', location: 'Darjeeling, WB',
    host: 'Tenzing Dorji', maxGroupSize: 10, tags: ['Tea', 'Nature', 'Learning'],
    emoji: '', bgColor: 'bg-yellow-50',
    highlights: ['Taste 6 rare varieties', 'See full processing', 'Take home tea samples'],
  },
  {
    id: 5, name: 'Coorg Coffee & Spice Trail', type: 'Farm Stay',
    description: 'Explore lush coffee plantations, learn about shade-grown arabica, pick spices, and stay overnight in a colonial-era planter bungalow.',
    rating: 4.8, reviewCount: 198, price: 4500, duration: 'Full day + overnight', location: 'Coorg, Karnataka',
    host: 'Kaveri Estates', maxGroupSize: 8, tags: ['Coffee', 'Nature', 'Farm Stay'],
    emoji: '', bgColor: 'bg-emerald-50',
    highlights: ['Coffee picking experience', 'Spice garden walk', 'Planter\'s dinner included'],
  },
  {
    id: 6, name: 'Himalayan Guided Trek to Triund', type: 'Trek',
    description: 'Guided overnight trek to Triund peak with camping, bonfire, stargazing, and panoramic views of the Dhauladhar range.',
    rating: 4.7, reviewCount: 523, price: 3200, duration: '2 days', location: 'McLeodganj, HP',
    host: 'Himalayan Trails Co.', maxGroupSize: 12, tags: ['Trekking', 'Adventure', 'Nature'],
    emoji: '', bgColor: 'bg-sky-50',
    highlights: ['Professional guide', 'Camping gear included', 'Sunset & sunrise views'],
  },
  {
    id: 7, name: 'Rajasthani Pottery Workshop', type: 'Workshop',
    description: 'Shape clay on a traditional wheel with a master potter in a centuries-old workshop in the blue city of Jodhpur.',
    rating: 4.5, reviewCount: 134, price: 900, duration: '2 hours', location: 'Jodhpur, Rajasthan',
    host: 'Gopal Kumhar', maxGroupSize: 5, tags: ['Craft', 'Art', 'Traditional'],
    emoji: '', bgColor: 'bg-orange-50',
    highlights: ['Hands-on wheel throwing', 'Paint your creation', 'Take it home after firing'],
  },
  {
    id: 8, name: 'Goa Spice Plantation & Lunch', type: 'Food & Drink',
    description: 'Tour a tropical spice plantation, learn about cashew, cardamom, vanilla, and cinnamon, followed by an authentic Goan lunch.',
    rating: 4.6, reviewCount: 312, price: 1100, duration: '3 hours', location: 'Ponda, Goa',
    host: 'Sahakari Farms', maxGroupSize: 20, tags: ['Food', 'Nature', 'Learning'],
    emoji: '', bgColor: 'bg-lime-50',
    highlights: ['Elephant encounter', 'Spice tasting', 'Traditional Goan buffet'],
  },
];

/* ──────────────── Mock Data: Festival Calendar ──────────────── */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const festivalCalendar: Record<string, FestivalEntry[]> = {
  Jan: [
    { name: 'Pongal', date: 'Jan 14-17', country: 'India (Tamil Nadu)', significance: 'Harvest festival celebrating the Sun God and new beginnings', bestSpots: ['Thanjavur', 'Madurai', 'Trichy'], tips: 'Attend Jallikattu for an adrenaline rush', type: 'harvest' },
    { name: 'Republic Day', date: 'Jan 26', country: 'India (National)', significance: 'Commemorates adoption of the Indian Constitution', bestSpots: ['Rajpath, New Delhi', 'Marine Drive, Mumbai'], tips: 'Book Rajpath seats weeks in advance', type: 'national' },
    { name: 'Lohri', date: 'Jan 13', country: 'India (Punjab)', significance: 'Bonfire festival marking the end of winter', bestSpots: ['Amritsar', 'Chandigarh', 'Ludhiana'], tips: 'Join a local family celebration for authentic experience', type: 'harvest' },
  ],
  Feb: [
    { name: 'Goa Carnival', date: 'Feb 14-17', country: 'India (Goa)', significance: 'Portuguese-influenced carnival with parades, music, and dance', bestSpots: ['Panaji', 'Margao', 'Vasco'], tips: 'Panjim parade on opening Saturday is a must-see', type: 'cultural' },
    { name: 'Vasant Panchami', date: 'Feb 2', country: 'India (National)', significance: 'Celebration of spring and Goddess Saraswati', bestSpots: ['Shantiniketan, WB', 'Varanasi', 'Jaipur'], tips: 'Wear yellow clothes as tradition', type: 'religious' },
  ],
  Mar: [
    { name: 'Holi', date: 'Mar 14-15', country: 'India (National)', significance: 'Triumph of good over evil, arrival of spring', bestSpots: ['Mathura & Vrindavan', 'Barsana (Lathmar Holi)', 'Jaipur'], tips: 'Use natural colors and protect your eyes', type: 'religious' },
    { name: 'Chapchar Kut', date: 'Mar 7', country: 'India (Mizoram)', significance: 'Spring festival after the jhum clearing of forest', bestSpots: ['Aizawl'], tips: 'Try traditional Mizo rice beer', type: 'harvest' },
  ],
  Apr: [
    { name: 'Baisakhi', date: 'Apr 13', country: 'India (Punjab)', significance: 'Sikh New Year and harvest festival', bestSpots: ['Golden Temple, Amritsar', 'Talwandi Sabo'], tips: 'Join the Nagar Kirtan procession', type: 'harvest' },
    { name: 'Bihu', date: 'Apr 14-20', country: 'India (Assam)', significance: 'Assamese New Year harvest celebration', bestSpots: ['Guwahati', 'Jorhat', 'Sivasagar'], tips: 'Watch the traditional Bihu dance performances', type: 'harvest' },
  ],
  May: [
    { name: 'Buddha Purnima', date: 'May 12', country: 'India (National)', significance: 'Birthday of Gautam Buddha', bestSpots: ['Bodh Gaya', 'Sarnath', 'Dharamsala'], tips: 'Visit the Mahabodhi Temple at dawn', type: 'religious' },
    { name: 'Thrissur Pooram', date: 'May 6', country: 'India (Kerala)', significance: 'Grand elephant festival with spectacular fireworks', bestSpots: ['Thrissur'], tips: 'Arrive early; the Kudamattam ceremony is breathtaking', type: 'religious' },
  ],
  Jun: [
    { name: 'Rath Yatra', date: 'Jun 26', country: 'India (Odisha)', significance: 'Chariot festival of Lord Jagannath', bestSpots: ['Puri'], tips: 'The chariot pulling is an incredible crowd experience', type: 'religious' },
    { name: 'Hemis Festival', date: 'Jun 9-10', country: 'India (Ladakh)', significance: 'Masked dance festival at Hemis Monastery', bestSpots: ['Hemis Monastery, Leh'], tips: 'Combine with a Markha Valley trek', type: 'religious' },
  ],
  Jul: [
    { name: 'Bonalu', date: 'Jul 7-28', country: 'India (Telangana)', significance: 'Thanksgiving to Goddess Mahakali', bestSpots: ['Golconda Fort, Hyderabad', 'Secunderabad', 'Lal Darwaza'], tips: 'Watch the Rangam (oracle) ceremony at Ujjaini Mahankali Temple', type: 'religious' },
    { name: 'Guru Purnima', date: 'Jul 10', country: 'India (National)', significance: 'Day honoring spiritual teachers and gurus', bestSpots: ['Varanasi', 'Rishikesh', 'Shirdi'], tips: 'Many ashrams hold special satsangs', type: 'religious' },
  ],
  Aug: [
    { name: 'Independence Day', date: 'Aug 15', country: 'India (National)', significance: 'Celebrates independence from British rule', bestSpots: ['Red Fort, Delhi', 'Wagah Border'], tips: 'Flag hoisting at Red Fort is iconic', type: 'national' },
    { name: 'Janmashtami', date: 'Aug 26', country: 'India (National)', significance: 'Birth of Lord Krishna', bestSpots: ['Mathura', 'Mumbai (Dahi Handi)', 'Dwarka'], tips: 'Mumbai\'s Dahi Handi is a thrilling human pyramid spectacle', type: 'religious' },
    { name: 'Onam', date: 'Aug 28 - Sep 8', country: 'India (Kerala)', significance: 'Homecoming of legendary King Mahabali', bestSpots: ['Thrissur', 'Kochi', 'Thiruvananthapuram'], tips: 'Don\'t miss the traditional Onam Sadya feast', type: 'harvest' },
  ],
  Sep: [
    { name: 'Ganesh Chaturthi', date: 'Sep 7-17', country: 'India (Maharashtra)', significance: 'Birthday of Lord Ganesha', bestSpots: ['Mumbai', 'Pune', 'Hyderabad'], tips: 'Lalbaugcha Raja in Mumbai draws millions', type: 'religious' },
    { name: 'Onam Boat Race', date: 'Sep 5', country: 'India (Kerala)', significance: 'Traditional Vallam Kali snake boat races', bestSpots: ['Alappuzha (Alleppey)'], tips: 'Book backwater houseboat to watch from the water', type: 'cultural' },
  ],
  Oct: [
    { name: 'Durga Puja', date: 'Oct 1-5', country: 'India (West Bengal)', significance: 'Victory of Goddess Durga over the demon Mahishasura. UNESCO Heritage.', bestSpots: ['Kolkata - Bagbazar', 'Kolkata - Kumartuli', 'Kolkata - Deshapriya Park'], tips: 'Do a night-time pandal hopping tour', type: 'religious' },
    { name: 'Dussehra', date: 'Oct 2', country: 'India (National)', significance: 'Victory of Rama over Ravana', bestSpots: ['Mysuru Palace', 'Ramlila Maidan, Delhi', 'Kullu Valley'], tips: 'Mysuru Dussehra is the grandest with elephant processions', type: 'religious' },
    { name: 'Diwali', date: 'Oct 20-24', country: 'India (National)', significance: 'Return of Lord Rama to Ayodhya. Festival of lights and new beginnings.', bestSpots: ['Varanasi Ghats', 'Jaipur', 'Ayodhya', 'Amritsar Golden Temple'], tips: 'Dev Deepawali in Varanasi (Nov 5) is the grand encore', type: 'religious' },
  ],
  Nov: [
    { name: 'Pushkar Camel Fair', date: 'Nov 6-14', country: 'India (Rajasthan)', significance: 'Ancient livestock fair tied to Hindu pilgrimage', bestSpots: ['Pushkar Fairgrounds', 'Pushkar Lake'], tips: 'Hot air balloon ride at dawn offers stunning views', type: 'cultural' },
    { name: 'Rann Utsav', date: 'Nov 7 - Feb 20', country: 'India (Gujarat)', significance: 'Celebration of the white desert landscape and Kutchi culture', bestSpots: ['White Rann, Kutch', 'Dholavira'], tips: 'Full moon nights are magical on the white salt desert', type: 'cultural' },
    { name: 'Chhath Puja', date: 'Nov 7-8', country: 'India (Bihar)', significance: 'Ancient Vedic festival dedicated to the Sun God', bestSpots: ['Patna Ghats', 'Varanasi', 'Delhi Yamuna Ghats'], tips: 'The sunset and sunrise arghya rituals are profoundly moving', type: 'religious' },
  ],
  Dec: [
    { name: 'Hornbill Festival', date: 'Dec 1-10', country: 'India (Nagaland)', significance: 'Showcase of Naga tribal heritage and unity', bestSpots: ['Kisama Heritage Village', 'Kohima'], tips: 'Try smoked pork and fermented bamboo shoot dishes', type: 'cultural' },
    { name: 'Christmas in Goa', date: 'Dec 24-25', country: 'India (Goa)', significance: 'Vibrant Christmas celebration with Portuguese heritage', bestSpots: ['Basilica of Bom Jesus', 'Panaji', 'Old Goa churches'], tips: 'Midnight Mass at Se Cathedral is spectacular', type: 'religious' },
    { name: 'Goa Sunburn Festival', date: 'Dec 27-29', country: 'India (Goa)', significance: 'Asia\'s largest electronic music festival', bestSpots: ['Vagator Beach area'], tips: 'Book accommodation in Anjuna/Vagator well in advance', type: 'cultural' },
  ],
};

const festivalTypeStyles: Record<string, { bg: string; text: string }> = {
  religious: { bg: 'bg-violet-100', text: 'text-violet-700' },
  cultural: { bg: 'bg-amber-100', text: 'text-amber-700' },
  harvest: { bg: 'bg-green-100', text: 'text-green-700' },
  national: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

/* ──────────────── Mock Data: Sunset & Golden Hour ──────────────── */

const sunDataByLocation: Record<string, SunData> = {
  'Varanasi': {
    location: 'Varanasi, Uttar Pradesh',
    sunrise: '6:12 AM', sunset: '6:34 PM',
    goldenHourStart: '5:48 PM', goldenHourEnd: '6:34 PM',
    blueHourStart: '5:24 AM', blueHourEnd: '5:54 AM',
    dayLength: '12h 22m',
    bestViewpoints: [
      { name: 'Dashashwamedh Ghat', type: 'Riverfront', rating: 4.9 },
      { name: 'Assi Ghat', type: 'Riverfront', rating: 4.7 },
      { name: 'Ramnagar Fort', type: 'Heritage', rating: 4.5 },
    ],
  },
  'Goa': {
    location: 'Panaji, Goa',
    sunrise: '6:38 AM', sunset: '6:42 PM',
    goldenHourStart: '6:02 PM', goldenHourEnd: '6:42 PM',
    blueHourStart: '5:58 AM', blueHourEnd: '6:28 AM',
    dayLength: '12h 04m',
    bestViewpoints: [
      { name: 'Chapora Fort', type: 'Clifftop', rating: 4.8 },
      { name: 'Cabo de Rama', type: 'Clifftop', rating: 4.6 },
      { name: 'Palolem Beach', type: 'Beach', rating: 4.7 },
    ],
  },
  'Jaipur': {
    location: 'Jaipur, Rajasthan',
    sunrise: '6:28 AM', sunset: '6:38 PM',
    goldenHourStart: '5:54 PM', goldenHourEnd: '6:38 PM',
    blueHourStart: '5:48 AM', blueHourEnd: '6:18 AM',
    dayLength: '12h 10m',
    bestViewpoints: [
      { name: 'Nahargarh Fort', type: 'Hilltop', rating: 4.9 },
      { name: 'Jal Mahal', type: 'Lakeside', rating: 4.7 },
      { name: 'Hawa Mahal Rooftop', type: 'Heritage', rating: 4.6 },
    ],
  },
  'Leh': {
    location: 'Leh, Ladakh',
    sunrise: '6:05 AM', sunset: '6:45 PM',
    goldenHourStart: '6:00 PM', goldenHourEnd: '6:45 PM',
    blueHourStart: '5:18 AM', blueHourEnd: '5:50 AM',
    dayLength: '12h 40m',
    bestViewpoints: [
      { name: 'Pangong Lake', type: 'Lakeside', rating: 5.0 },
      { name: 'Khardung La Pass', type: 'Mountain Pass', rating: 4.8 },
      { name: 'Shanti Stupa', type: 'Hilltop', rating: 4.7 },
    ],
  },
};

const sunLocations = Object.keys(sunDataByLocation);

/* ──────────────── Country filter data ──────────────── */
const countries = ['All', 'India'];

/* ──────────────── Star Rating Component ──────────────── */

function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            'w-3.5 h-3.5',
            s <= Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : s === Math.ceil(rating) && rating % 1 >= 0.5
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-200'
          )}
        />
      ))}
      <span className="text-xs font-semibold text-gray-600 ml-0.5">{rating}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">({reviewCount})</span>
      )}
    </div>
  );
}

/* ──────────────── Loading Skeleton ──────────────── */

function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-full mb-1" />
        <div className="h-3 bg-gray-100 rounded w-5/6 mb-3" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function ExperienceSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-100" />
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-full mb-1" />
        <div className="h-3 bg-gray-100 rounded w-4/5 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </CardContent>
    </Card>
  );
}

/* ──────────────── Main Page Component ──────────────── */

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<string>('events');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Mar');
  const [sunLocation, setSunLocation] = useState('Varanasi');
  const [addedToItinerary, setAddedToItinerary] = useState<Set<number>>(new Set());
  const [bookmarkedExperiences, setBookmarkedExperiences] = useState<Set<number>>(new Set());
  const [showOnRouteOnly, setShowOnRouteOnly] = useState(false);
  const [isLoading] = useState(false);
  const [goldenHourReminder, setGoldenHourReminder] = useState(false);
  const [expandedFestival, setExpandedFestival] = useState<string | null>(null);

  /* ── Filtered events ── */
  const filteredEvents = useMemo(() => {
    let events = mockEvents;
    if (selectedCategory !== 'All') {
      events = events.filter((e) => e.category === selectedCategory);
    }
    if (showOnRouteOnly) {
      events = events.filter((e) => e.isOnRoute);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q)
      );
    }
    return events;
  }, [selectedCategory, showOnRouteOnly, searchQuery]);

  /* ── Handlers ── */
  const toggleItinerary = useCallback((eventId: number) => {
    setAddedToItinerary((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((expId: number) => {
    setBookmarkedExperiences((prev) => {
      const next = new Set(prev);
      if (next.has(expId)) next.delete(expId);
      else next.add(expId);
      return next;
    });
  }, []);

  const sunData = sunDataByLocation[sunLocation];

  const featuredEvents = mockEvents.filter((e) => e.isFeatured);
  const onRouteCount = mockEvents.filter((e) => e.isOnRoute).length;

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <motion.div {...fadeIn}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#1A3C5E]">Events & Local Experiences</h1>
            <p className="text-gray-500 mt-1">Discover festivals, local experiences, and golden hours along your route</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#E8733A]/10 text-[#E8733A] border-[#E8733A]/30 gap-1">
              <MapPin className="w-3 h-3" />
              {onRouteCount} on your route
            </Badge>
            <Badge className="bg-[#1A3C5E]/10 text-[#1A3C5E] border-[#1A3C5E]/30 gap-1">
              <Calendar className="w-3 h-3" />
              {mockEvents.length} upcoming
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Stats ─── */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Festivals', count: mockEvents.filter((e) => e.category === 'Festivals').length, icon: PartyPopper, color: 'from-purple-500 to-purple-700' },
            { label: 'Concerts', count: mockEvents.filter((e) => e.category === 'Concerts').length, icon: Music, color: 'from-pink-500 to-pink-700' },
            { label: 'Experiences', count: localExperiences.length, icon: Heart, color: 'from-rose-500 to-rose-700' },
            { label: 'Sports', count: mockEvents.filter((e) => e.category === 'Sports').length, icon: Trophy, color: 'from-green-500 to-green-700' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0', stat.color)}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A3C5E]">{stat.count}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Main Tabs ─── */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex gap-1 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="events" className="gap-1.5 text-xs sm:text-sm rounded-lg">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Events Along Route</span>
              <span className="sm:hidden">Events</span>
            </TabsTrigger>
            <TabsTrigger value="experiences" className="gap-1.5 text-xs sm:text-sm rounded-lg">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Local Experiences</span>
              <span className="sm:hidden">Experiences</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-1.5 text-xs sm:text-sm rounded-lg">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Festival Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="golden" className="gap-1.5 text-xs sm:text-sm rounded-lg">
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Golden Hour</span>
              <span className="sm:hidden">Sunset</span>
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════ TAB 1: Events Along Route ═══════════════ */}
          <TabsContent value="events" className="space-y-4 mt-4">
            {/* Featured events carousel */}
            {featuredEvents.length > 0 && (
              <motion.div {...fadeIn}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#E8733A]" />
                  Featured Events
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
                  {featuredEvents.map((event, i) => {
                    const tc = typeColors[event.type] || typeColors.Festival;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="min-w-[280px] max-w-[320px] shrink-0"
                      >
                        <Card className="bg-gradient-to-br from-[#1A3C5E] to-[#1A3C5E]/90 text-white border-0 overflow-hidden hover:shadow-xl transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <Badge className={cn('text-xs', tc.bg, tc.text)}>{event.type}</Badge>
                              {event.isOnRoute && (
                                <Badge className="bg-white/20 text-white border-white/30 text-[10px] gap-1">
                                  <MapPin className="w-2.5 h-2.5" /> On Route
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-bold text-lg mb-2 leading-tight">{event.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-white/70 mb-3">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.dateStart}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location.split(',')[0]}</span>
                            </div>
                            <p className="text-xs text-white/60 line-clamp-2 mb-4">{event.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs text-white/50">
                                <Users className="w-3 h-3" />
                                {event.attendees >= 1000 ? `${(event.attendees / 1000).toFixed(0)}K+` : event.attendees} attending
                              </div>
                              <Button
                                size="sm"
                                onClick={() => toggleItinerary(event.id)}
                                className={cn(
                                  'gap-1 text-xs h-7',
                                  addedToItinerary.has(event.id)
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-white text-[#1A3C5E] hover:bg-white/90'
                                )}
                              >
                                {addedToItinerary.has(event.id) ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {addedToItinerary.has(event.id) ? 'Added' : 'Add'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Category filters & search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search events by name, location, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showOnRouteOnly ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'gap-1.5 whitespace-nowrap',
                  showOnRouteOnly ? 'bg-[#E8733A] hover:bg-[#d4642e]' : 'text-gray-600'
                )}
                onClick={() => setShowOnRouteOnly(!showOnRouteOnly)}
              >
                <MapPin className="w-3.5 h-3.5" />
                On Route Only
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {(Object.keys(categoryConfig) as EventCategory[]).map((cat) => {
                const config = categoryConfig[cat];
                const Icon = config.icon;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                      selectedCategory === cat
                        ? 'bg-[#1A3C5E] text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Events grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)}
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No events match your filters</p>
                  <p className="text-gray-300 text-sm mt-1">Try adjusting your search or category selection</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map((event, i) => {
                  const tc = typeColors[event.type] || typeColors.Festival;
                  const isAdded = addedToItinerary.has(event.id);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i }}
                    >
                      <Card className={cn('border-l-4 hover:shadow-lg transition-all group', tc.border)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-bold text-[#1A3C5E] text-sm leading-tight">{event.name}</h3>
                                {event.isOnRoute && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-[#E8733A] font-medium bg-[#E8733A]/10 px-1.5 py-0.5 rounded-full">
                                    <MapPin className="w-2.5 h-2.5" /> On Route
                                  </span>
                                )}
                              </div>
                              <Badge className={cn('text-[10px] mb-2', tc.bg, tc.text)}>{event.type}</Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {event.dateStart}
                              {event.dateStart !== event.dateEnd && ` - ${event.dateEnd}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{event.description}</p>

                          <Separator className="mb-3" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.attendees >= 1000
                                  ? `${(event.attendees / 1000).toFixed(0)}K+`
                                  : event.attendees}
                              </span>
                              <span className="text-xs font-semibold text-[#1A3C5E]">
                                {event.price === 'Free' ? 'Free Entry' : `~₹${event.price}`}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => toggleItinerary(event.id)}
                              className={cn(
                                'gap-1 text-xs h-7 transition-all',
                                isAdded
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-[#E8733A] hover:bg-[#d4642e]'
                              )}
                            >
                              {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                              {isAdded ? 'Added to Itinerary' : 'Add to Itinerary'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ═══════════════ TAB 2: Local Experiences ═══════════════ */}
          <TabsContent value="experiences" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-lg font-bold text-[#1A3C5E] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E8733A]" />
                  Curated Local Experiences
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Handpicked activities hosted by local experts</p>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {['All', 'Cooking Class', 'Workshop', 'Trek', 'Heritage Walk', 'Farm Stay', 'Food & Drink'].map((t) => (
                  <button
                    key={t}
                    className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <ExperienceSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localExperiences.map((exp, i) => {
                  const isBookmarked = bookmarkedExperiences.has(exp.id);
                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i }}
                    >
                      <Card className="hover:shadow-lg transition-all h-full overflow-hidden group">
                        {/* Emoji header */}
                        <div className={cn('h-28 flex items-center justify-center text-5xl relative', exp.bgColor)}>
                          <motion.span whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring' }}>
                            {exp.emoji}
                          </motion.span>
                          <button
                            onClick={() => toggleBookmark(exp.id)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Bookmark className={cn('w-4 h-4', isBookmarked ? 'fill-[#E8733A] text-[#E8733A]' : 'text-gray-400')} />
                          </button>
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-white/90 text-gray-700 text-[10px] backdrop-blur gap-1">
                              <Clock className="w-2.5 h-2.5" /> {exp.duration}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4 flex flex-col">
                          <div className="flex items-start justify-between mb-1">
                            <Badge variant="outline" className="text-[10px] text-[#E8733A] border-[#E8733A]/30">
                              {exp.type}
                            </Badge>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Users className="w-3 h-3" /> Max {exp.maxGroupSize}
                            </span>
                          </div>

                          <h3 className="font-bold text-[#1A3C5E] text-sm mt-2 mb-1">{exp.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" /> {exp.location}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed flex-1">{exp.description}</p>

                          {/* Highlights */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {exp.highlights.map((h) => (
                              <span key={h} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {h}
                              </span>
                            ))}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {exp.tags.map((tag) => (
                              <span key={tag} className="text-[10px] font-medium bg-[#1A3C5E]/5 text-[#1A3C5E] px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <Separator className="mb-3" />

                          {/* Host & rating */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center text-[10px] font-bold">
                                {exp.host[0]}
                              </div>
                              <span className="text-xs text-gray-500">{exp.host}</span>
                            </div>
                            <StarRating rating={exp.rating} reviewCount={exp.reviewCount} />
                          </div>

                          {/* Price & action */}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[#1A3C5E]">
                              ₹{exp.price.toLocaleString()}
                              <span className="text-xs font-normal text-gray-400"> /person</span>
                            </span>
                            <Button size="sm" className="bg-[#E8733A] hover:bg-[#d4642e] gap-1 text-xs h-8">
                              <Ticket className="w-3 h-3" /> Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ═══════════════ TAB 3: Festival Calendar ═══════════════ */}
          <TabsContent value="calendar" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#1A3C5E] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#E8733A]" />
                  Year-Round Festival Calendar
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Plan your travels around India's vibrant festivals</p>
              </div>
            </div>

            {/* Month selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {months.map((m) => {
                const hasFestivals = festivalCalendar[m] && festivalCalendar[m].length > 0;
                return (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={cn(
                      'relative px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all min-w-[48px] text-center',
                      selectedMonth === m
                        ? 'bg-[#1A3C5E] text-white shadow-lg shadow-[#1A3C5E]/20'
                        : hasFestivals
                          ? 'bg-white text-[#1A3C5E] hover:bg-gray-100 border border-gray-200'
                          : 'bg-gray-50 text-gray-400 border border-gray-100'
                    )}
                  >
                    {m}
                    {hasFestivals && selectedMonth !== m && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E8733A]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Festival timeline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMonth}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {(festivalCalendar[selectedMonth] || []).length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">No major festivals in {selectedMonth}</p>
                      <p className="text-gray-300 text-sm mt-1">Check other months for exciting festivals</p>
                    </CardContent>
                  </Card>
                ) : (
                  (festivalCalendar[selectedMonth] || []).map((festival, i) => {
                    const typeStyle = festivalTypeStyles[festival.type] || festivalTypeStyles.cultural;
                    const isExpanded = expandedFestival === festival.name;
                    return (
                      <motion.div
                        key={festival.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card
                          className="hover:shadow-md transition-all cursor-pointer overflow-hidden"
                          onClick={() => setExpandedFestival(isExpanded ? null : festival.name)}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              {/* Date badge */}
                              <div className="shrink-0 w-14 h-14 rounded-xl bg-[#1A3C5E]/5 flex flex-col items-center justify-center">
                                <span className="text-lg font-bold text-[#1A3C5E]">{festival.date.split(' ')[1]?.replace('-', '') || festival.date.split(' ')[0]}</span>
                                <span className="text-[10px] text-gray-400 uppercase">{selectedMonth}</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="font-bold text-[#1A3C5E]">{festival.name}</h3>
                                  <Badge className={cn('text-[10px] capitalize', typeStyle.bg, typeStyle.text)}>
                                    {festival.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">{festival.date} &middot; {festival.country}</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{festival.significance}</p>

                                {/* Expanded details */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <Separator className="my-3" />

                                      <div className="space-y-3">
                                        {/* Best spots */}
                                        <div>
                                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Best Spots to Experience
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {festival.bestSpots.map((spot) => (
                                              <span
                                                key={spot}
                                                className="text-xs bg-[#E8733A]/10 text-[#E8733A] px-2.5 py-1 rounded-full font-medium"
                                              >
                                                {spot}
                                              </span>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Travel tip */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                          <p className="text-xs text-amber-800 flex items-start gap-2">
                                            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                                            <span><strong>Travel Tip:</strong> {festival.tips}</span>
                                          </p>
                                        </div>

                                        <Button size="sm" className="bg-[#E8733A] hover:bg-[#d4642e] gap-1 text-xs">
                                          <Plus className="w-3 h-3" /> Add to Trip Plan
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <Palette className="w-8 h-8 text-[#E8733A]/30 shrink-0 hidden sm:block" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>

            {/* Calendar year overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Year at a Glance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                  {months.map((m) => {
                    const count = (festivalCalendar[m] || []).length;
                    return (
                      <button
                        key={m}
                        onClick={() => setSelectedMonth(m)}
                        className={cn(
                          'p-2 rounded-lg text-center transition-all border',
                          selectedMonth === m
                            ? 'bg-[#1A3C5E] text-white border-[#1A3C5E]'
                            : count > 0
                              ? 'bg-white hover:bg-gray-50 border-gray-200'
                              : 'bg-gray-50 border-gray-100'
                        )}
                      >
                        <p className={cn('text-xs font-medium', selectedMonth !== m && count === 0 && 'text-gray-400')}>
                          {m}
                        </p>
                        <p className={cn(
                          'text-lg font-bold mt-0.5',
                          selectedMonth === m ? 'text-white' : count > 0 ? 'text-[#1A3C5E]' : 'text-gray-300'
                        )}>
                          {count}
                        </p>
                        {count > 0 && selectedMonth !== m && (
                          <div className="flex justify-center gap-0.5 mt-1">
                            {Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                              <span key={j} className="w-1 h-1 rounded-full bg-[#E8733A]" />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════ TAB 4: Sunset & Golden Hour ═══════════════ */}
          <TabsContent value="golden" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#1A3C5E] flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#E8733A]" />
                  Sunset & Golden Hour Tracker
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Never miss a golden moment at your destination</p>
              </div>
              <select
                value={sunLocation}
                onChange={(e) => setSunLocation(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
              >
                {sunLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Sun times hero */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-200 relative">
                {/* Decorative sun */}
                <div className="absolute top-4 right-8 w-20 h-20 rounded-full bg-yellow-300/40 blur-2xl" />
                <div className="p-6 sm:p-8 relative">
                  <p className="text-xs text-orange-800/60 font-medium mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {sunData.location} &middot; Today
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="text-center">
                      <Sunrise className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Sunrise</p>
                      <p className="text-2xl font-bold text-[#1A3C5E]">{sunData.sunrise}</p>
                    </div>
                    <div className="text-center">
                      <Sunset className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Sunset</p>
                      <p className="text-2xl font-bold text-[#1A3C5E]">{sunData.sunset}</p>
                    </div>
                    <div className="text-center">
                      <Sun className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Golden Hour</p>
                      <p className="text-xl font-bold text-[#1A3C5E]">{sunData.goldenHourStart}</p>
                      <p className="text-xs text-gray-500">to {sunData.goldenHourEnd}</p>
                    </div>
                    <div className="text-center">
                      <Timer className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Day Length</p>
                      <p className="text-2xl font-bold text-[#1A3C5E]">{sunData.dayLength}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Golden Hour Reminder */}
            <Card className="border-2 border-amber-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3C5E] text-sm">Golden Hour Reminder</h3>
                      <p className="text-xs text-gray-500">Get notified 30 minutes before golden hour starts</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setGoldenHourReminder(!goldenHourReminder)}
                    className={cn(
                      'gap-1.5 transition-all',
                      goldenHourReminder
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-[#E8733A] hover:bg-[#d4642e]'
                    )}
                  >
                    {goldenHourReminder ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    {goldenHourReminder ? 'Enabled' : 'Set Reminder'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blue Hour */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3C5E] text-sm">Blue Hour (Morning)</h3>
                    <p className="text-xs text-gray-500">Best for moody, atmospheric photography</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Time Window</p>
                      <p className="text-xl font-bold text-[#1A3C5E]">{sunData.blueHourStart} - {sunData.blueHourEnd}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-600 font-medium">Duration</p>
                      <p className="text-lg font-bold text-[#1A3C5E]">~30 min</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Viewpoints */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-[#1A3C5E]">
                  <Mountain className="w-4 h-4 text-[#E8733A]" />
                  Best Viewpoints in {sunLocation}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sunData.bestViewpoints.map((vp, i) => (
                  <motion.div
                    key={vp.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                        i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'
                      )}>
                        #{i + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#1A3C5E]">{vp.name}</h4>
                        <p className="text-xs text-gray-500">{vp.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-[#1A3C5E]">{vp.rating}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Photography tips */}
            <Card className="bg-gradient-to-br from-[#1A3C5E] to-[#1A3C5E]/90 text-white border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Photography Tips for Golden Hour
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { tip: 'Arrive 30 min early to scout compositions', icon: Clock },
                    { tip: 'Shoot into the sun for dramatic silhouettes', icon: Sun },
                    { tip: 'Use side-lighting for texture and depth', icon: Eye },
                    { tip: 'Keep shooting through blue hour for moodier tones', icon: Camera },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-white/10 rounded-lg p-3">
                      <item.icon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-white/80">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
