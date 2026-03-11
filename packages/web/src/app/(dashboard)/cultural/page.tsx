'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Volume2, BookOpen, ChevronDown, Church,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

const countries: CountryOption[] = [
  { code: 'IN', name: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'JP', name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'FR', name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'TH', name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: 'AE', name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}' },
];

interface CultureSection {
  emoji: string;
  title: string;
  content: string;
}

interface ReligiousSite {
  type: string;
  emoji: string;
  rules: string[];
}

interface CommonPhrase {
  english: string;
  translation: string;
  pronunciation: string;
}

interface CultureData {
  sections: CultureSection[];
  religiousSites: ReligiousSite[];
  phrases: CommonPhrase[];
}

const cultureDatabase: Record<string, CultureData> = {
  IN: {
    sections: [
      {
        emoji: '\u{1F44B}',
        title: 'Greetings & Communication',
        content: 'The traditional greeting is "Namaste" with palms pressed together at chest level and a slight bow. Handshakes are common in business settings, especially in urban areas. Use right hand for greetings and passing items. Avoid pointing with a single finger; use your whole hand instead. Head wobble (side-to-side nod) means "yes" or acknowledgment.',
      },
      {
        emoji: '\u{1F4B0}',
        title: 'Tipping Culture',
        content: 'Tipping is appreciated but not mandatory. 10-15% at restaurants if service charge is not included. Round up auto-rickshaw and taxi fares. Tip hotel bellboys 50-100 INR per bag. Tour guides appreciate 200-500 INR per day. Avoid tipping at street food stalls or small eateries.',
      },
      {
        emoji: '\u{1F454}',
        title: 'Dress Code',
        content: 'Modest clothing is recommended, especially outside major cities. Cover shoulders and knees when visiting religious sites. Remove shoes before entering temples, mosques, and some homes. White is associated with mourning; avoid at celebrations. Bright colors are welcome at festivals and weddings.',
      },
      {
        emoji: '\u{1F4F8}',
        title: 'Photography Rules',
        content: 'Always ask permission before photographing people, especially in rural areas. Photography is prohibited inside many temples and at some monuments. Some sites charge a camera fee. Military installations and border areas strictly prohibit photography. Avoid photographing beggars or impoverished areas without sensitivity.',
      },
      {
        emoji: '\u{1F91D}',
        title: 'Etiquette & Customs',
        content: 'Use your right hand for eating and passing items (left is considered unclean). Remove shoes when entering homes and religious spaces. Touching someone\'s feet shows great respect (for elders). Avoid public displays of affection. Cows are sacred; never show disrespect. Bargaining is expected in markets, not in fixed-price shops.',
      },
      {
        emoji: '\u{23F0}',
        title: 'Punctuality',
        content: '"Indian Standard Time" informally means events may start 15-30 minutes late. Business meetings generally start on time in corporate settings. Social gatherings often run on flexible schedules. Be patient and plan buffer time for appointments. Train schedules are generally reliable; buses less so.',
      },
    ],
    religiousSites: [
      {
        type: 'Hindu Temple',
        emoji: '\u{1F6D5}',
        rules: [
          'Remove shoes before entering the temple premises',
          'Dress modestly - cover shoulders and knees',
          'Walk clockwise around shrines (pradakshina)',
          'Do not touch idols or offerings without permission',
          'Photography often prohibited inside sanctum',
          'Non-Hindus may be restricted from some inner areas',
        ],
      },
      {
        type: 'Mosque',
        emoji: '\u{1F54C}',
        rules: [
          'Remove shoes before entering',
          'Women must cover head, arms, and legs',
          'Men should wear long pants',
          'Do not enter during prayer times unless invited',
          'Maintain silence and respect during prayers',
          'Non-Muslims may not enter some mosques',
        ],
      },
      {
        type: 'Church',
        emoji: '\u{26EA}',
        rules: [
          'Dress modestly - no shorts or sleeveless tops',
          'Maintain silence during services',
          'Photography may be restricted during mass',
          'Remove hats (men) as a sign of respect',
          'Visitors are generally welcome',
          'Follow local congregation cues for sitting/standing',
        ],
      },
    ],
    phrases: [
      { english: 'Hello', translation: 'Namaste', pronunciation: 'nuh-MUS-tay' },
      { english: 'Thank you', translation: 'Dhanyavaad', pronunciation: 'dun-yuh-VAAD' },
      { english: 'Please', translation: 'Kripaya', pronunciation: 'kri-PUH-yaa' },
      { english: 'Excuse me', translation: 'Maaf kijiye', pronunciation: 'maaf KEE-jee-yay' },
      { english: 'Yes / No', translation: 'Haan / Nahi', pronunciation: 'haan / nuh-HEE' },
      { english: 'Where is...?', translation: '...kahan hai?', pronunciation: 'kuh-HAAN hai' },
      { english: 'How much?', translation: 'Kitna hai?', pronunciation: 'kit-NAA hai' },
      { english: 'I don\'t understand', translation: 'Mujhe samajh nahi aaya', pronunciation: 'MOOJ-hay suh-MUJH nuh-HEE aa-yaa' },
      { english: 'Delicious!', translation: 'Bahut swadisht!', pronunciation: 'buh-HUT swaa-DISHT' },
      { english: 'Goodbye', translation: 'Alvida / Namaste', pronunciation: 'al-VEE-dah' },
    ],
  },
  JP: {
    sections: [
      {
        emoji: '\u{1F44B}',
        title: 'Greetings & Communication',
        content: 'Bow instead of shaking hands. The deeper the bow, the more respect shown. A 15-degree bow is casual; 30-degree for business; 45-degree shows deep respect. Exchange business cards with both hands and examine them carefully. Direct eye contact can be considered rude. Silence is valued in conversation.',
      },
      {
        emoji: '\u{1F4B0}',
        title: 'Tipping Culture',
        content: 'Tipping is NOT practiced in Japan and can be considered rude. Service is already included in the price. Exceptional service can be acknowledged with a sincere "thank you" (arigatou gozaimasu). If you must leave a tip, place money in an envelope.',
      },
      {
        emoji: '\u{1F454}',
        title: 'Dress Code',
        content: 'Japanese society values neat, clean, and modest dress. Remove shoes when entering homes, some restaurants, and temples. Smart casual for most occasions. Avoid overly revealing clothing. Tattoos may restrict access to onsens (hot springs) and some gyms.',
      },
      {
        emoji: '\u{1F4F8}',
        title: 'Photography Rules',
        content: 'Ask permission before photographing people. Many museums and temples prohibit photography. Shutter sound on phone cameras is mandatory by law. Avoid photographing geisha without permission. Some areas near military bases restrict photography.',
      },
      {
        emoji: '\u{1F91D}',
        title: 'Etiquette & Customs',
        content: 'Never stick chopsticks upright in rice (funeral custom). Don\'t pass food chopstick-to-chopstick. Slurping noodles is acceptable and shows enjoyment. Blowing your nose in public is considered rude. Keep voice low on public transport. Queue orderly; cutting in line is very rude.',
      },
      {
        emoji: '\u{23F0}',
        title: 'Punctuality',
        content: 'Punctuality is extremely important in Japan. Trains run to the second and apologize for even 30-second delays. Arrive 5 minutes early for meetings. Being late is considered very disrespectful. Plans and schedules are followed strictly.',
      },
    ],
    religiousSites: [
      {
        type: 'Shinto Shrine',
        emoji: '\u{26E9}\u{FE0F}',
        rules: [
          'Bow before entering the torii gate',
          'Walk on the sides of the path (center is for gods)',
          'Purify hands and mouth at temizuya fountain',
          'Throw a coin, bow twice, clap twice, bow once to pray',
          'Do not touch sacred objects or shimenawa ropes',
          'Photography usually allowed in outer areas',
        ],
      },
      {
        type: 'Buddhist Temple',
        emoji: '\u{1F3EF}',
        rules: [
          'Remove shoes before entering temple halls',
          'Bow slightly when entering and leaving',
          'Light incense and place it in the burner',
          'Do not point at Buddha statues',
          'Photography may be restricted inside halls',
          'Silence and respect are expected',
        ],
      },
      {
        type: 'Church',
        emoji: '\u{26EA}',
        rules: [
          'Dress modestly and respectfully',
          'Maintain silence during services',
          'Visitors are generally welcome',
          'Follow local customs for sitting and standing',
          'Photography usually allowed outside services',
          'Smaller churches may have limited visiting hours',
        ],
      },
    ],
    phrases: [
      { english: 'Hello', translation: 'Konnichiwa', pronunciation: 'kon-NEE-chee-wah' },
      { english: 'Thank you', translation: 'Arigatou gozaimasu', pronunciation: 'ah-ree-GAH-toh go-ZAI-mahs' },
      { english: 'Excuse me', translation: 'Sumimasen', pronunciation: 'soo-mee-MAH-sen' },
      { english: 'Yes / No', translation: 'Hai / Iie', pronunciation: 'hai / EE-eh' },
      { english: 'Please', translation: 'Onegaishimasu', pronunciation: 'oh-neh-GAI-shee-mahs' },
      { english: 'Where is...?', translation: '...wa doko desu ka?', pronunciation: 'wah DOH-koh dess kah' },
      { english: 'How much?', translation: 'Ikura desu ka?', pronunciation: 'ee-KOO-rah dess kah' },
      { english: 'I don\'t understand', translation: 'Wakarimasen', pronunciation: 'wah-kah-ree-MAH-sen' },
      { english: 'Delicious!', translation: 'Oishii!', pronunciation: 'oh-EE-shee' },
      { english: 'Goodbye', translation: 'Sayounara', pronunciation: 'sah-YOH-nah-rah' },
    ],
  },
};

