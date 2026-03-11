'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed, Droplets, Star, Leaf, Save, CheckCircle,
  AlertTriangle, XCircle, MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const dietaryOptions = [
  { key: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { key: 'vegan', label: 'Vegan', emoji: '🌱' },
  { key: 'halal', label: 'Halal', emoji: '☪️' },
  { key: 'kosher', label: 'Kosher', emoji: '✡️' },
  { key: 'glutenFree', label: 'Gluten-Free', emoji: '🌾' },
  { key: 'dairyFree', label: 'Dairy-Free', emoji: '🥛' },
  { key: 'nutAllergy', label: 'Nut Allergy', emoji: '🥜' },
  { key: 'shellfishAllergy', label: 'Shellfish Allergy', emoji: '🦐' },
];

interface Dish {
  id: string;
  name: string;
  region: string;
  description: string;
  flavorTags: { label: string; color: string }[];
  mustTryScore: number;
  averagePrice: number;
  emoji: string;
  bgColor: string;
}

const mockDishes: Dish[] = [
  { id: '1', name: 'Hyderabadi Biryani', region: 'Telangana', description: 'Fragrant basmati rice layered with spiced meat, saffron, and caramelized onions. A Mughal masterpiece.', flavorTags: [{ label: 'Spicy', color: 'bg-red-100 text-red-700' }, { label: 'Aromatic', color: 'bg-purple-100 text-purple-700' }], mustTryScore: 4.9, averagePrice: 250, emoji: '🍚', bgColor: 'bg-amber-50' },
  { id: '2', name: 'Masala Dosa', region: 'Karnataka', description: 'Crispy fermented rice and lentil crepe stuffed with spiced potato filling, served with sambar and chutney.', flavorTags: [{ label: 'Savory', color: 'bg-green-100 text-green-700' }, { label: 'Crispy', color: 'bg-yellow-100 text-yellow-700' }], mustTryScore: 4.8, averagePrice: 80, emoji: '🫓', bgColor: 'bg-yellow-50' },
  { id: '3', name: 'Butter Chicken', region: 'Delhi', description: 'Tender chicken simmered in a creamy tomato-based gravy with butter and aromatic spices.', flavorTags: [{ label: 'Savory', color: 'bg-green-100 text-green-700' }, { label: 'Creamy', color: 'bg-orange-100 text-orange-700' }], mustTryScore: 4.7, averagePrice: 320, emoji: '🍗', bgColor: 'bg-red-50' },
  { id: '4', name: 'Pani Puri', region: 'Maharashtra', description: 'Crispy hollow shells filled with spiced water, tamarind chutney, potato, and chickpeas. Street food icon.', flavorTags: [{ label: 'Spicy', color: 'bg-red-100 text-red-700' }, { label: 'Sweet', color: 'bg-pink-100 text-pink-700' }, { label: 'Tangy', color: 'bg-lime-100 text-lime-700' }], mustTryScore: 4.8, averagePrice: 40, emoji: '🫧', bgColor: 'bg-blue-50' },
  { id: '5', name: 'Rogan Josh', region: 'Kashmir', description: 'Slow-cooked lamb in a rich aromatic gravy of Kashmiri chilies, yogurt, and whole spices.', flavorTags: [{ label: 'Spicy', color: 'bg-red-100 text-red-700' }, { label: 'Rich', color: 'bg-amber-100 text-amber-700' }], mustTryScore: 4.6, averagePrice: 380, emoji: '🍖', bgColor: 'bg-rose-50' },
  { id: '6', name: 'Vada Pav', region: 'Maharashtra', description: 'Spiced potato fritter in a soft bun with green and tamarind chutneys. Mumbai\'s beloved street food.', flavorTags: [{ label: 'Savory', color: 'bg-green-100 text-green-700' }, { label: 'Spicy', color: 'bg-red-100 text-red-700' }], mustTryScore: 4.5, averagePrice: 30, emoji: '🍔', bgColor: 'bg-green-50' },
  { id: '7', name: 'Fish Curry', region: 'Kerala', description: 'Fresh fish simmered in tangy coconut and tamarind gravy with curry leaves and kokum.', flavorTags: [{ label: 'Tangy', color: 'bg-lime-100 text-lime-700' }, { label: 'Spicy', color: 'bg-red-100 text-red-700' }], mustTryScore: 4.7, averagePrice: 220, emoji: '🐟', bgColor: 'bg-cyan-50' },
  { id: '8', name: 'Chole Bhature', region: 'Punjab', description: 'Spicy chickpea curry served with fluffy deep-fried bread. A North Indian breakfast staple.', flavorTags: [{ label: 'Spicy', color: 'bg-red-100 text-red-700' }, { label: 'Savory', color: 'bg-green-100 text-green-700' }], mustTryScore: 4.6, averagePrice: 120, emoji: '🫘', bgColor: 'bg-orange-50' },
  { id: '9', name: 'Rasgulla', region: 'West Bengal', description: 'Soft spongy cottage cheese balls soaked in light sugar syrup. A classic Bengali sweet.', flavorTags: [{ label: 'Sweet', color: 'bg-pink-100 text-pink-700' }, { label: 'Soft', color: 'bg-purple-100 text-purple-700' }], mustTryScore: 4.4, averagePrice: 60, emoji: '🍡', bgColor: 'bg-pink-50' },
  { id: '10', name: 'Thali', region: 'Rajasthan', description: 'A grand platter with dal, sabzi, roti, rice, raita, papad, and sweets. A complete culinary experience.', flavorTags: [{ label: 'Savory', color: 'bg-green-100 text-green-700' }, { label: 'Sweet', color: 'bg-pink-100 text-pink-700' }, { label: 'Spicy', color: 'bg-red-100 text-red-700' }], mustTryScore: 4.8, averagePrice: 300, emoji: '🍽️', bgColor: 'bg-violet-50' },
];

const regions = ['All', 'Telangana', 'Karnataka', 'Delhi', 'Maharashtra', 'Kashmir', 'Kerala', 'Punjab', 'West Bengal', 'Rajasthan'];

interface WaterSafety {
  country: string;
  level: 'safe' | 'caution' | 'unsafe';
  recommendation: string;
}

const waterData: Record<string, WaterSafety> = {
  India: { country: 'India', level: 'caution', recommendation: 'Stick to bottled or filtered water. Avoid ice from unknown sources. Sealed bottle brands like Bisleri and Kinley are reliable.' },
  Japan: { country: 'Japan', level: 'safe', recommendation: 'Tap water is safe to drink throughout Japan. Water quality is excellent and well-regulated.' },
  Thailand: { country: 'Thailand', level: 'caution', recommendation: 'Bottled water recommended. Most restaurants use filtered water for cooking. Avoid tap water and ice from street vendors.' },
  UAE: { country: 'UAE', level: 'safe', recommendation: 'Tap water is safe but many prefer bottled water for taste. Desalinated water is well-treated.' },
  France: { country: 'France', level: 'safe', recommendation: 'Tap water is safe and well-regulated. Free water (carafe d\'eau) is available at restaurants.' },
};

const waterCountries = ['India', 'Japan', 'Thailand', 'UAE', 'France'];

const waterStyles = {
  safe: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'Safe to Drink' },
  caution: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: 'Bottled Only' },
  unsafe: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'Unsafe' },
};

