'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Languages, ArrowRightLeft, Copy, Check, Volume2, Clock, Book,
  Type, Mic, Camera, BookOpen, Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ja', name: 'Japanese' },
  { code: 'th', name: 'Thai' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' },
];

const phraseCategories = ['Greetings', 'Directions', 'Food', 'Emergency', 'Transport'];

interface Phrase {
  original: string;
  translation: string;
  pronunciation: string;
  category: string;
}

const mockPhrases: Phrase[] = [
  { original: 'Hello', translation: 'Namaste', pronunciation: 'nuh-MUS-tay', category: 'Greetings' },
  { original: 'How are you?', translation: 'Aap kaise hain?', pronunciation: 'aap KAY-say hain', category: 'Greetings' },
  { original: 'Thank you', translation: 'Dhanyavaad', pronunciation: 'dun-yuh-VAAD', category: 'Greetings' },
  { original: 'Goodbye', translation: 'Alvida', pronunciation: 'al-VEE-dah', category: 'Greetings' },
  { original: 'Where is the station?', translation: 'Station kahan hai?', pronunciation: 'STAY-shun kuh-HAAN hai', category: 'Directions' },
  { original: 'Turn left', translation: 'Baayein muriye', pronunciation: 'BAA-yein MUH-ree-yay', category: 'Directions' },
  { original: 'Turn right', translation: 'Daayein muriye', pronunciation: 'DAA-yein MUH-ree-yay', category: 'Directions' },
  { original: 'How far is it?', translation: 'Kitni door hai?', pronunciation: 'kit-NEE door hai', category: 'Directions' },
  { original: 'I am vegetarian', translation: 'Main shakahari hoon', pronunciation: 'main sha-kaa-HAA-ree hoon', category: 'Food' },
  { original: 'Water please', translation: 'Paani dijiye', pronunciation: 'PAA-nee DEE-jee-yay', category: 'Food' },
  { original: 'The bill please', translation: 'Bill dijiye', pronunciation: 'bill DEE-jee-yay', category: 'Food' },
  { original: 'Very tasty!', translation: 'Bahut swadisht!', pronunciation: 'buh-HUT swaa-DISHT', category: 'Food' },
  { original: 'Help!', translation: 'Madad karo!', pronunciation: 'MUH-dud KUH-ro', category: 'Emergency' },
  { original: 'Call the police', translation: 'Police ko bulao', pronunciation: 'police ko boo-LAA-oh', category: 'Emergency' },
  { original: 'I need a doctor', translation: 'Mujhe doctor chahiye', pronunciation: 'MOOJ-hay doctor CHA-hee-yay', category: 'Emergency' },
  { original: 'How much for a taxi?', translation: 'Taxi ka kitna?', pronunciation: 'TAXI kaa kit-NAA', category: 'Transport' },
  { original: 'Stop here', translation: 'Yahan rukiye', pronunciation: 'yuh-HAAN ROO-kee-yay', category: 'Transport' },
  { original: 'Bus stop', translation: 'Bus adda', pronunciation: 'bus UD-dah', category: 'Transport' },
];

interface RecentTranslation {
  source: string;
  translated: string;
  transliteration: string;
  fromLang: string;
  toLang: string;
  time: string;
}

