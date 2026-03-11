'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Luggage, Sparkles, ListChecks, CalendarDays, Clock, MapPin,
  Plus, Check, ChevronDown, ChevronUp, Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PackingItem {
  id: number;
  name: string;
  checked: boolean;
}

interface PackingCategory {
  name: string;
  emoji: string;
  items: PackingItem[];
}

const defaultPackingList: PackingCategory[] = [
  { name: 'Clothing', emoji: '👕', items: [
    { id: 1, name: 'Thermal base layers (2 sets)', checked: false },
    { id: 2, name: 'Fleece jacket', checked: false },
    { id: 3, name: 'Waterproof outer shell', checked: false },
    { id: 4, name: 'Hiking pants (2)', checked: false },
    { id: 5, name: 'Warm hat & gloves', checked: false },
    { id: 6, name: 'Wool socks (5 pairs)', checked: false },
    { id: 7, name: 'Trekking boots', checked: false },
  ]},
  { name: 'Electronics', emoji: '🔌', items: [
    { id: 8, name: 'Phone + charger', checked: false },
    { id: 9, name: 'Power bank (20000mAh)', checked: false },
    { id: 10, name: 'Camera + extra batteries', checked: false },
    { id: 11, name: 'Headlamp / Flashlight', checked: false },
  ]},
  { name: 'Documents', emoji: '📄', items: [
    { id: 12, name: 'ID / Passport', checked: false },
    { id: 13, name: 'Printed hotel bookings', checked: false },
    { id: 14, name: 'Travel insurance card', checked: false },
    { id: 15, name: 'Emergency contact list', checked: false },
  ]},
  { name: 'Health', emoji: '💊', items: [
    { id: 16, name: 'First aid kit', checked: false },
    { id: 17, name: 'Altitude sickness pills (Diamox)', checked: false },
    { id: 18, name: 'Sunscreen SPF 50+', checked: false },
    { id: 19, name: 'Lip balm with SPF', checked: false },
    { id: 20, name: 'Personal medications', checked: false },
  ]},
  { name: 'Money', emoji: '💰', items: [
    { id: 21, name: 'Cash (local currency)', checked: false },
    { id: 22, name: 'Debit/Credit cards', checked: false },
    { id: 23, name: 'Emergency USD/EUR', checked: false },
  ]},
  { name: 'Miscellaneous', emoji: '🎒', items: [
    { id: 24, name: 'Reusable water bottle', checked: false },
    { id: 25, name: 'Dry bags for electronics', checked: false },
    { id: 26, name: 'Trekking poles', checked: false },
    { id: 27, name: 'Snacks / Energy bars', checked: false },
    { id: 28, name: 'Sunglasses (UV protection)', checked: false },
  ]},
];

const tripTypes = ['Beach', 'Mountain', 'City', 'Desert', 'Cultural'];

const mockItinerary = [
  { day: 1, title: 'Arrival & Acclimatization', activities: [
    { time: '10:00 AM', activity: 'Arrive at Leh Kushok Bakula Airport', location: 'Leh Airport' },
    { time: '12:00 PM', activity: 'Check-in at hotel, rest', location: 'Grand Dragon Ladakh' },
    { time: '4:00 PM', activity: 'Short walk around Leh Market', location: 'Main Bazaar, Leh' },
    { time: '7:00 PM', activity: 'Ladakhi dinner', location: 'Tibetan Kitchen' },
  ]},
  { day: 2, title: 'Leh Sightseeing', activities: [
    { time: '8:00 AM', activity: 'Breakfast at hotel', location: 'Grand Dragon Ladakh' },
    { time: '9:30 AM', activity: 'Visit Leh Palace', location: 'Leh Palace' },
    { time: '11:00 AM', activity: 'Shanti Stupa viewpoint', location: 'Shanti Stupa' },
    { time: '1:00 PM', activity: 'Lunch at Bon Appetit', location: 'Fort Road' },
    { time: '3:00 PM', activity: 'Hall of Fame Museum', location: 'Leh-Karu Road' },
  ]},
  { day: 3, title: 'Nubra Valley Drive', activities: [
    { time: '6:00 AM', activity: 'Early start - drive to Khardung La', location: 'Leh → Khardung La' },
    { time: '9:00 AM', activity: 'Photo stop at Khardung La Pass (18,380 ft)', location: 'Khardung La' },
    { time: '1:00 PM', activity: 'Arrive Hunder, lunch', location: 'Hunder Village' },
    { time: '3:00 PM', activity: 'Double-humped camel ride on sand dunes', location: 'Hunder Sand Dunes' },
  ]},
  { day: 4, title: 'Pangong Lake', activities: [
    { time: '7:00 AM', activity: 'Drive from Nubra to Pangong via Shyok route', location: 'Nubra → Pangong' },
    { time: '1:00 PM', activity: 'Arrive at Pangong Tso', location: 'Pangong Lake' },
    { time: '2:00 PM', activity: 'Lakeside picnic lunch', location: 'Pangong Lakefront' },
    { time: '4:00 PM', activity: 'Photography & exploring the lake shore', location: 'Pangong Lake' },
  ]},
  { day: 5, title: 'Return to Leh & Departure', activities: [
    { time: '7:00 AM', activity: 'Sunrise at Pangong Lake', location: 'Pangong Lake' },
    { time: '8:30 AM', activity: 'Drive back to Leh via Chang La', location: 'Pangong → Leh' },
    { time: '2:00 PM', activity: 'Souvenir shopping', location: 'Leh Market' },
    { time: '5:00 PM', activity: 'Departure from Leh Airport', location: 'Leh Airport' },
  ]},
];

