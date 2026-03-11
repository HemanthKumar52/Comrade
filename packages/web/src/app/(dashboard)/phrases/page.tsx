'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Volume2, Copy, Heart, Download, Star,
  ChevronRight, Globe2, CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', packSize: '2.4 MB' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', packSize: '2.1 MB' },
  { code: 'ja', name: 'Japanese', native: '日本語', packSize: '3.2 MB' },
  { code: 'fr', name: 'French', native: 'Français', packSize: '1.8 MB' },
  { code: 'es', name: 'Spanish', native: 'Español', packSize: '1.9 MB' },
  { code: 'de', name: 'German', native: 'Deutsch', packSize: '2.0 MB' },
  { code: 'it', name: 'Italian', native: 'Italiano', packSize: '1.7 MB' },
  { code: 'pt', name: 'Portuguese', native: 'Português', packSize: '1.8 MB' },
  { code: 'ar', name: 'Arabic', native: 'العربية', packSize: '2.5 MB' },
  { code: 'zh', name: 'Chinese', native: '中文', packSize: '3.5 MB' },
  { code: 'ko', name: 'Korean', native: '한국어', packSize: '2.8 MB' },
  { code: 'th', name: 'Thai', native: 'ไทย', packSize: '2.3 MB' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', packSize: '2.1 MB' },
  { code: 'ru', name: 'Russian', native: 'Русский', packSize: '2.6 MB' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', packSize: '2.2 MB' },
];

const categories = ['Greetings', 'Directions', 'Food', 'Shopping', 'Emergency', 'Transport', 'Accommodation', 'Health', 'Numbers', 'General'];

interface Phrase {
  id: string;
  category: string;
  original: string;
  translation: string;
  transliteration: string;
  pronunciation: string;
  essential: boolean;
}

const hindiPhrases: Phrase[] = [
  // Greetings
  { id: 'g1', category: 'Greetings', original: 'Hello / Greetings', translation: 'नमस्ते', transliteration: 'Namaste', pronunciation: 'nuh-MUS-tay', essential: true },
  { id: 'g2', category: 'Greetings', original: 'How are you?', translation: 'आप कैसे हैं?', transliteration: 'Aap kaise hain?', pronunciation: 'aap KAY-say hain', essential: true },
  { id: 'g3', category: 'Greetings', original: 'I am fine', translation: 'मैं ठीक हूँ', transliteration: 'Main theek hoon', pronunciation: 'main THEEK hoon', essential: false },
  { id: 'g4', category: 'Greetings', original: 'Thank you', translation: 'धन्यवाद', transliteration: 'Dhanyavaad', pronunciation: 'dhun-yuh-VAAD', essential: true },
  { id: 'g5', category: 'Greetings', original: 'Please', translation: 'कृपया', transliteration: 'Kripaya', pronunciation: 'KRIP-uh-yah', essential: true },
  { id: 'g6', category: 'Greetings', original: 'Sorry / Excuse me', translation: 'माफ़ कीजिए', transliteration: 'Maaf keejiye', pronunciation: 'maaf KEE-ji-yay', essential: true },
  { id: 'g7', category: 'Greetings', original: 'Yes', translation: 'हाँ', transliteration: 'Haan', pronunciation: 'haan', essential: true },
  { id: 'g8', category: 'Greetings', original: 'No', translation: 'नहीं', transliteration: 'Nahin', pronunciation: 'nuh-HEEN', essential: true },
  { id: 'g9', category: 'Greetings', original: 'Good morning', translation: 'सुप्रभात', transliteration: 'Suprabhat', pronunciation: 'su-pruh-BHAT', essential: false },
  { id: 'g10', category: 'Greetings', original: 'Goodbye', translation: 'अलविदा', transliteration: 'Alvida', pronunciation: 'ul-vi-DAH', essential: true },
  // Directions
  { id: 'd1', category: 'Directions', original: 'Where is...?', translation: '...कहाँ है?', transliteration: '...kahaan hai?', pronunciation: 'kuh-HAAN hai', essential: true },
  { id: 'd2', category: 'Directions', original: 'Left', translation: 'बाएँ', transliteration: 'Baayein', pronunciation: 'BAA-yein', essential: true },
  { id: 'd3', category: 'Directions', original: 'Right', translation: 'दाएँ', transliteration: 'Daayein', pronunciation: 'DAA-yein', essential: true },
  { id: 'd4', category: 'Directions', original: 'Straight ahead', translation: 'सीधे', transliteration: 'Seedhe', pronunciation: 'SEE-dhay', essential: true },
  { id: 'd5', category: 'Directions', original: 'How far is it?', translation: 'कितनी दूर है?', transliteration: 'Kitni door hai?', pronunciation: 'kit-NEE door hai', essential: false },
  { id: 'd6', category: 'Directions', original: 'Near / Close', translation: 'पास', transliteration: 'Paas', pronunciation: 'paas', essential: false },
  { id: 'd7', category: 'Directions', original: 'Far', translation: 'दूर', transliteration: 'Door', pronunciation: 'door', essential: false },
  { id: 'd8', category: 'Directions', original: 'Map', translation: 'नक्शा', transliteration: 'Naksha', pronunciation: 'NUK-shah', essential: false },
  { id: 'd9', category: 'Directions', original: 'I am lost', translation: 'मैं खो गया हूँ', transliteration: 'Main kho gaya hoon', pronunciation: 'main KHO guh-yah hoon', essential: true },
  { id: 'd10', category: 'Directions', original: 'Stop here', translation: 'यहाँ रुकिए', transliteration: 'Yahaan rukiye', pronunciation: 'yuh-HAAN roo-ki-yay', essential: true },
  // Food
  { id: 'f1', category: 'Food', original: 'Water', translation: 'पानी', transliteration: 'Paani', pronunciation: 'PAA-nee', essential: true },
  { id: 'f2', category: 'Food', original: 'I am vegetarian', translation: 'मैं शाकाहारी हूँ', transliteration: 'Main shakahari hoon', pronunciation: 'main shah-kah-HAR-ee hoon', essential: true },
  { id: 'f3', category: 'Food', original: 'The bill please', translation: 'बिल दीजिए', transliteration: 'Bill deejiye', pronunciation: 'bill DEE-ji-yay', essential: true },
  { id: 'f4', category: 'Food', original: 'Delicious!', translation: 'बहुत स्वादिष्ट!', transliteration: 'Bahut swaadisht!', pronunciation: 'buh-HUT swah-DISHT', essential: false },
  { id: 'f5', category: 'Food', original: 'Not spicy please', translation: 'तीखा मत बनाइए', transliteration: 'Teekha mat banaiye', pronunciation: 'TEE-kha mut buh-NAI-yay', essential: true },
  { id: 'f6', category: 'Food', original: 'Menu please', translation: 'मेनू दीजिए', transliteration: 'Menu deejiye', pronunciation: 'MEN-oo DEE-ji-yay', essential: false },
  { id: 'f7', category: 'Food', original: 'Tea', translation: 'चाय', transliteration: 'Chai', pronunciation: 'chai', essential: false },
  { id: 'f8', category: 'Food', original: 'Coffee', translation: 'कॉफ़ी', transliteration: 'Coffee', pronunciation: 'KOF-ee', essential: false },
  { id: 'f9', category: 'Food', original: 'Rice', translation: 'चावल', transliteration: 'Chawal', pronunciation: 'CHAH-vul', essential: false },
  { id: 'f10', category: 'Food', original: 'Bread', translation: 'रोटी', transliteration: 'Roti', pronunciation: 'ROH-tee', essential: false },
  // Shopping
  { id: 's1', category: 'Shopping', original: 'How much?', translation: 'कितना?', transliteration: 'Kitna?', pronunciation: 'kit-NAH', essential: true },
  { id: 's2', category: 'Shopping', original: 'Too expensive', translation: 'बहुत महंगा', transliteration: 'Bahut mehnga', pronunciation: 'buh-HUT meh-UN-gah', essential: true },
  { id: 's3', category: 'Shopping', original: 'Can you reduce?', translation: 'कम करो', transliteration: 'Kam karo', pronunciation: 'kum KUH-roh', essential: true },
  { id: 's4', category: 'Shopping', original: 'I want to buy', translation: 'मुझे खरीदना है', transliteration: 'Mujhe khareedna hai', pronunciation: 'muj-HAY khuh-REED-nah hai', essential: false },
  { id: 's5', category: 'Shopping', original: 'I don\'t want', translation: 'मुझे नहीं चाहिए', transliteration: 'Mujhe nahin chahiye', pronunciation: 'muj-HAY nuh-HEEN CHAH-hi-yay', essential: true },
  // Emergency
  { id: 'e1', category: 'Emergency', original: 'Help!', translation: 'बचाओ!', transliteration: 'Bachao!', pronunciation: 'buh-CHOW', essential: true },
  { id: 'e2', category: 'Emergency', original: 'Call the police', translation: 'पुलिस को बुलाओ', transliteration: 'Police ko bulao', pronunciation: 'po-LEES ko boo-LAO', essential: true },
  { id: 'e3', category: 'Emergency', original: 'I need a doctor', translation: 'मुझे डॉक्टर चाहिए', transliteration: 'Mujhe doctor chahiye', pronunciation: 'muj-HAY DOK-tor CHAH-hi-yay', essential: true },
  { id: 'e4', category: 'Emergency', original: 'Hospital', translation: 'अस्पताल', transliteration: 'Aspataal', pronunciation: 'us-puh-TAAL', essential: true },
  { id: 'e5', category: 'Emergency', original: 'I am hurt', translation: 'मुझे चोट लगी है', transliteration: 'Mujhe chot lagi hai', pronunciation: 'muj-HAY choht LUG-ee hai', essential: true },
  { id: 'e6', category: 'Emergency', original: 'Fire!', translation: 'आग!', transliteration: 'Aag!', pronunciation: 'aag', essential: true },
  { id: 'e7', category: 'Emergency', original: 'I lost my passport', translation: 'मेरा पासपोर्ट खो गया', transliteration: 'Mera passport kho gaya', pronunciation: 'MAY-rah PASS-port kho GUH-yah', essential: true },
  { id: 'e8', category: 'Emergency', original: 'Embassy', translation: 'दूतावास', transliteration: 'Dootawaas', pronunciation: 'DOO-tah-vaas', essential: false },
  { id: 'e9', category: 'Emergency', original: 'I need help', translation: 'मुझे मदद चाहिए', transliteration: 'Mujhe madad chahiye', pronunciation: 'muj-HAY MUH-dud CHAH-hi-yay', essential: true },
  { id: 'e10', category: 'Emergency', original: 'Call an ambulance', translation: 'एम्बुलेंस बुलाओ', transliteration: 'Ambulance bulao', pronunciation: 'AM-boo-lunce boo-LAO', essential: true },
];

export default function PhrasesPage() {
  const [language, setLanguage] = useState('hi');
  const [category, setCategory] = useState('Greetings');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedLang = languages.find((l) => l.code === language)!;

  const filteredPhrases = useMemo(() => {
    let phrases = hindiPhrases;
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      return phrases.filter(
        (p) =>
          p.original.toLowerCase().includes(q) ||
          p.translation.includes(q) ||
          p.transliteration.toLowerCase().includes(q)
      );
    }
    return phrases.filter((p) => p.category === category);
  }, [category, searchQuery]);

  const essentialPhrases = hindiPhrases.filter((p) => p.essential).slice(0, 20);

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyPhrase = (phrase: Phrase) => {
    navigator.clipboard.writeText(`${phrase.original} = ${phrase.translation} (${phrase.transliteration})`);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-[#E8733A]" />
          Travel Phrasebook
        </h1>
        <p className="text-gray-500 text-sm mt-1">Essential phrases for your journey</p>
      </motion.div>

      {/* Language Selector + Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full sm:w-64 h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.name} {l.native}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phrases..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
          />
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSearchQuery(''); }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
              category === cat && !searchQuery
                ? 'bg-[#1A3C5E] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Phrase Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery || category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredPhrases.length === 0 ? (
              <div className="text-center py-12">
                <Globe2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No phrases found</p>
                <p className="text-gray-400 text-sm">Try a different search term</p>
              </div>
            ) : (
              filteredPhrases.map((phrase, i) => (
                <motion.div
                  key={phrase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className={cn('hover:shadow-md transition-all', phrase.essential && 'border-l-4 border-l-[#E8733A]')}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-[#1A3C5E]">{phrase.translation}</p>
                          <p className="text-sm font-medium text-gray-700 mt-0.5">{phrase.original}</p>
                          <p className="text-sm italic text-gray-400 mt-1">{phrase.transliteration}</p>
                          <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            {phrase.pronunciation}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => {/* play audio */}}
                            className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyPhrase(phrase)}
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                              copiedId === phrase.id ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            )}
                          >
                            {copiedId === phrase.id ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => toggleFav(phrase.id)}
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                              favorites.has(phrase.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            )}
                          >
                            <Heart className={cn('w-4 h-4', favorites.has(phrase.id) && 'fill-red-500')} />
                          </button>
                        </div>
                      </div>
                      {phrase.essential && (
                        <Badge className="mt-2 bg-[#E8733A]/10 text-[#E8733A] border-[#E8733A]/20 text-[10px]">
                          <Star className="w-2.5 h-2.5 mr-0.5 fill-[#E8733A]" /> Essential
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Essential Pack */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-[#E8733A]/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-[#E8733A] fill-[#E8733A]" />
              Essential Pack - Top 20 Must-Know Phrases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {essentialPhrases.map((phrase, i) => (
                <motion.div
                  key={phrase.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-[#E8733A]/5 rounded-lg p-3 border border-[#E8733A]/10 hover:bg-[#E8733A]/10 transition-colors cursor-pointer"
                  onClick={() => copyPhrase(phrase)}
                >
                  <p className="text-sm font-bold text-[#1A3C5E]">{phrase.translation}</p>
                  <p className="text-xs text-gray-500">{phrase.original}</p>
                  <p className="text-[10px] italic text-gray-400 mt-0.5">{phrase.transliteration}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download for Offline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-[#1A3C5E]/10 flex items-center justify-center shrink-0">
                <Download className="w-6 h-6 text-[#1A3C5E]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1A3C5E]">Download for Offline</h3>
                <p className="text-xs text-gray-500">{selectedLang.name} language pack - {selectedLang.packSize}</p>
              </div>
            </div>
            <Button className="bg-[#1A3C5E] hover:bg-[#153350] text-white gap-2 shrink-0">
              <Download className="w-4 h-4" /> Download Pack
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