const mockRecentTranslations: RecentTranslation[] = [
  { source: 'Where is the nearest hospital?', translated: 'Sabse nazdeeki aspatal kahan hai?', transliteration: 'Sub-say naz-DEE-kee us-puh-TAAL kuh-HAAN hai', fromLang: 'English', toLang: 'Hindi', time: '5m ago' },
  { source: 'I need a taxi to the airport', translated: 'Mujhe airport ke liye taxi chahiye', transliteration: 'MOOJ-hay airport kay lee-yay TAXI CHA-hee-yay', fromLang: 'English', toLang: 'Hindi', time: '30m ago' },
  { source: 'Is this food spicy?', translated: 'Kya yeh khana teekha hai?', transliteration: 'kyaa yeh KHAA-naa TEE-kaa hai', fromLang: 'English', toLang: 'Hindi', time: '1h ago' },
  { source: 'Can I have the menu?', translated: 'Menu dikhaiye', transliteration: 'MEN-oo dik-HAA-ee-yay', fromLang: 'English', toLang: 'Hindi', time: '2h ago' },
  { source: 'How much does this cost?', translated: 'Iska daam kya hai?', transliteration: 'IS-kaa daam kyaa hai', fromLang: 'English', toLang: 'Hindi', time: '3h ago' },
];

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [activeCategory, setActiveCategory] = useState('Greetings');
  const [copied, setCopied] = useState(false);

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    // Mock translation
    setTranslatedText('Yeh ek udaharan anuvad hai');
    setTransliteration('yeh ek oo-DAA-huh-run anu-VAAD hai');
  };

  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredPhrases = mockPhrases.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Translator</h1>
        <p className="text-gray-500 text-sm">Break language barriers on your travels</p>
      </motion.div>

      {/* Mode Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="text" className="gap-1.5 text-xs sm:text-sm">
              <Type className="w-4 h-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-1.5 text-xs sm:text-sm">
              <Mic className="w-4 h-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="camera" className="gap-1.5 text-xs sm:text-sm">
              <Camera className="w-4 h-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="phrasebook" className="gap-1.5 text-xs sm:text-sm">
              <BookOpen className="w-4 h-4" />
              Phrasebook
            </TabsTrigger>
          </TabsList>

          {/* Text Translation Tab */}
          <TabsContent value="text" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Language Selectors */}
                <div className="flex items-center gap-3">
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="flex-1 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSwapLangs}
                    className="shrink-0 rounded-full border border-gray-200 hover:bg-[#E8733A]/10 hover:border-[#E8733A]"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-[#E8733A]" />
                  </Button>

                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="flex-1 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Source Text */}
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] resize-none"
                />

                {/* Translate Button */}
                <Button
                  onClick={handleTranslate}
                  className="w-full bg-[#E8733A] hover:bg-[#d4642e] gap-2 h-11"
                  disabled={!sourceText.trim()}
                >
                  <Languages className="w-4 h-4" />
                  Translate
                </Button>

                {/* Result */}
                {translatedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#1A3C5E]/5 rounded-xl border border-[#1A3C5E]/10"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-[#1A3C5E]">{translatedText}</p>
                        {transliteration && (
                          <p className="text-sm text-gray-500 mt-1 italic">{transliteration}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Volume2 className="w-4 h-4 text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCopy(translatedText)}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice Tab */}
          <TabsContent value="voice">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-[#E8733A]/10 flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-10 h-10 text-[#E8733A]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A3C5E] mb-2">Voice Translation</h3>
                <p className="text-sm text-gray-500 mb-4">Tap the microphone to start speaking</p>
                <Button className="bg-[#E8733A] hover:bg-[#d4642e] rounded-full px-8 gap-2">
                  <Mic className="w-4 h-4" />
                  Start Listening
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Camera Tab */}
          <TabsContent value="camera">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A3C5E] mb-2">Camera Translation</h3>
                <p className="text-sm text-gray-500 mb-4">Point your camera at text to translate in real-time</p>
                <Button className="bg-[#1A3C5E] hover:bg-[#15334f] rounded-full px-8 gap-2">
                  <Camera className="w-4 h-4" />
                  Open Camera
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phrasebook Tab */}
          <TabsContent value="phrasebook" className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {phraseCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                    activeCategory === cat
                      ? 'bg-[#E8733A] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredPhrases.map((phrase, index) => (
                <motion.div
                  key={phrase.original}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A3C5E]">{phrase.original}</p>
                          <p className="text-[#E8733A] font-medium mt-1">{phrase.translation}</p>
                          <p className="text-xs text-gray-400 mt-1 italic">
                            Pronunciation: {phrase.pronunciation}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 mt-1">
                          <Volume2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Translation History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Translations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentTranslations.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A3C5E] truncate">{t.source}</p>
                      <p className="text-sm text-[#E8733A] mt-0.5 truncate">{t.translated}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">
                          {t.fromLang} &rarr; {t.toLang}
                        </Badge>
                        <span className="text-[10px] text-gray-400">{t.time}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => handleCopy(t.translated)}
                    >
                      <Copy className="w-3 h-3 text-gray-400" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