const preTripChecklist = [
  { id: 1, label: 'Flight/Train Booked', checked: true },
  { id: 2, label: 'Accommodation Confirmed', checked: true },
  { id: 3, label: 'Travel Insurance', checked: true },
  { id: 4, label: 'Passport Valid (6+ months)', checked: true },
  { id: 5, label: 'Visa Arranged', checked: false },
  { id: 6, label: 'Documents Copied (digital + physical)', checked: false },
  { id: 7, label: 'Currency Exchanged', checked: false },
  { id: 8, label: 'Emergency Contacts Set', checked: true },
  { id: 9, label: 'Packing Done', checked: false },
];

export default function PackingPage() {
  const [packingList, setPackingList] = useState<PackingCategory[]>(defaultPackingList);
  const [destination, setDestination] = useState('Ladakh');
  const [duration, setDuration] = useState('5');
  const [tripType, setTripType] = useState('Mountain');
  const [gender, setGender] = useState('Male');
  const [generated, setGenerated] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Clothing');
  const [checklist, setChecklist] = useState(preTripChecklist);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleItem = (categoryName: string, itemId: number) => {
    setPackingList((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? { ...cat, items: cat.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)) }
          : cat
      )
    );
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const totalItems = packingList.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = packingList.reduce((acc, cat) => acc + cat.items.filter((i) => i.checked).length, 0);
  const packProgress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const checklistDone = checklist.filter((c) => c.checked).length;
  const checklistProgress = Math.round((checklistDone / checklist.length) * 100);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Packing & Planning</h1>
        <p className="text-gray-500 text-sm">Smart packing lists, itineraries, and pre-trip checklists</p>
      </motion.div>

      {/* AI Packing List */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E8733A]" /> AI Packing List
        </h2>
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Destination</label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where to?" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Duration (days)</label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min="1" max="90" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Trip Type</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-white" value={tripType} onChange={(e) => setTripType(e.target.value)}>
                  {tripTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Gender</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-white" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
            </div>
            <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2" onClick={() => setGenerated(true)}>
              <Sparkles className="w-4 h-4" /> Generate List
            </Button>
          </CardContent>
        </Card>

        {generated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-4">
              <Progress value={packProgress} className="flex-1 h-2" />
              <span className="text-sm font-medium text-[#1A3C5E]">{checkedItems}/{totalItems} packed</span>
            </div>
            <div className="space-y-3">
              {packingList.map((cat) => (
                <Card key={cat.name} className="overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-medium text-[#1A3C5E] text-sm">{cat.name}</span>
                      <Badge variant="outline" className="text-xs">{cat.items.filter((i) => i.checked).length}/{cat.items.length}</Badge>
                    </div>
                    {expandedCategory === cat.name ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedCategory === cat.name && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-3 space-y-1.5">
                          {cat.items.map((item) => (
                            <motion.label
                              key={item.id}
                              className="flex items-center gap-3 py-1.5 cursor-pointer group"
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.div
                                className={cn(
                                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                                  item.checked ? 'bg-[#E8733A] border-[#E8733A]' : 'border-gray-300 group-hover:border-[#E8733A]'
                                )}
                                onClick={() => toggleItem(cat.name, item.id)}
                                whileTap={{ scale: 1.2 }}
                              >
                                <AnimatePresence>
                                  {item.checked && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                      <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                              <span className={cn('text-sm', item.checked && 'line-through text-gray-400')}>{item.name}</span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Day-by-Day Itinerary */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#E8733A]" /> Day-by-Day Itinerary
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-[#1A3C5E] text-white text-xs px-3 py-1">Ladakh 5-Day Trip</Badge>
        </div>
        <div className="space-y-3">
          {mockItinerary.map((day) => (
            <Card key={day.day} className="overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8733A] text-white flex items-center justify-center text-sm font-bold">{day.day}</div>
                  <div className="text-left">
                    <p className="font-medium text-[#1A3C5E] text-sm">Day {day.day}</p>
                    <p className="text-xs text-gray-500">{day.title}</p>
                  </div>
                </div>
                {expandedDay === day.day ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              <AnimatePresence>
                {expandedDay === day.day && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4">
                      <div className="border-l-2 border-[#E8733A]/30 ml-4 pl-4 space-y-3">
                        {day.activities.map((act, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-[#E8733A]" />
                            <p className="text-xs text-[#E8733A] font-medium">{act.time}</p>
                            <p className="text-sm text-[#1A3C5E] font-medium">{act.activity}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{act.location}</p>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="mt-3 ml-8 text-xs gap-1 text-[#E8733A] border-[#E8733A]/30">
                        <Plus className="w-3 h-3" /> Add Activity
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Pre-Trip Checklist */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-[#E8733A]" /> Pre-Trip Checklist
        </h2>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-4">
              <Progress value={checklistProgress} className="flex-1 h-2" />
              <span className="text-sm font-medium text-[#1A3C5E]">{checklistDone}/{checklist.length}</span>
            </div>
            <div className="space-y-2">
              {checklist.map((item) => (
                <motion.label
                  key={item.id}
                  className="flex items-center gap-3 py-2 cursor-pointer group"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-green-400'
                    )}
                    onClick={() => toggleChecklistItem(item.id)}
                    whileTap={{ scale: 1.2 }}
                  >
                    <AnimatePresence>
                      {item.checked && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className={cn('text-sm', item.checked && 'line-through text-gray-400')}>{item.label}</span>
                </motion.label>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
