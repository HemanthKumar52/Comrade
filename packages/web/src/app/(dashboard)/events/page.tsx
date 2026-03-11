'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Star, Sun, Sunrise, Sunset, Clock,
  Sparkles, Music, Trophy, Palette, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const typeColors: Record<string, { border: string; bg: string; text: string }> = {
  Festival: { border: 'border-l-purple-500', bg: 'bg-purple-100', text: 'text-purple-700' },
  Concert: { border: 'border-l-pink-500', bg: 'bg-pink-100', text: 'text-pink-700' },
  Sports: { border: 'border-l-green-500', bg: 'bg-green-100', text: 'text-green-700' },
  Workshop: { border: 'border-l-blue-500', bg: 'bg-blue-100', text: 'text-blue-700' },
  Cultural: { border: 'border-l-amber-500', bg: 'bg-amber-100', text: 'text-amber-700' },
};

const mockEvents = [
  { id: 1, name: 'Holi - Festival of Colors', type: 'Festival', dateStart: 'Mar 14, 2026', dateEnd: 'Mar 15, 2026', location: 'Mathura, Uttar Pradesh', description: 'Celebrate the vibrant festival of colors with music, dance, and gulal in the birthplace of Lord Krishna.' },
  { id: 2, name: 'Diwali - Festival of Lights', type: 'Festival', dateStart: 'Oct 20, 2026', dateEnd: 'Oct 24, 2026', location: 'Varanasi, Uttar Pradesh', description: 'Witness thousands of diyas illuminating the ghats of Varanasi during the grandest celebration of lights.' },
  { id: 3, name: 'Pongal Harvest Festival', type: 'Cultural', dateStart: 'Jan 14, 2027', dateEnd: 'Jan 17, 2027', location: 'Thanjavur, Tamil Nadu', description: 'Experience the traditional harvest festival with kolam art, Jallikattu bull-taming, and sweet pongal cooking.' },
  { id: 4, name: 'Durga Puja Pandal Walk', type: 'Festival', dateStart: 'Oct 1, 2026', dateEnd: 'Oct 5, 2026', location: 'Kolkata, West Bengal', description: 'Marvel at artistic pandals and immerse yourself in the electrifying energy of Kolkata during Durga Puja.' },
  { id: 5, name: 'Onam Snake Boat Race', type: 'Sports', dateStart: 'Sep 5, 2026', dateEnd: 'Sep 5, 2026', location: 'Alappuzha, Kerala', description: 'Watch the thrilling Vallam Kali snake boat races on the backwaters of Alappuzha during Onam celebrations.' },
  { id: 6, name: 'Pushkar Camel Fair', type: 'Cultural', dateStart: 'Nov 6, 2026', dateEnd: 'Nov 14, 2026', location: 'Pushkar, Rajasthan', description: 'One of the world\'s largest camel fairs featuring trading, folk music, cultural performances, and hot air balloon rides.' },
  { id: 7, name: 'Hornbill Festival', type: 'Festival', dateStart: 'Dec 1, 2026', dateEnd: 'Dec 10, 2026', location: 'Kisama, Nagaland', description: 'The "Festival of Festivals" showcasing Naga tribal heritage with warrior dances, crafts, and indigenous games.' },
  { id: 8, name: 'Rann Utsav', type: 'Cultural', dateStart: 'Nov 7, 2026', dateEnd: 'Feb 20, 2027', location: 'Kutch, Gujarat', description: 'Experience the white salt desert under full moonlight with folk performances, handicrafts, and adventure activities.' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const festivalCalendar: Record<string, { name: string; date: string; country: string; significance: string }[]> = {
  Jan: [{ name: 'Pongal', date: 'Jan 14-17', country: 'India (Tamil Nadu)', significance: 'Harvest festival celebrating the Sun God and new beginnings' }],
  Mar: [{ name: 'Holi', date: 'Mar 14-15', country: 'India (National)', significance: 'Triumph of good over evil, arrival of spring' }],
  Sep: [{ name: 'Onam', date: 'Sep 5', country: 'India (Kerala)', significance: 'Homecoming of legendary King Mahabali' }],
  Oct: [
    { name: 'Durga Puja', date: 'Oct 1-5', country: 'India (West Bengal)', significance: 'Victory of Goddess Durga over the demon Mahishasura' },
    { name: 'Diwali', date: 'Oct 20-24', country: 'India (National)', significance: 'Return of Lord Rama to Ayodhya after defeating Ravana' },
  ],
  Nov: [
    { name: 'Pushkar Fair', date: 'Nov 6-14', country: 'India (Rajasthan)', significance: 'Ancient livestock fair tied to Hindu pilgrimage' },
    { name: 'Rann Utsav', date: 'Nov 7 - Feb 20', country: 'India (Gujarat)', significance: 'Celebration of the unique white desert landscape and local culture' },
  ],
  Dec: [{ name: 'Hornbill Festival', date: 'Dec 1-10', country: 'India (Nagaland)', significance: 'Showcase of Naga tribal heritage and unity' }],
};

const localExperiences = [
  { id: 1, name: 'Varanasi Ghat Walk', type: 'Heritage Walk', description: 'Morning walk through ancient ghats with a local historian guide', rating: 4.8, price: 1200 },
  { id: 2, name: 'Jaipur Block Printing', type: 'Workshop', description: 'Learn traditional Rajasthani block printing on fabric', rating: 4.6, price: 1500 },
  { id: 3, name: 'Kerala Houseboat Stay', type: 'Experience', description: 'Overnight stay on a traditional kettuvallam through backwaters', rating: 4.9, price: 6500 },
  { id: 4, name: 'Darjeeling Tea Tasting', type: 'Food & Drink', description: 'Visit a heritage tea estate and taste first-flush varieties', rating: 4.7, price: 800 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn('w-3.5 h-3.5', s <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

export default function EventsPage() {
  const [selectedMonth, setSelectedMonth] = useState('Oct');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Events & Experiences</h1>
        <p className="text-gray-500 text-sm">Discover festivals, local experiences, and golden hours</p>
      </motion.div>

      {/* Events Near You */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E8733A]" /> Events Near You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockEvents.map((event, i) => {
            const tc = typeColors[event.type] || typeColors.Festival;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className={cn('border-l-4 hover:shadow-lg transition-shadow cursor-pointer', tc.border)}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#1A3C5E] text-sm leading-tight">{event.name}</h3>
                      <Badge className={cn('text-xs shrink-0 ml-2', tc.bg, tc.text)}>{event.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.dateStart}{event.dateStart !== event.dateEnd && ` - ${event.dateEnd}`}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Festival Calendar */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#E8733A]" /> Festival Calendar
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {months.map((m) => (
            <Button
              key={m}
              size="sm"
              variant={selectedMonth === m ? 'default' : 'outline'}
              className={cn(
                'text-xs px-3',
                selectedMonth === m ? 'bg-[#1A3C5E] text-white' : 'text-[#1A3C5E] border-[#1A3C5E]/30'
              )}
              onClick={() => setSelectedMonth(m)}
            >
              {m}
            </Button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={selectedMonth} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            {(festivalCalendar[selectedMonth] || []).length === 0 ? (
              <Card><CardContent className="py-8 text-center text-gray-400">No major festivals this month</CardContent></Card>
            ) : (
              (festivalCalendar[selectedMonth] || []).map((f, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#1A3C5E]">{f.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{f.date} &middot; {f.country}</p>
                        <p className="text-sm text-gray-600 mt-2">{f.significance}</p>
                      </div>
                      <Palette className="w-8 h-8 text-[#E8733A]/40 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* Sunset & Sunrise */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-[#E8733A]" /> Sunset & Sunrise
        </h2>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-orange-200 via-amber-100 to-yellow-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🌅</div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Sunrise</p>
                <p className="text-2xl font-bold text-[#1A3C5E]">6:12 AM</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🌇</div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Sunset</p>
                <p className="text-2xl font-bold text-[#1A3C5E]">6:34 PM</p>
              </div>
              <div>
                <div className="text-3xl mb-2">✨</div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Golden Hour</p>
                <p className="text-2xl font-bold text-[#1A3C5E]">5:48 - 6:34 PM</p>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">Based on your current location &middot; Updated daily</p>
          </div>
        </Card>
      </motion.section>

      {/* Local Experiences */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E8733A]" /> Local Experiences
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {localExperiences.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-4 pb-4 flex flex-col h-full">
                  <Badge variant="outline" className="text-xs w-fit mb-2 text-[#E8733A] border-[#E8733A]/30">{exp.type}</Badge>
                  <h3 className="font-semibold text-[#1A3C5E] text-sm mb-1">{exp.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex-1">{exp.description}</p>
                  <div className="flex items-center justify-between">
                    <StarRating rating={exp.rating} />
                    <span className="text-sm font-bold text-[#1A3C5E]">₹{exp.price.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
