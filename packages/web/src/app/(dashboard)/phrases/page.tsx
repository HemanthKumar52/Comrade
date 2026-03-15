'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Volume2, Copy, Heart, Download, Star,
  Globe2, CheckCircle, Plus, X, Share2, Languages, Wifi, WifiOff,
  ArrowRight, MessageSquare, Trash2, ChevronDown, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Language data (100+ languages)
// ---------------------------------------------------------------------------

interface Language {
  code: string;
  name: string;
  native: string;
  packSize: string;
  script: 'latin' | 'non-latin';
  downloaded?: boolean;
}

const languages: Language[] = [
  { code: 'hi', name: 'Hindi', native: '\u0939\u093F\u0928\u094D\u0926\u0940', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'ta', name: 'Tamil', native: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', packSize: '2.1 MB', script: 'non-latin' },
  { code: 'ja', name: 'Japanese', native: '\u65E5\u672C\u8A9E', packSize: '3.2 MB', script: 'non-latin' },
  { code: 'fr', name: 'French', native: 'Fran\u00E7ais', packSize: '1.8 MB', script: 'latin' },
  { code: 'es', name: 'Spanish', native: 'Espa\u00F1ol', packSize: '1.9 MB', script: 'latin' },
  { code: 'de', name: 'German', native: 'Deutsch', packSize: '2.0 MB', script: 'latin' },
  { code: 'it', name: 'Italian', native: 'Italiano', packSize: '1.7 MB', script: 'latin' },
  { code: 'pt', name: 'Portuguese', native: 'Portugu\u00EAs', packSize: '1.8 MB', script: 'latin' },
  { code: 'ar', name: 'Arabic', native: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', packSize: '2.5 MB', script: 'non-latin' },
  { code: 'zh', name: 'Chinese (Mandarin)', native: '\u4E2D\u6587', packSize: '3.5 MB', script: 'non-latin' },
  { code: 'ko', name: 'Korean', native: '\uD55C\uAD6D\uC5B4', packSize: '2.8 MB', script: 'non-latin' },
  { code: 'th', name: 'Thai', native: '\u0E44\u0E17\u0E22', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'vi', name: 'Vietnamese', native: 'Ti\u1EBFng Vi\u1EC7t', packSize: '2.1 MB', script: 'latin' },
  { code: 'ru', name: 'Russian', native: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', packSize: '2.6 MB', script: 'non-latin' },
  { code: 'te', name: 'Telugu', native: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41', packSize: '2.2 MB', script: 'non-latin' },
  { code: 'bn', name: 'Bengali', native: '\u09AC\u09BE\u0982\u09B2\u09BE', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'mr', name: 'Marathi', native: '\u092E\u0930\u093E\u0920\u0940', packSize: '2.2 MB', script: 'non-latin' },
  { code: 'gu', name: 'Gujarati', native: '\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0', packSize: '2.1 MB', script: 'non-latin' },
  { code: 'kn', name: 'Kannada', native: '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1', packSize: '2.2 MB', script: 'non-latin' },
  { code: 'ml', name: 'Malayalam', native: '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'pa', name: 'Punjabi', native: '\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40', packSize: '2.1 MB', script: 'non-latin' },
  { code: 'ur', name: 'Urdu', native: '\u0627\u0631\u062F\u0648', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'tr', name: 'Turkish', native: 'T\u00FCrk\u00E7e', packSize: '2.0 MB', script: 'latin' },
  { code: 'pl', name: 'Polish', native: 'Polski', packSize: '2.1 MB', script: 'latin' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', packSize: '1.9 MB', script: 'latin' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', packSize: '1.8 MB', script: 'latin' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', packSize: '1.8 MB', script: 'latin' },
  { code: 'da', name: 'Danish', native: 'Dansk', packSize: '1.8 MB', script: 'latin' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', packSize: '2.0 MB', script: 'latin' },
  { code: 'el', name: 'Greek', native: '\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'cs', name: 'Czech', native: '\u010Ce\u0161tina', packSize: '2.0 MB', script: 'latin' },
  { code: 'ro', name: 'Romanian', native: 'Rom\u00E2n\u0103', packSize: '1.9 MB', script: 'latin' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', packSize: '2.0 MB', script: 'latin' },
  { code: 'uk', name: 'Ukrainian', native: '\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430', packSize: '2.5 MB', script: 'non-latin' },
  { code: 'he', name: 'Hebrew', native: '\u05E2\u05D1\u05E8\u05D9\u05EA', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'fa', name: 'Persian', native: '\u0641\u0627\u0631\u0633\u06CC', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', packSize: '1.7 MB', script: 'latin' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', packSize: '1.8 MB', script: 'latin' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', packSize: '1.8 MB', script: 'latin' },
  { code: 'tl', name: 'Filipino', native: 'Filipino', packSize: '1.7 MB', script: 'latin' },
  { code: 'my', name: 'Burmese', native: '\u1019\u103C\u1014\u103A\u1019\u102C\u1005\u102C', packSize: '2.6 MB', script: 'non-latin' },
  { code: 'km', name: 'Khmer', native: '\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A', packSize: '2.5 MB', script: 'non-latin' },
  { code: 'lo', name: 'Lao', native: '\u0E9E\u0EB2\u0EAA\u0EB2\u0EA5\u0EB2\u0EA7', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'ne', name: 'Nepali', native: '\u0928\u0947\u092A\u093E\u0932\u0940', packSize: '2.2 MB', script: 'non-latin' },
  { code: 'si', name: 'Sinhala', native: '\u0DC3\u0DD2\u0D82\u0DC4\u0DBD', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'ka', name: 'Georgian', native: '\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'hy', name: 'Armenian', native: '\u0540\u0561\u0575\u0565\u0580\u0565\u0576', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'az', name: 'Azerbaijani', native: 'Az\u0259rbaycanca', packSize: '2.0 MB', script: 'latin' },
  { code: 'uz', name: 'Uzbek', native: 'O\u02BBzbekcha', packSize: '2.0 MB', script: 'latin' },
  { code: 'kk', name: 'Kazakh', native: '\u049A\u0430\u0437\u0430\u049B\u0448\u0430', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'mn', name: 'Mongolian', native: '\u041C\u043E\u043D\u0433\u043E\u043B', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'am', name: 'Amharic', native: '\u12A0\u121B\u122D\u129B', packSize: '2.5 MB', script: 'non-latin' },
  { code: 'ha', name: 'Hausa', native: 'Hausa', packSize: '1.8 MB', script: 'latin' },
  { code: 'yo', name: 'Yoruba', native: 'Yor\u00F9b\u00E1', packSize: '1.8 MB', script: 'latin' },
  { code: 'ig', name: 'Igbo', native: 'Igbo', packSize: '1.7 MB', script: 'latin' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', packSize: '1.8 MB', script: 'latin' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', packSize: '1.7 MB', script: 'latin' },
  { code: 'sq', name: 'Albanian', native: 'Shqip', packSize: '1.9 MB', script: 'latin' },
  { code: 'eu', name: 'Basque', native: 'Euskara', packSize: '1.9 MB', script: 'latin' },
  { code: 'be', name: 'Belarusian', native: '\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski', packSize: '1.9 MB', script: 'latin' },
  { code: 'bg', name: 'Bulgarian', native: '\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'ca', name: 'Catalan', native: 'Catal\u00E0', packSize: '1.8 MB', script: 'latin' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', packSize: '1.9 MB', script: 'latin' },
  { code: 'et', name: 'Estonian', native: 'Eesti', packSize: '1.9 MB', script: 'latin' },
  { code: 'gl', name: 'Galician', native: 'Galego', packSize: '1.8 MB', script: 'latin' },
  { code: 'is', name: 'Icelandic', native: '\u00CDslenska', packSize: '1.9 MB', script: 'latin' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', packSize: '1.9 MB', script: 'latin' },
  { code: 'lv', name: 'Latvian', native: 'Latvie\u0161u', packSize: '1.9 MB', script: 'latin' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvi\u0173', packSize: '1.9 MB', script: 'latin' },
  { code: 'mk', name: 'Macedonian', native: '\u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'mt', name: 'Maltese', native: 'Malti', packSize: '1.8 MB', script: 'latin' },
  { code: 'sr', name: 'Serbian', native: '\u0421\u0440\u043F\u0441\u043A\u0438', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'sk', name: 'Slovak', native: 'Sloven\u010Dina', packSize: '2.0 MB', script: 'latin' },
  { code: 'sl', name: 'Slovenian', native: 'Sloven\u0161\u010Dina', packSize: '1.9 MB', script: 'latin' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', packSize: '1.8 MB', script: 'latin' },
  { code: 'gd', name: 'Scottish Gaelic', native: 'G\u00E0idhlig', packSize: '1.8 MB', script: 'latin' },
  { code: 'la', name: 'Latin', native: 'Latina', packSize: '1.6 MB', script: 'latin' },
  { code: 'eo', name: 'Esperanto', native: 'Esperanto', packSize: '1.5 MB', script: 'latin' },
  { code: 'haw', name: 'Hawaiian', native: '\u02BBO\u0304lelo Hawai\u02BBi', packSize: '1.4 MB', script: 'latin' },
  { code: 'mi', name: 'Maori', native: 'Te Reo M\u0101ori', packSize: '1.5 MB', script: 'latin' },
  { code: 'sm', name: 'Samoan', native: 'Gagana S\u0101moa', packSize: '1.4 MB', script: 'latin' },
  { code: 'so', name: 'Somali', native: 'Soomaali', packSize: '1.7 MB', script: 'latin' },
  { code: 'ku', name: 'Kurdish', native: 'Kurd\u00EE', packSize: '2.0 MB', script: 'latin' },
  { code: 'ps', name: 'Pashto', native: '\u067E\u069A\u062A\u0648', packSize: '2.4 MB', script: 'non-latin' },
  { code: 'sd', name: 'Sindhi', native: '\u0633\u0646\u068C\u064A', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'or', name: 'Odia', native: '\u0B13\u0B21\u0B3C\u0B3F\u0B06', packSize: '2.2 MB', script: 'non-latin' },
  { code: 'as', name: 'Assamese', native: '\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE', packSize: '2.2 MB', script: 'non-latin' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda', packSize: '1.6 MB', script: 'latin' },
  { code: 'mg', name: 'Malagasy', native: 'Malagasy', packSize: '1.7 MB', script: 'latin' },
  { code: 'sn', name: 'Shona', native: 'chiShona', packSize: '1.7 MB', script: 'latin' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', packSize: '1.8 MB', script: 'latin' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho', packSize: '1.7 MB', script: 'latin' },
  { code: 'ny', name: 'Chichewa', native: 'Chichewa', packSize: '1.7 MB', script: 'latin' },
  { code: 'tk', name: 'Turkmen', native: 'T\u00FCrkmen\u00E7e', packSize: '2.0 MB', script: 'latin' },
  { code: 'ky', name: 'Kyrgyz', native: '\u041A\u044B\u0440\u0433\u044B\u0437\u0447\u0430', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'tg', name: 'Tajik', native: '\u0422\u043E\u04B7\u0438\u043A\u04E3', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'tt', name: 'Tatar', native: '\u0422\u0430\u0442\u0430\u0440\u0447\u0430', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'ceb', name: 'Cebuano', native: 'Sinugbuanon', packSize: '1.7 MB', script: 'latin' },
  { code: 'jv', name: 'Javanese', native: 'Basa Jawa', packSize: '1.8 MB', script: 'latin' },
  { code: 'su', name: 'Sundanese', native: 'Basa Sunda', packSize: '1.8 MB', script: 'latin' },
  { code: 'hmn', name: 'Hmong', native: 'Hmoob', packSize: '1.7 MB', script: 'latin' },
  { code: 'yi', name: 'Yiddish', native: '\u05D9\u05D9\u05D3\u05D9\u05E9', packSize: '2.3 MB', script: 'non-latin' },
  { code: 'lb', name: 'Luxembourgish', native: 'L\u00EBtzebuergesch', packSize: '1.8 MB', script: 'latin' },
  { code: 'fy', name: 'Frisian', native: 'Frysk', packSize: '1.7 MB', script: 'latin' },
];

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

interface CategoryDef {
  key: string;
  label: string;
  emoji: string;
  color: string;
}

const categoryDefs: CategoryDef[] = [
  { key: 'Greetings', label: 'Greetings', emoji: '\uD83D\uDC4B', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'Directions', label: 'Directions', emoji: '\uD83E\uDDED', color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'Emergency', label: 'Emergencies', emoji: '\uD83D\uDEA8', color: 'bg-red-50 text-red-700 border-red-200' },
  { key: 'Transport', label: 'Transport', emoji: '\uD83D\uDE95', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { key: 'Food', label: 'Food Ordering', emoji: '\uD83C\uDF7D\uFE0F', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { key: 'Bargaining', label: 'Bargaining', emoji: '\uD83D\uDCB0', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'Numbers', label: 'Numbers', emoji: '\uD83D\uDD22', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'Shopping', label: 'Shopping', emoji: '\uD83D\uDECD\uFE0F', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { key: 'Accommodation', label: 'Accommodation', emoji: '\uD83C\uDFE8', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'Health', label: 'Health', emoji: '\uD83C\uDFE5', color: 'bg-teal-50 text-teal-700 border-teal-200' },
];

// ---------------------------------------------------------------------------
// Phrase data
// ---------------------------------------------------------------------------

interface Phrase {
  id: string;
  category: string;
  original: string;
  translation: string;
  transliteration: string;
  pronunciation: string;
  essential: boolean;
  isCustom?: boolean;
}

const phrasesDatabase: Phrase[] = [
  // ---- Greetings ----
  { id: 'g1', category: 'Greetings', original: 'Hello / Greetings', translation: '\u0928\u092E\u0938\u094D\u0924\u0947', transliteration: 'Namaste', pronunciation: 'nuh-MUS-tay', essential: true },
  { id: 'g2', category: 'Greetings', original: 'How are you?', translation: '\u0906\u092A \u0915\u0948\u0938\u0947 \u0939\u0948\u0902?', transliteration: 'Aap kaise hain?', pronunciation: 'aap KAY-say hain', essential: true },
  { id: 'g3', category: 'Greetings', original: 'I am fine', translation: '\u092E\u0948\u0902 \u0920\u0940\u0915 \u0939\u0942\u0901', transliteration: 'Main theek hoon', pronunciation: 'main THEEK hoon', essential: false },
  { id: 'g4', category: 'Greetings', original: 'Thank you', translation: '\u0927\u0928\u094D\u092F\u0935\u093E\u0926', transliteration: 'Dhanyavaad', pronunciation: 'dhun-yuh-VAAD', essential: true },
  { id: 'g5', category: 'Greetings', original: 'Please', translation: '\u0915\u0943\u092A\u092F\u093E', transliteration: 'Kripaya', pronunciation: 'KRIP-uh-yah', essential: true },
  { id: 'g6', category: 'Greetings', original: 'Sorry / Excuse me', translation: '\u092E\u093E\u0934\u093C \u0915\u0940\u091C\u093F\u090F', transliteration: 'Maaf keejiye', pronunciation: 'maaf KEE-ji-yay', essential: true },
  { id: 'g7', category: 'Greetings', original: 'Yes', translation: '\u0939\u093E\u0901', transliteration: 'Haan', pronunciation: 'haan', essential: true },
  { id: 'g8', category: 'Greetings', original: 'No', translation: '\u0928\u0939\u0940\u0902', transliteration: 'Nahin', pronunciation: 'nuh-HEEN', essential: true },
  { id: 'g9', category: 'Greetings', original: 'Good morning', translation: '\u0938\u0941\u092A\u094D\u0930\u092D\u093E\u0924', transliteration: 'Suprabhat', pronunciation: 'su-pruh-BHAT', essential: false },
  { id: 'g10', category: 'Greetings', original: 'Goodbye', translation: '\u0905\u0932\u0935\u093F\u0926\u093E', transliteration: 'Alvida', pronunciation: 'ul-vi-DAH', essential: true },
  { id: 'g11', category: 'Greetings', original: 'Good evening', translation: '\u0936\u0941\u092D \u0938\u0902\u0927\u094D\u092F\u093E', transliteration: 'Shubh sandhya', pronunciation: 'shubh SUN-dhyah', essential: false },
  { id: 'g12', category: 'Greetings', original: 'My name is...', translation: '\u092E\u0947\u0930\u093E \u0928\u093E\u092E ... \u0939\u0948', transliteration: 'Mera naam ... hai', pronunciation: 'MAY-rah naam ... hai', essential: true },
  { id: 'g13', category: 'Greetings', original: 'Nice to meet you', translation: '\u0906\u092A\u0938\u0947 \u092E\u093F\u0932\u0915\u0930 \u0916\u0941\u0936\u0940 \u0939\u0941\u0908', transliteration: 'Aapse milkar khushi hui', pronunciation: 'aap-SAY mil-KAR khu-SHEE hui', essential: false },
  { id: 'g14', category: 'Greetings', original: 'I don\'t understand', translation: '\u092E\u0948\u0902 \u0928\u0939\u0940\u0902 \u0938\u092E\u091D\u093E', transliteration: 'Main nahin samjha', pronunciation: 'main nuh-HEEN SUM-jhah', essential: true },
  { id: 'g15', category: 'Greetings', original: 'Do you speak English?', translation: '\u0915\u094D\u092F\u093E \u0906\u092A \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u0940 \u092C\u094B\u0932\u0924\u0947 \u0939\u0948\u0902?', transliteration: 'Kya aap angrezi bolte hain?', pronunciation: 'kyah aap un-GRAY-zee BOL-tay hain', essential: true },

  // ---- Directions ----
  { id: 'd1', category: 'Directions', original: 'Where is...?', translation: '...\u0915\u0939\u093E\u0901 \u0939\u0948?', transliteration: '...kahaan hai?', pronunciation: 'kuh-HAAN hai', essential: true },
  { id: 'd2', category: 'Directions', original: 'Left', translation: '\u092C\u093E\u090F\u0901', transliteration: 'Baayein', pronunciation: 'BAA-yein', essential: true },
  { id: 'd3', category: 'Directions', original: 'Right', translation: '\u0926\u093E\u090F\u0901', transliteration: 'Daayein', pronunciation: 'DAA-yein', essential: true },
  { id: 'd4', category: 'Directions', original: 'Straight ahead', translation: '\u0938\u0940\u0927\u0947', transliteration: 'Seedhe', pronunciation: 'SEE-dhay', essential: true },
  { id: 'd5', category: 'Directions', original: 'How far is it?', translation: '\u0915\u093F\u0924\u0928\u0940 \u0926\u0942\u0930 \u0939\u0948?', transliteration: 'Kitni door hai?', pronunciation: 'kit-NEE door hai', essential: false },
  { id: 'd6', category: 'Directions', original: 'Near / Close', translation: '\u092A\u093E\u0938', transliteration: 'Paas', pronunciation: 'paas', essential: false },
  { id: 'd7', category: 'Directions', original: 'Far', translation: '\u0926\u0942\u0930', transliteration: 'Door', pronunciation: 'door', essential: false },
  { id: 'd8', category: 'Directions', original: 'I am lost', translation: '\u092E\u0948\u0902 \u0916\u094B \u0917\u092F\u093E \u0939\u0942\u0901', transliteration: 'Main kho gaya hoon', pronunciation: 'main KHO guh-yah hoon', essential: true },
  { id: 'd9', category: 'Directions', original: 'Stop here', translation: '\u092F\u0939\u093E\u0901 \u0930\u0941\u0915\u093F\u090F', transliteration: 'Yahaan rukiye', pronunciation: 'yuh-HAAN roo-ki-yay', essential: true },
  { id: 'd10', category: 'Directions', original: 'Show me on the map', translation: '\u0928\u0915\u094D\u0936\u0947 \u092A\u0930 \u0926\u093F\u0916\u093E\u0907\u090F', transliteration: 'Nakshe par dikhaiye', pronunciation: 'NUK-shay par di-KHAI-yay', essential: false },

  // ---- Emergency ----
  { id: 'e1', category: 'Emergency', original: 'Help!', translation: '\u092C\u091A\u093E\u0913!', transliteration: 'Bachao!', pronunciation: 'buh-CHOW', essential: true },
  { id: 'e2', category: 'Emergency', original: 'Call the police', translation: '\u092A\u0941\u0932\u093F\u0938 \u0915\u094B \u092C\u0941\u0932\u093E\u0913', transliteration: 'Police ko bulao', pronunciation: 'po-LEES ko boo-LAO', essential: true },
  { id: 'e3', category: 'Emergency', original: 'I need a doctor', translation: '\u092E\u0941\u091D\u0947 \u0921\u0949\u0915\u094D\u091F\u0930 \u091A\u093E\u0939\u093F\u090F', transliteration: 'Mujhe doctor chahiye', pronunciation: 'muj-HAY DOK-tor CHAH-hi-yay', essential: true },
  { id: 'e4', category: 'Emergency', original: 'Hospital', translation: '\u0905\u0938\u094D\u092A\u0924\u093E\u0932', transliteration: 'Aspataal', pronunciation: 'us-puh-TAAL', essential: true },
  { id: 'e5', category: 'Emergency', original: 'I am hurt', translation: '\u092E\u0941\u091D\u0947 \u091A\u094B\u091F \u0932\u0917\u0940 \u0939\u0948', transliteration: 'Mujhe chot lagi hai', pronunciation: 'muj-HAY choht LUG-ee hai', essential: true },
  { id: 'e6', category: 'Emergency', original: 'Fire!', translation: '\u0906\u0917!', transliteration: 'Aag!', pronunciation: 'aag', essential: true },
  { id: 'e7', category: 'Emergency', original: 'I lost my passport', translation: '\u092E\u0947\u0930\u093E \u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u0916\u094B \u0917\u092F\u093E', transliteration: 'Mera passport kho gaya', pronunciation: 'MAY-rah PASS-port kho GUH-yah', essential: true },
  { id: 'e8', category: 'Emergency', original: 'Call an ambulance', translation: '\u090F\u092E\u094D\u092C\u0941\u0932\u0947\u0902\u0938 \u092C\u0941\u0932\u093E\u0913', transliteration: 'Ambulance bulao', pronunciation: 'AM-boo-lunce boo-LAO', essential: true },
  { id: 'e9', category: 'Emergency', original: 'I need help', translation: '\u092E\u0941\u091D\u0947 \u092E\u0926\u0926 \u091A\u093E\u0939\u093F\u090F', transliteration: 'Mujhe madad chahiye', pronunciation: 'muj-HAY MUH-dud CHAH-hi-yay', essential: true },
  { id: 'e10', category: 'Emergency', original: 'Embassy', translation: '\u0926\u0942\u0924\u093E\u0935\u093E\u0938', transliteration: 'Dootawaas', pronunciation: 'DOO-tah-vaas', essential: false },

  // ---- Transport ----
  { id: 't1', category: 'Transport', original: 'Where is the bus stop?', translation: '\u092C\u0938 \u0938\u094D\u091F\u0949\u092A \u0915\u0939\u093E\u0901 \u0939\u0948?', transliteration: 'Bus stop kahaan hai?', pronunciation: 'bus stop kuh-HAAN hai', essential: true },
  { id: 't2', category: 'Transport', original: 'Taxi', translation: '\u091F\u0948\u0915\u094D\u0938\u0940', transliteration: 'Taxi', pronunciation: 'TEK-see', essential: true },
  { id: 't3', category: 'Transport', original: 'Airport', translation: '\u0939\u0935\u093E\u0908 \u0905\u0921\u094D\u0921\u093E', transliteration: 'Hawai adda', pronunciation: 'huh-WAI ud-DAH', essential: true },
  { id: 't4', category: 'Transport', original: 'Train station', translation: '\u0930\u0947\u0932\u0935\u0947 \u0938\u094D\u091F\u0947\u0936\u0928', transliteration: 'Railway station', pronunciation: 'RAIL-way STAY-shun', essential: true },
  { id: 't5', category: 'Transport', original: 'How much to go to...?', translation: '...\u091C\u093E\u0928\u0947 \u0915\u093E \u0915\u093F\u0924\u0928\u093E?', transliteration: '...jaane ka kitna?', pronunciation: '...JAH-nay kah kit-NAH', essential: true },
  { id: 't6', category: 'Transport', original: 'Take me to...', translation: '\u092E\u0941\u091D\u0947 ... \u0932\u0947 \u091A\u0932\u093F\u090F', transliteration: 'Mujhe ... le chaliye', pronunciation: 'muj-HAY ... lay CHUH-li-yay', essential: true },
  { id: 't7', category: 'Transport', original: 'One ticket to...', translation: '...\u0915\u093E \u090F\u0915 \u091F\u093F\u0915\u091F', transliteration: '...ka ek ticket', pronunciation: '...kah ayk TIK-ut', essential: false },
  { id: 't8', category: 'Transport', original: 'When does it leave?', translation: '\u092F\u0939 \u0915\u092C \u091C\u093E\u090F\u0917\u093E?', transliteration: 'Yeh kab jayega?', pronunciation: 'yeh kub JAH-yay-gah', essential: false },
  { id: 't9', category: 'Transport', original: 'Please use the meter', translation: '\u092E\u0940\u091F\u0930 \u0938\u0947 \u091A\u0932\u093F\u090F', transliteration: 'Meter se chaliye', pronunciation: 'MEE-ter say CHUH-li-yay', essential: true },
  { id: 't10', category: 'Transport', original: 'Is this the right way?', translation: '\u0915\u094D\u092F\u093E \u092F\u0939 \u0938\u0939\u0940 \u0930\u093E\u0938\u094D\u0924\u093E \u0939\u0948?', transliteration: 'Kya yeh sahi raasta hai?', pronunciation: 'kyah yeh suh-HEE RAHS-tah hai', essential: false },

  // ---- Food Ordering ----
  { id: 'f1', category: 'Food', original: 'Water', translation: '\u092A\u093E\u0928\u0940', transliteration: 'Paani', pronunciation: 'PAA-nee', essential: true },
  { id: 'f2', category: 'Food', original: 'I am vegetarian', translation: '\u092E\u0948\u0902 \u0936\u093E\u0915\u093E\u0939\u093E\u0930\u0940 \u0939\u0942\u0901', transliteration: 'Main shakahari hoon', pronunciation: 'main shah-kah-HAR-ee hoon', essential: true },
  { id: 'f3', category: 'Food', original: 'The bill please', translation: '\u092C\u093F\u0932 \u0926\u0940\u091C\u093F\u090F', transliteration: 'Bill deejiye', pronunciation: 'bill DEE-ji-yay', essential: true },
  { id: 'f4', category: 'Food', original: 'Delicious!', translation: '\u092C\u0939\u0941\u0924 \u0938\u094D\u0935\u093E\u0926\u093F\u0937\u094D\u091F!', transliteration: 'Bahut swaadisht!', pronunciation: 'buh-HUT swah-DISHT', essential: false },
  { id: 'f5', category: 'Food', original: 'Not spicy please', translation: '\u0924\u0940\u0916\u093E \u092E\u0924 \u092C\u0928\u093E\u0907\u090F', transliteration: 'Teekha mat banaiye', pronunciation: 'TEE-kha mut buh-NAI-yay', essential: true },
  { id: 'f6', category: 'Food', original: 'Menu please', translation: '\u092E\u0947\u0928\u0942 \u0926\u0940\u091C\u093F\u090F', transliteration: 'Menu deejiye', pronunciation: 'MEN-oo DEE-ji-yay', essential: false },
  { id: 'f7', category: 'Food', original: 'Tea', translation: '\u091A\u093E\u092F', transliteration: 'Chai', pronunciation: 'chai', essential: false },
  { id: 'f8', category: 'Food', original: 'I have food allergies', translation: '\u092E\u0941\u091D\u0947 \u0916\u093E\u0928\u0947 \u0938\u0947 \u090F\u0932\u0930\u094D\u091C\u0940 \u0939\u0948', transliteration: 'Mujhe khaane se allergy hai', pronunciation: 'muj-HAY KHAH-nay say AL-ur-jee hai', essential: true },
  { id: 'f9', category: 'Food', original: 'No nuts please', translation: '\u092E\u0947\u0935\u0947 \u0928\u0939\u0940\u0902 \u0921\u093E\u0932\u093F\u090F', transliteration: 'Meve nahin daliye', pronunciation: 'MAY-vay nuh-HEEN DAH-li-yay', essential: false },
  { id: 'f10', category: 'Food', original: 'One more please', translation: '\u090F\u0915 \u0914\u0930 \u0926\u0940\u091C\u093F\u090F', transliteration: 'Ek aur deejiye', pronunciation: 'ayk OHR DEE-ji-yay', essential: false },

  // ---- Bargaining ----
  { id: 'b1', category: 'Bargaining', original: 'How much is this?', translation: '\u092F\u0939 \u0915\u093F\u0924\u0928\u0947 \u0915\u093E \u0939\u0948?', transliteration: 'Yeh kitne ka hai?', pronunciation: 'yeh kit-NAY kah hai', essential: true },
  { id: 'b2', category: 'Bargaining', original: 'Too expensive', translation: '\u092C\u0939\u0941\u0924 \u092E\u0939\u0902\u0917\u093E', transliteration: 'Bahut mehnga', pronunciation: 'buh-HUT meh-UN-gah', essential: true },
  { id: 'b3', category: 'Bargaining', original: 'Can you lower the price?', translation: '\u0915\u092E \u0915\u0930\u094B', transliteration: 'Kam karo', pronunciation: 'kum KUH-roh', essential: true },
  { id: 'b4', category: 'Bargaining', original: 'Last price?', translation: '\u0906\u0916\u093F\u0930\u0940 \u0926\u093E\u092E?', transliteration: 'Aakhiri daam?', pronunciation: 'ah-KHI-ree daam', essential: true },
  { id: 'b5', category: 'Bargaining', original: 'I\'ll buy if you lower it', translation: '\u0915\u092E \u0915\u0930\u094B\u0917\u0947 \u0924\u094B \u0932\u0947 \u0932\u0942\u0901\u0917\u093E', transliteration: 'Kam karoge to le loonga', pronunciation: 'kum kuh-ROH-gay toh lay LOON-gah', essential: false },
  { id: 'b6', category: 'Bargaining', original: 'I\'m just looking', translation: '\u092E\u0948\u0902 \u092C\u0938 \u0926\u0947\u0916 \u0930\u0939\u093E \u0939\u0942\u0901', transliteration: 'Main bas dekh raha hoon', pronunciation: 'main bus daykh ruh-HAH hoon', essential: true },
  { id: 'b7', category: 'Bargaining', original: 'I\'ll think about it', translation: '\u092E\u0948\u0902 \u0938\u094B\u091A\u0942\u0901\u0917\u093E', transliteration: 'Main sochoonga', pronunciation: 'main so-CHOON-gah', essential: false },
  { id: 'b8', category: 'Bargaining', original: 'Do you have a cheaper one?', translation: '\u0915\u094B\u0908 \u0938\u0938\u094D\u0924\u093E \u0935\u093E\u0932\u093E \u0939\u0948?', transliteration: 'Koi sasta wala hai?', pronunciation: 'koy SUS-tah WAH-lah hai', essential: false },
  { id: 'b9', category: 'Bargaining', original: 'I\'ll pay cash', translation: '\u092E\u0948\u0902 \u0928\u0915\u0926 \u0926\u0942\u0901\u0917\u093E', transliteration: 'Main nakad doonga', pronunciation: 'main NUK-ud DOON-gah', essential: false },
  { id: 'b10', category: 'Bargaining', original: 'Can you give a discount?', translation: '\u0915\u0941\u091B \u0921\u093F\u0938\u094D\u0915\u093E\u0909\u0902\u091F \u092E\u093F\u0932\u0947\u0917\u093E?', transliteration: 'Kuch discount milega?', pronunciation: 'kuch DIS-count MI-lay-gah', essential: true },

  // ---- Numbers ----
  { id: 'n1', category: 'Numbers', original: 'One', translation: '\u090F\u0915', transliteration: 'Ek', pronunciation: 'ayk', essential: true },
  { id: 'n2', category: 'Numbers', original: 'Two', translation: '\u0926\u094B', transliteration: 'Do', pronunciation: 'doh', essential: true },
  { id: 'n3', category: 'Numbers', original: 'Three', translation: '\u0924\u0940\u0928', transliteration: 'Teen', pronunciation: 'teen', essential: true },
  { id: 'n4', category: 'Numbers', original: 'Four', translation: '\u091A\u093E\u0930', transliteration: 'Chaar', pronunciation: 'chaar', essential: false },
  { id: 'n5', category: 'Numbers', original: 'Five', translation: '\u092A\u093E\u0901\u091A', transliteration: 'Paanch', pronunciation: 'paanch', essential: false },
  { id: 'n6', category: 'Numbers', original: 'Ten', translation: '\u0926\u0938', transliteration: 'Das', pronunciation: 'dus', essential: true },
  { id: 'n7', category: 'Numbers', original: 'Twenty', translation: '\u092C\u0940\u0938', transliteration: 'Bees', pronunciation: 'bees', essential: false },
  { id: 'n8', category: 'Numbers', original: 'Fifty', translation: '\u092A\u091A\u093E\u0938', transliteration: 'Pachaas', pronunciation: 'puh-CHAAS', essential: false },
  { id: 'n9', category: 'Numbers', original: 'Hundred', translation: '\u0938\u094C', transliteration: 'Sau', pronunciation: 'sow', essential: true },
  { id: 'n10', category: 'Numbers', original: 'Thousand', translation: '\u0939\u091C\u093C\u093E\u0930', transliteration: 'Hazaar', pronunciation: 'huh-ZAAR', essential: false },

  // ---- Shopping ----
  { id: 's1', category: 'Shopping', original: 'How much?', translation: '\u0915\u093F\u0924\u0928\u093E?', transliteration: 'Kitna?', pronunciation: 'kit-NAH', essential: true },
  { id: 's2', category: 'Shopping', original: 'I want to buy', translation: '\u092E\u0941\u091D\u0947 \u0916\u0930\u0940\u0926\u0928\u093E \u0939\u0948', transliteration: 'Mujhe khareedna hai', pronunciation: 'muj-HAY khuh-REED-nah hai', essential: false },
  { id: 's3', category: 'Shopping', original: 'I don\'t want', translation: '\u092E\u0941\u091D\u0947 \u0928\u0939\u0940\u0902 \u091A\u093E\u0939\u093F\u090F', transliteration: 'Mujhe nahin chahiye', pronunciation: 'muj-HAY nuh-HEEN CHAH-hi-yay', essential: true },
  { id: 's4', category: 'Shopping', original: 'Do you accept cards?', translation: '\u0915\u094D\u092F\u093E \u0906\u092A \u0915\u093E\u0930\u094D\u0921 \u0932\u0947\u0924\u0947 \u0939\u0948\u0902?', transliteration: 'Kya aap card lete hain?', pronunciation: 'kyah aap CARD lay-tay hain', essential: true },
  { id: 's5', category: 'Shopping', original: 'Can I see this?', translation: '\u0915\u094D\u092F\u093E \u092E\u0948\u0902 \u092F\u0939 \u0926\u0947\u0916 \u0938\u0915\u0924\u093E \u0939\u0942\u0901?', transliteration: 'Kya main yeh dekh sakta hoon?', pronunciation: 'kyah main yeh daykh SUK-tah hoon', essential: false },
  { id: 's6', category: 'Shopping', original: 'Do you have a bigger size?', translation: '\u0915\u094D\u092F\u093E \u092C\u0921\u093C\u093E \u0938\u093E\u0907\u091C\u093C \u0939\u0948?', transliteration: 'Kya bada size hai?', pronunciation: 'kyah BUH-dah SIZE hai', essential: false },
  { id: 's7', category: 'Shopping', original: 'Where is the market?', translation: '\u092C\u093E\u091C\u093C\u093E\u0930 \u0915\u0939\u093E\u0901 \u0939\u0948?', transliteration: 'Bazaar kahaan hai?', pronunciation: 'buh-ZAAR kuh-HAAN hai', essential: false },
  { id: 's8', category: 'Shopping', original: 'Receipt please', translation: '\u0930\u0938\u0940\u0926 \u0926\u0940\u091C\u093F\u090F', transliteration: 'Raseed deejiye', pronunciation: 'ruh-SEED DEE-ji-yay', essential: false },
  { id: 's9', category: 'Shopping', original: 'Can I try this on?', translation: '\u0915\u094D\u092F\u093E \u092E\u0948\u0902 \u092F\u0939 \u092A\u0939\u0928 \u0938\u0915\u0924\u093E \u0939\u0942\u0901?', transliteration: 'Kya main yeh pehan sakta hoon?', pronunciation: 'kyah main yeh PAY-hun SUK-tah hoon', essential: false },
  { id: 's10', category: 'Shopping', original: 'This is beautiful', translation: '\u092F\u0939 \u092C\u0939\u0941\u0924 \u0938\u0941\u0902\u0926\u0930 \u0939\u0948', transliteration: 'Yeh bahut sundar hai', pronunciation: 'yeh buh-HUT SUN-dur hai', essential: false },

  // ---- Accommodation ----
  { id: 'a1', category: 'Accommodation', original: 'Do you have a room?', translation: '\u0915\u094D\u092F\u093E \u0915\u092E\u0930\u093E \u0939\u0948?', transliteration: 'Kya kamra hai?', pronunciation: 'kyah KUM-rah hai', essential: true },
  { id: 'a2', category: 'Accommodation', original: 'How much per night?', translation: '\u090F\u0915 \u0930\u093E\u0924 \u0915\u093E \u0915\u093F\u0924\u0928\u093E?', transliteration: 'Ek raat ka kitna?', pronunciation: 'ayk RAAT kah kit-NAH', essential: true },
  { id: 'a3', category: 'Accommodation', original: 'Check in', translation: '\u091A\u0947\u0915 \u0907\u0928', transliteration: 'Check in', pronunciation: 'check in', essential: true },
  { id: 'a4', category: 'Accommodation', original: 'Check out', translation: '\u091A\u0947\u0915 \u0906\u0909\u091F', transliteration: 'Check out', pronunciation: 'check out', essential: true },
  { id: 'a5', category: 'Accommodation', original: 'I have a reservation', translation: '\u092E\u0947\u0930\u093E \u0930\u093F\u091C\u093C\u0930\u094D\u0935\u0947\u0936\u0928 \u0939\u0948', transliteration: 'Mera reservation hai', pronunciation: 'MAY-rah re-zer-VAY-shun hai', essential: true },
  { id: 'a6', category: 'Accommodation', original: 'WiFi password?', translation: '\u0935\u093E\u0908\u092B\u093C\u093E\u0908 \u0915\u093E \u092A\u093E\u0938\u0935\u0930\u094D\u0921?', transliteration: 'WiFi ka password?', pronunciation: 'WY-fy kah PASS-wurd', essential: true },
  { id: 'a7', category: 'Accommodation', original: 'Air conditioning', translation: '\u090F\u0938\u0940', transliteration: 'AC', pronunciation: 'AY-see', essential: false },
  { id: 'a8', category: 'Accommodation', original: 'Hot water', translation: '\u0917\u0930\u094D\u092E \u092A\u093E\u0928\u0940', transliteration: 'Garam paani', pronunciation: 'GUH-rum PAA-nee', essential: false },
  { id: 'a9', category: 'Accommodation', original: 'Can I see the room first?', translation: '\u0915\u094D\u092F\u093E \u092A\u0939\u0932\u0947 \u0915\u092E\u0930\u093E \u0926\u0947\u0916 \u0938\u0915\u0924\u093E \u0939\u0942\u0901?', transliteration: 'Kya pehle kamra dekh sakta hoon?', pronunciation: 'kyah PAY-lay KUM-rah daykh SUK-tah hoon', essential: false },
  { id: 'a10', category: 'Accommodation', original: 'Towels please', translation: '\u0924\u094C\u0932\u093F\u092F\u093E \u0926\u0940\u091C\u093F\u090F', transliteration: 'Tauliya deejiye', pronunciation: 'tow-LI-yah DEE-ji-yay', essential: false },

  // ---- Health ----
  { id: 'h1', category: 'Health', original: 'I feel sick', translation: '\u092E\u0947\u0930\u0940 \u0924\u092C\u0940\u092F\u0924 \u0916\u0930\u093E\u092C \u0939\u0948', transliteration: 'Meri tabiyat kharab hai', pronunciation: 'MAY-ree tuh-BEE-yut khuh-RAAB hai', essential: true },
  { id: 'h2', category: 'Health', original: 'I have a headache', translation: '\u092E\u0947\u0930\u0947 \u0938\u093F\u0930 \u092E\u0947\u0902 \u0926\u0930\u094D\u0926 \u0939\u0948', transliteration: 'Mere sir mein dard hai', pronunciation: 'MAY-ray sir main DURD hai', essential: true },
  { id: 'h3', category: 'Health', original: 'I have a fever', translation: '\u092E\u0941\u091D\u0947 \u092C\u0941\u0916\u093E\u0930 \u0939\u0948', transliteration: 'Mujhe bukhar hai', pronunciation: 'muj-HAY boo-KHAR hai', essential: true },
  { id: 'h4', category: 'Health', original: 'Pharmacy', translation: '\u0926\u0935\u093E\u0908 \u0915\u0940 \u0926\u0941\u0915\u093E\u0928', transliteration: 'Dawai ki dukaan', pronunciation: 'duh-WAI kee doo-KAAN', essential: true },
  { id: 'h5', category: 'Health', original: 'I am allergic to...', translation: '\u092E\u0941\u091D\u0947 ... \u0938\u0947 \u090F\u0932\u0930\u094D\u091C\u0940 \u0939\u0948', transliteration: 'Mujhe ... se allergy hai', pronunciation: 'muj-HAY ... say AL-ur-jee hai', essential: true },
  { id: 'h6', category: 'Health', original: 'I have stomach pain', translation: '\u092E\u0947\u0930\u0947 \u092A\u0947\u091F \u092E\u0947\u0902 \u0926\u0930\u094D\u0926 \u0939\u0948', transliteration: 'Mere pet mein dard hai', pronunciation: 'MAY-ray pait main DURD hai', essential: false },
  { id: 'h7', category: 'Health', original: 'I need medicine', translation: '\u092E\u0941\u091D\u0947 \u0926\u0935\u093E\u0908 \u091A\u093E\u0939\u093F\u090F', transliteration: 'Mujhe dawai chahiye', pronunciation: 'muj-HAY duh-WAI CHAH-hi-yay', essential: true },
  { id: 'h8', category: 'Health', original: 'I am diabetic', translation: '\u092E\u0941\u091D\u0947 \u0936\u0942\u0917\u0930 \u0939\u0948', transliteration: 'Mujhe sugar hai', pronunciation: 'muj-HAY SHOO-gur hai', essential: false },
  { id: 'h9', category: 'Health', original: 'Dentist', translation: '\u0926\u093E\u0901\u0924\u094B\u0902 \u0915\u093E \u0921\u0949\u0915\u094D\u091F\u0930', transliteration: 'Daanton ka doctor', pronunciation: 'DAAN-ton kah DOK-tor', essential: false },
  { id: 'h10', category: 'Health', original: 'I am pregnant', translation: '\u092E\u0948\u0902 \u0917\u0930\u094D\u092D\u0935\u0924\u0940 \u0939\u0942\u0901', transliteration: 'Main garbhvati hoon', pronunciation: 'main gurb-VUH-tee hoon', essential: false },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PhrasesPage() {
  const [language, setLanguage] = useState('hi');
  const [category, setCategory] = useState('Greetings');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [customPhrases, setCustomPhrases] = useState<Phrase[]>([]);
  const [downloadedPacks, setDownloadedPacks] = useState<Set<string>>(new Set());
  const [downloadingPack, setDownloadingPack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [quickReplyPhrase, setQuickReplyPhrase] = useState<Phrase | null>(null);

  // Custom phrase form
  const [newOriginal, setNewOriginal] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newTransliteration, setNewTransliteration] = useState('');
  const [newCategory, setNewCategory] = useState('Greetings');

  const selectedLang = languages.find((l) => l.code === language)!;

  const allPhrases = useMemo(() => [...phrasesDatabase, ...customPhrases], [customPhrases]);

  const filteredPhrases = useMemo(() => {
    if (activeTab === 'favorites') {
      const favPhrases = allPhrases.filter((p) => favorites.has(p.id));
      if (searchQuery.length >= 2) {
        const q = searchQuery.toLowerCase();
        return favPhrases.filter(
          (p) =>
            p.original.toLowerCase().includes(q) ||
            p.translation.includes(q) ||
            p.transliteration.toLowerCase().includes(q)
        );
      }
      return favPhrases;
    }
    if (activeTab === 'custom') {
      const customs = customPhrases;
      if (searchQuery.length >= 2) {
        const q = searchQuery.toLowerCase();
        return customs.filter(
          (p) =>
            p.original.toLowerCase().includes(q) ||
            p.translation.includes(q) ||
            p.transliteration.toLowerCase().includes(q)
        );
      }
      return customs;
    }
    // browse tab
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      return allPhrases.filter(
        (p) =>
          p.original.toLowerCase().includes(q) ||
          p.translation.includes(q) ||
          p.transliteration.toLowerCase().includes(q)
      );
    }
    return allPhrases.filter((p) => p.category === category);
  }, [category, searchQuery, allPhrases, favorites, customPhrases, activeTab]);

  const essentialPhrases = useMemo(
    () => allPhrases.filter((p) => p.essential).slice(0, 20),
    [allPhrases]
  );

  const filteredLanguages = useMemo(() => {
    if (!langSearchQuery) return languages;
    const q = langSearchQuery.toLowerCase();
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [langSearchQuery]);

  const toggleFav = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const copyPhrase = useCallback((phrase: Phrase) => {
    navigator.clipboard.writeText(
      `${phrase.original} = ${phrase.translation} (${phrase.transliteration})`
    );
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const playAudio = useCallback((phrase: Phrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.translation);
      utterance.lang = language;
      utterance.rate = 0.8;
      setPlayingId(phrase.id);
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const sharePhrase = useCallback((phrase: Phrase) => {
    const text = `${phrase.original}\n${phrase.translation} (${phrase.transliteration})`;
    if (navigator.share) {
      navigator.share({ title: 'Travel Phrase', text });
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(phrase.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const handleAddCustomPhrase = useCallback(() => {
    if (!newOriginal.trim() || !newTranslation.trim()) return;
    const newPhrase: Phrase = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      original: newOriginal.trim(),
      translation: newTranslation.trim(),
      transliteration: newTransliteration.trim() || newTranslation.trim(),
      pronunciation: '',
      essential: false,
      isCustom: true,
    };
    setCustomPhrases((prev) => [...prev, newPhrase]);
    setNewOriginal('');
    setNewTranslation('');
    setNewTransliteration('');
    setShowAddDialog(false);
  }, [newOriginal, newTranslation, newTransliteration, newCategory]);

  const deleteCustomPhrase = useCallback((id: string) => {
    setCustomPhrases((prev) => prev.filter((p) => p.id !== id));
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const simulateDownload = useCallback((langCode: string) => {
    setDownloadingPack(langCode);
    setTimeout(() => {
      setDownloadedPacks((prev) => new Set([...prev, langCode]));
      setDownloadingPack(null);
    }, 2500);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setShowLangDropdown(false);
    if (showLangDropdown) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showLangDropdown]);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [language]);

  // ------- Render helpers -------

  const renderPhraseCard = (phrase: Phrase, index: number) => (
    <motion.div
      key={phrase.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card
        className={cn(
          'hover:shadow-md transition-all cursor-pointer group',
          phrase.essential && 'border-l-4 border-l-[#E8733A]',
          phrase.isCustom && 'border-l-4 border-l-purple-400',
          quickReplyPhrase?.id === phrase.id && 'ring-2 ring-[#E8733A]/50'
        )}
        onClick={() => setQuickReplyPhrase(phrase)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-[#1A3C5E]">{phrase.translation}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{phrase.original}</p>
              {selectedLang.script === 'non-latin' && phrase.transliteration && (
                <p className="text-sm italic text-[#E8733A]/80 mt-1">{phrase.transliteration}</p>
              )}
              {phrase.pronunciation && (
                <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  {phrase.pronunciation}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); playAudio(phrase); }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  playingId === phrase.id
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                )}
                title="Play audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); copyPhrase(phrase); }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  copiedId === phrase.id
                    ? 'bg-green-50 text-green-500'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                )}
                title="Copy phrase"
              >
                {copiedId === phrase.id ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFav(phrase.id); }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  favorites.has(phrase.id)
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                )}
                title={favorites.has(phrase.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={cn('w-4 h-4', favorites.has(phrase.id) && 'fill-red-500')} />
              </button>
              {phrase.isCustom && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCustomPhrase(phrase.id); }}
                  className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                  title="Delete custom phrase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {phrase.essential && (
              <Badge className="bg-[#E8733A]/10 text-[#E8733A] border-[#E8733A]/20 text-[10px]">
                <Star className="w-2.5 h-2.5 mr-0.5 fill-[#E8733A]" /> Essential
              </Badge>
            )}
            {phrase.isCustom && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                Custom
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] text-gray-400">
              {phrase.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // ------- Main Render -------

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-[#E8733A]" />
          Travel Phrasebook
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Essential phrases for your journey across {languages.length}+ languages
        </p>
      </motion.div>

      {/* Language Selector + Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Language dropdown with search */}
        <div className="relative w-full sm:w-72" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Languages className="w-4 h-4 text-[#E8733A] shrink-0" />
              <span className="truncate">{selectedLang.name}</span>
              <span className="text-gray-400 truncate">{selectedLang.native}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {downloadedPacks.has(language) && (
                <Wifi className="w-3.5 h-3.5 text-green-500" />
              )}
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', showLangDropdown && 'rotate-180')} />
            </div>
          </button>

          <AnimatePresence>
            {showLangDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 top-full mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
              >
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={langSearchQuery}
                      onChange={(e) => setLangSearchQuery(e.target.value)}
                      placeholder="Search languages..."
                      className="w-full h-9 pl-8 pr-3 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-[#E8733A]/30"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredLanguages.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-400">No languages found</div>
                  ) : (
                    filteredLanguages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setShowLangDropdown(false);
                          setLangSearchQuery('');
                        }}
                        className={cn(
                          'w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors',
                          language === l.code && 'bg-[#E8733A]/5'
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {language === l.code && (
                            <CheckCircle className="w-3.5 h-3.5 text-[#E8733A] shrink-0" />
                          )}
                          <span className={cn('font-medium', language === l.code && 'text-[#E8733A]')}>
                            {l.name}
                          </span>
                          <span className="text-gray-400 text-xs">{l.native}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-gray-400">{l.packSize}</span>
                          {downloadedPacks.has(l.code) ? (
                            <Wifi className="w-3 h-3 text-green-500" />
                          ) : (
                            <WifiOff className="w-3 h-3 text-gray-300" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phrases in any language..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Tabs: Browse / Favorites / Custom */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="browse" className="gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Favorites
              {favorites.size > 0 && (
                <span className="ml-1 text-[10px] bg-red-100 text-red-600 rounded-full px-1.5 py-0.5 font-bold">
                  {favorites.size}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Custom
              {customPhrases.length > 0 && (
                <span className="ml-1 text-[10px] bg-purple-100 text-purple-600 rounded-full px-1.5 py-0.5 font-bold">
                  {customPhrases.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse">
            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mt-4">
              {categoryDefs.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setCategory(cat.key);
                    setSearchQuery('');
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5',
                    category === cat.key && !searchQuery
                      ? 'bg-[#1A3C5E] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  <span className="text-xs">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Phrase list */}
            <div className="space-y-3 mt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="animate-pulse space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-2/3" />
                          <div className="h-4 bg-gray-100 rounded w-1/2" />
                          <div className="h-3 bg-gray-100 rounded w-1/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
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
                        <p className="text-gray-400 text-sm">Try a different search term or category</p>
                      </div>
                    ) : (
                      filteredPhrases.map((phrase, i) => renderPhraseCard(phrase, i))
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="space-y-3 mt-4">
              {favorites.size === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No favorite phrases yet</p>
                  <p className="text-gray-400 text-sm">
                    Tap the heart icon on any phrase to save it here
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {filteredPhrases.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No matching favorites</p>
                      </div>
                    ) : (
                      filteredPhrases.map((phrase, i) => renderPhraseCard(phrase, i))
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </TabsContent>

          {/* Custom Tab */}
          <TabsContent value="custom">
            <div className="mt-4 space-y-4">
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-[#E8733A] hover:bg-[#d4642e] text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Custom Phrase
              </Button>

              <div className="space-y-3">
                {customPhrases.length === 0 ? (
                  <div className="text-center py-12">
                    <Plus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No custom phrases yet</p>
                    <p className="text-gray-400 text-sm">
                      Add your own phrases for quick reference
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="custom"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {filteredPhrases.map((phrase, i) => renderPhraseCard(phrase, i))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Reply Panel */}
      <AnimatePresence>
        {quickReplyPhrase && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-40"
          >
            <Card className="shadow-2xl border-[#1A3C5E]/20 bg-white/95 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quick Reply</p>
                    <p className="text-xl font-bold text-[#1A3C5E] mt-1">
                      {quickReplyPhrase.translation}
                    </p>
                    <p className="text-sm text-gray-600">{quickReplyPhrase.original}</p>
                    {selectedLang.script === 'non-latin' && quickReplyPhrase.transliteration && (
                      <p className="text-sm italic text-[#E8733A]/70 mt-0.5">
                        {quickReplyPhrase.transliteration}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setQuickReplyPhrase(null)}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#1A3C5E] hover:bg-[#153350] text-white gap-1.5"
                    onClick={() => {
                      copyPhrase(quickReplyPhrase);
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => playAudio(quickReplyPhrase)}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Speak
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => sharePhrase(quickReplyPhrase)}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => {
                      // simulate sending to chat
                      setQuickReplyPhrase(null);
                    }}
                    title="Send to chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
                  className="bg-[#E8733A]/5 rounded-lg p-3 border border-[#E8733A]/10 hover:bg-[#E8733A]/10 transition-colors cursor-pointer group"
                  onClick={() => setQuickReplyPhrase(phrase)}
                >
                  <p className="text-sm font-bold text-[#1A3C5E]">{phrase.translation}</p>
                  <p className="text-xs text-gray-500">{phrase.original}</p>
                  {selectedLang.script === 'non-latin' && (
                    <p className="text-[10px] italic text-gray-400 mt-0.5">
                      {phrase.transliteration}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3 h-3 text-[#E8733A]" />
                    <span className="text-[10px] text-[#E8733A] font-medium">Tap to use</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Offline Download Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="w-5 h-5 text-[#1A3C5E]" />
              Offline Language Packs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Download language packs to use phrases without an internet connection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {languages.slice(0, 15).map((lang) => {
                const isDownloaded = downloadedPacks.has(lang.code);
                const isDownloading = downloadingPack === lang.code;
                return (
                  <div
                    key={lang.code}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border transition-all',
                      isDownloaded
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                          isDownloaded
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200 text-gray-500'
                        )}
                      >
                        {lang.code.toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{lang.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {lang.native} &middot; {lang.packSize}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => !isDownloaded && !isDownloading && simulateDownload(lang.code)}
                      disabled={isDownloaded || isDownloading}
                      className={cn(
                        'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                        isDownloaded
                          ? 'bg-green-100 text-green-500'
                          : isDownloading
                            ? 'bg-blue-100 text-blue-500'
                            : 'bg-[#1A3C5E]/10 text-[#1A3C5E] hover:bg-[#1A3C5E]/20'
                      )}
                    >
                      {isDownloaded ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            {downloadedPacks.size > 0 && (
              <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                {downloadedPacks.size} language pack{downloadedPacks.size > 1 ? 's' : ''} available offline
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Current language quick download banner */}
      {!downloadedPacks.has(language) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-[#1A3C5E]/20 bg-[#1A3C5E]/5">
            <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-[#1A3C5E]/10 flex items-center justify-center shrink-0">
                  <WifiOff className="w-6 h-6 text-[#1A3C5E]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A3C5E]">
                    Download {selectedLang.name} for Offline Use
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedLang.name} ({selectedLang.native}) language pack &middot;{' '}
                    {selectedLang.packSize}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => simulateDownload(language)}
                disabled={downloadingPack === language}
                className="bg-[#1A3C5E] hover:bg-[#153350] text-white gap-2 shrink-0"
              >
                {downloadingPack === language ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Pack
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add Custom Phrase Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#E8733A]" />
              Add Custom Phrase
            </DialogTitle>
            <DialogDescription>
              Add your own phrase for quick reference during your travels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Original (English)
              </label>
              <input
                type="text"
                value={newOriginal}
                onChange={(e) => setNewOriginal(e.target.value)}
                placeholder="e.g., Where is the bathroom?"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Translation
              </label>
              <input
                type="text"
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
                placeholder="e.g., Bathroom kahan hai?"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Transliteration / Romanization{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={newTransliteration}
                onChange={(e) => setNewTransliteration(e.target.value)}
                placeholder="e.g., Bathroom kahaan hai?"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
              >
                {categoryDefs.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomPhrase}
              disabled={!newOriginal.trim() || !newTranslation.trim()}
              className="bg-[#E8733A] hover:bg-[#d4642e] text-white gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Phrase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