export default function CulturalPage() {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  const country = countries.find((c) => c.code === selectedCountry);
  const culture = cultureDatabase[selectedCountry];

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Cultural Intelligence</h1>
        <p className="text-gray-500 text-sm">Learn local customs before you travel</p>
      </motion.div>

      {/* Country Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="text-sm font-medium text-gray-700 mb-2 block">Select Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setOpenSections(new Set([0]));
          }}
          className="w-full sm:w-80 h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Culture Accordion Card */}
      {culture ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#E8733A]" />
                {country?.flag} {country?.name} - Cultural Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {culture.sections.map((section, index) => (
                <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(index)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors',
                      openSections.has(index) && 'bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{section.emoji}</span>
                      <span className="font-semibold text-sm text-[#1A3C5E]">{section.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-gray-400 transition-transform duration-200',
                        openSections.has(index) && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openSections.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-9">
                            <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Cultural guide not available for this country yet.</p>
            <p className="text-xs text-gray-400 mt-1">We are working on adding more countries.</p>
          </CardContent>
        </Card>
      )}

      {culture && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Religious Site Etiquette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Church className="w-5 h-5 text-[#1A3C5E]" />
                  Religious Site Etiquette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {culture.religiousSites.map((site, i) => (
                  <motion.div
                    key={site.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{site.emoji}</span>
                      <h4 className="font-bold text-sm text-[#1A3C5E]">{site.type}</h4>
                    </div>
                    <div className="space-y-2 pl-8">
                      {site.rules.map((rule, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E8733A] mt-1.5 shrink-0" />
                          <p className="text-sm text-gray-600">{rule}</p>
                        </div>
                      ))}
                    </div>
                    {i < culture.religiousSites.length - 1 && <Separator className="mt-4" />}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Common Phrases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#E8733A]" />
                  Common Phrases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {culture.phrases.map((phrase, i) => (
                    <motion.div
                      key={phrase.english}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A3C5E]">{phrase.english}</p>
                        <p className="text-sm text-[#E8733A] font-medium">{phrase.translation}</p>
                        <p className="text-[11px] text-gray-400 italic mt-0.5">{phrase.pronunciation}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Volume2 className="w-4 h-4 text-gray-400" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