export default function FoodPage() {
  const [dietary, setDietary] = useState<Record<string, boolean>>({});
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [waterCountry, setWaterCountry] = useState('India');
  const [profileSaved, setProfileSaved] = useState(false);

  const filteredDishes = selectedRegion === 'All'
    ? mockDishes
    : mockDishes.filter((d) => d.region === selectedRegion);

  const toggleDietary = (key: string) => {
    setDietary((prev) => ({ ...prev, [key]: !prev[key] }));
    setProfileSaved(false);
  };

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const water = waterData[waterCountry];
  const waterStyle = waterStyles[water.level];
  const WaterIcon = waterStyle.icon;

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalf = score - fullStars >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < fullStars
                ? 'text-amber-400 fill-amber-400'
                : i === fullStars && hasHalf
                  ? 'text-amber-400 fill-amber-400/50'
                  : 'text-gray-200'
            )}
          />
        ))}
        <span className="text-xs font-semibold text-gray-600 ml-1">{score}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Food & Dietary</h1>
        <p className="text-gray-500 text-sm">Discover local cuisine and manage dietary needs</p>
      </motion.div>

      {/* Dietary Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Dietary Profile
            </CardTitle>
            <Button
              size="sm"
              onClick={handleSaveProfile}
              className={cn(
                'gap-1.5 transition-all',
                profileSaved
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-[#E8733A] hover:bg-[#d4642e]'
              )}
            >
              {profileSaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {profileSaved ? 'Saved!' : 'Save Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dietaryOptions.map((opt, index) => (
                <motion.div
                  key={opt.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border transition-all',
                    dietary[opt.key] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{opt.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                  </div>
                  <Switch
                    checked={dietary[opt.key] || false}
                    onCheckedChange={() => toggleDietary(opt.key)}
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Local Dishes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg font-bold text-[#1A3C5E] flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-[#E8733A]" />
            Local Dishes - India
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Karnataka', 'Delhi', 'Maharashtra', 'Kerala', 'Punjab'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                  selectedRegion === r
                    ? 'bg-[#E8733A] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map((dish, i) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all h-full overflow-hidden group">
                {/* Photo placeholder */}
                <div className={cn('h-32 flex items-center justify-center text-5xl', dish.bgColor)}>
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring' }}
                  >
                    {dish.emoji}
                  </motion.span>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-[#1A3C5E]">{dish.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />
                    {dish.region}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{dish.description}</p>

                  {/* Flavor tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dish.flavorTags.map((tag) => (
                      <span key={tag.label} className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', tag.color)}>
                        {tag.label}
                      </span>
                    ))}
                  </div>

                  {/* Score and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    {renderStars(dish.mustTryScore)}
                    <span className="text-sm font-bold text-[#E8733A]">~₹{dish.averagePrice}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Water Safety */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Water Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={waterCountry}
              onChange={(e) => setWaterCountry(e.target.value)}
              className="w-full sm:w-64 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
            >
              {waterCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className={cn('p-5 rounded-xl border-2', waterStyle.bg)}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', water.level === 'safe' ? 'bg-green-100' : water.level === 'caution' ? 'bg-yellow-100' : 'bg-red-100')}>
                  <WaterIcon className={cn('w-6 h-6', waterStyle.color)} />
                </div>
                <div>
                  <h4 className={cn('font-bold', waterStyle.color)}>{waterStyle.label}</h4>
                  <p className="text-xs text-gray-500">{waterCountry}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{water.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
