'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Volume2, BookOpen, ChevronDown, Church, Camera, Heart,
  HandMetal, Banknote, Shirt, Clock, Gift, Eye, ShoppingBag,
  MessageCircle, Megaphone, Info, AlertTriangle, CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

interface CultureSection {
  key: string;
  emoji: string;
  title: string;
  content: string;
  severity?: 'info' | 'warning' | 'important';
}

interface BehaviorRule {
  key: string;
  emoji: string;
  title: string;
  level: 'relaxed' | 'moderate' | 'strict';
  description: string;
}

interface GestureInfo {
  gesture: string;
  emoji: string;
  meaning: string;
  safe: boolean;
}

interface CommonPhrase {
  english: string;
  translation: string;
  pronunciation: string;
}

interface LanguageTips {
  volumeNorm: string;
  gestures: GestureInfo[];
  phrases: CommonPhrase[];
}

interface ReligiousSite {
  type: string;
  emoji: string;
  rules: string[];
}

interface CultureData {
  sections: CultureSection[];
  behavior: BehaviorRule[];
  language: LanguageTips;
  religiousSites: ReligiousSite[];
}

/* ──────────────── Constants ──────────────── */

const countries: CountryOption[] = [
  { code: 'IN', name: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'JP', name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'FR', name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'TH', name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: 'AE', name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}' },
  { code: 'IT', name: 'Italy', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'TR', name: 'Turkey', flag: '\u{1F1F9}\u{1F1F7}' },
  { code: 'MX', name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}' },
];

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const levelStyles = {
  relaxed: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700', label: 'Relaxed' },
  moderate: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', label: 'Moderate' },
  strict: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700', label: 'Strict' },
};

const sectionIcons: Record<string, React.ElementType> = {
  greetings: HandMetal,
  tipping: Banknote,
  'dress-code': Shirt,
  photography: Camera,
  etiquette: BookOpen,
  punctuality: Clock,
  'gift-giving': Gift,
};

/* ──────────────── Culture Database ──────────────── */

const cultureDatabase: Record<string, CultureData> = {
  IN: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'The traditional greeting is "Namaste" with palms pressed together at chest level and a slight bow. Handshakes are common in business settings, especially in urban areas. Use the right hand for greetings and passing items. Avoid pointing with a single finger; use your whole hand instead. The head wobble (side-to-side nod) means "yes" or acknowledgment.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'Tipping is appreciated but not mandatory. 10-15% at restaurants if service charge is not included. Round up auto-rickshaw and taxi fares. Tip hotel bellboys 50-100 INR per bag. Tour guides appreciate 200-500 INR per day. Avoid tipping at street food stalls or small eateries.' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'Modest clothing is recommended, especially outside major cities. Cover shoulders and knees when visiting religious sites. Remove shoes before entering temples, mosques, and some homes. White is associated with mourning; avoid at celebrations. Bright colors are welcome at festivals and weddings.' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: '"Indian Standard Time" informally means events may start 15-30 minutes late. Business meetings generally start on time in corporate settings. Social gatherings often run on flexible schedules. Be patient and plan buffer time for appointments. Train schedules are generally reliable; buses less so.', severity: 'info' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Gifts are usually not opened in front of the giver. Avoid wrapping gifts in white or black (associated with mourning). Green, red, and yellow are auspicious colors. Sweets and fruits are safe gift choices. Avoid leather products for Hindu hosts. Money gifts should be in odd numbers (e.g., 501, 1001 INR).' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'moderate', description: 'Always ask permission before photographing people, especially in rural areas. Photography is prohibited inside many temples and at some monuments. Some sites charge a camera fee. Military installations and border areas strictly prohibit photography.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'strict', description: 'PDA is generally frowned upon in India. Holding hands is acceptable in urban areas, but kissing or hugging in public may attract unwanted attention or even legal issues in some states. Same-sex PDA should be avoided as social acceptance varies widely.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'strict', description: 'India is deeply religious with Hinduism, Islam, Sikhism, Buddhism, Christianity, and Jainism. Respect all religious practices. Never touch religious idols without permission. During festivals, expect road closures and increased crowds. Friday prayers at mosques and Sunday mass may affect nearby areas.' },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'relaxed', description: 'Bargaining is expected and enjoyed in street markets, bazaars, and with auto-rickshaw drivers. Start at 40-50% of the asking price. Fixed-price shops and malls do not allow bargaining. Bargaining is considered an art and social interaction, not confrontational.' },
    ],
    language: {
      volumeNorm: 'Indians tend to speak at a higher volume, especially in social settings. Loud conversations in public are normal and not considered rude. Adjust your expectations and do not take it as aggression.',
      gestures: [
        { gesture: 'Head wobble (side-to-side)', emoji: '\u{1F642}', meaning: 'Yes, I understand, or acknowledgment', safe: true },
        { gesture: 'Touching feet of elders', emoji: '\u{1F64F}', meaning: 'Deep respect for elders', safe: true },
        { gesture: 'Pointing with index finger', emoji: '\u{261D}\u{FE0F}', meaning: 'Considered rude; use open hand instead', safe: false },
        { gesture: 'Beckoning with palm down', emoji: '\u{1F44B}', meaning: 'Come here (palm up is rude)', safe: true },
        { gesture: 'Left hand for giving/receiving', emoji: '\u{1F91A}', meaning: 'Considered unclean; always use right hand', safe: false },
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
    religiousSites: [
      { type: 'Hindu Temple', emoji: '\u{1F6D5}', rules: ['Remove shoes before entering the temple premises', 'Dress modestly - cover shoulders and knees', 'Walk clockwise around shrines (pradakshina)', 'Do not touch idols or offerings without permission', 'Photography often prohibited inside sanctum', 'Non-Hindus may be restricted from some inner areas'] },
      { type: 'Mosque', emoji: '\u{1F54C}', rules: ['Remove shoes before entering', 'Women must cover head, arms, and legs', 'Men should wear long pants', 'Do not enter during prayer times unless invited', 'Maintain silence and respect during prayers', 'Non-Muslims may not enter some mosques'] },
      { type: 'Sikh Gurdwara', emoji: '\u{1F3DB}\u{FE0F}', rules: ['Cover your head before entering (scarves available)', 'Remove shoes and wash feet at the entrance', 'Free communal meal (langar) is offered to all', 'Sit on the floor as a sign of equality', 'Do not turn your back to the Guru Granth Sahib', 'Tobacco and alcohol are strictly prohibited'] },
      { type: 'Church', emoji: '\u{26EA}', rules: ['Dress modestly - no shorts or sleeveless tops', 'Maintain silence during services', 'Photography may be restricted during mass', 'Remove hats (men) as a sign of respect', 'Visitors are generally welcome', 'Follow local congregation cues for sitting/standing'] },
    ],
  },
  JP: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'Bow instead of shaking hands. The deeper the bow, the more respect shown. A 15-degree bow is casual; 30-degree for business; 45-degree shows deep respect. Exchange business cards (meishi) with both hands and examine them carefully. Direct eye contact can be considered rude. Silence is valued in conversation.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'Tipping is NOT practiced in Japan and can be considered rude. Service is already included in the price. Exceptional service can be acknowledged with a sincere "thank you" (arigatou gozaimasu). If you must leave a tip, place money in an envelope.', severity: 'warning' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'Japanese society values neat, clean, and modest dress. Remove shoes when entering homes, some restaurants, and temples. Smart casual for most occasions. Avoid overly revealing clothing. Tattoos may restrict access to onsens (hot springs) and some gyms.' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: 'Punctuality is extremely important in Japan. Trains run to the second and apologize for even 30-second delays. Arrive 5 minutes early for meetings. Being late is considered very disrespectful. Plans and schedules are followed strictly.', severity: 'important' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Gift-giving is deeply ingrained in Japanese culture. Always wrap gifts beautifully. Avoid sets of 4 (shi = death). Present and receive gifts with both hands. Do not open gifts in front of the giver. Bring omiyage (souvenirs) from your hometown when visiting.' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'moderate', description: 'Ask permission before photographing people. Many museums and temples prohibit photography. Shutter sound on phone cameras is mandatory by law. Avoid photographing geisha without permission. Some areas near military bases restrict photography.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'moderate', description: 'PDA is uncommon in Japan. Holding hands is generally acceptable, but kissing and hugging in public is considered inappropriate. Japanese people value privacy and restraint in public spaces.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'moderate', description: 'Japan practices Shinto and Buddhism harmoniously. Most Japanese visit shrines for New Year and temples for funerals. Respect rituals at both. Do not step on thresholds at temple gates. Omamori (charms) should not be opened.' },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'strict', description: 'Bargaining is NOT practiced in Japan. Prices are fixed everywhere - shops, restaurants, and markets. Attempting to bargain is considered extremely rude and will cause embarrassment. The only exception is some electronics shops in Akihabara for bulk purchases.' },
    ],
    language: {
      volumeNorm: 'Japanese culture values quiet, restrained conversation. Speaking loudly in public, especially on trains and buses, is considered very rude. Phone calls on public transport are a major taboo. Whisper or use text messages instead.',
      gestures: [
        { gesture: 'Bowing', emoji: '\u{1F647}', meaning: 'Greeting, gratitude, or apology depending on depth', safe: true },
        { gesture: 'Crossing arms in X shape', emoji: '\u{274C}', meaning: '"No" or "not available"', safe: true },
        { gesture: 'Pointing at yourself (nose)', emoji: '\u{1F443}', meaning: 'Referring to oneself ("me?")', safe: true },
        { gesture: 'Beckoning with palm down', emoji: '\u{1F44B}', meaning: 'Come here (palm up is rude)', safe: true },
        { gesture: 'Blowing your nose in public', emoji: '\u{1F927}', meaning: 'Considered very rude; go to restroom', safe: false },
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
    religiousSites: [
      { type: 'Shinto Shrine', emoji: '\u{26E9}\u{FE0F}', rules: ['Bow before entering the torii gate', 'Walk on the sides of the path (center is for gods)', 'Purify hands and mouth at temizuya fountain', 'Throw a coin, bow twice, clap twice, bow once to pray', 'Do not touch sacred objects or shimenawa ropes', 'Photography usually allowed in outer areas'] },
      { type: 'Buddhist Temple', emoji: '\u{1F3EF}', rules: ['Remove shoes before entering temple halls', 'Bow slightly when entering and leaving', 'Light incense and place it in the burner', 'Do not point at Buddha statues', 'Photography may be restricted inside halls', 'Silence and respect are expected'] },
    ],
  },
  FR: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'La bise (cheek kissing) is standard between friends and acquaintances - typically two kisses, one on each cheek, though this varies by region (1-4 kisses). Handshakes are used in business and with strangers. Always say "Bonjour" when entering a shop. Address people formally with "Monsieur" or "Madame" until invited to use first names.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'Service charge (service compris) is included by law in restaurant bills. Small additional tips of 5-10% are appreciated for exceptional service. Round up taxi fares. Tip hotel housekeeping 1-2 EUR per day. Bartenders appreciate small change. Tipping is never obligatory.' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'The French value stylish, well-fitted clothing. Avoid sportswear and sneakers in nice restaurants. Smart casual is the norm for dining out. Parisians tend to dress in neutral, dark colors. Cover shoulders and knees in churches. Beach attire stays at the beach.' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: 'Being 10-15 minutes late to social events is normal and even expected (le quart d\'heure de politesse). However, business meetings start on time. Restaurant reservations should be honored promptly. Museums and theaters expect punctual arrival.' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Bring wine or flowers when invited to a French home (not chrysanthemums - associated with funerals). Chocolates from a good chocolatier are always welcome. Avoid giving red roses unless romantic. Gifts are usually opened when received. Present wine from your home region, not French wine (implies theirs is not good enough).' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'relaxed', description: 'Photography is generally fine in public spaces. Many museums allow photography without flash (no tripods). The Eiffel Tower at night is copyrighted - commercial use of photos is restricted. Always ask before photographing individuals. Street performers may expect payment for photos.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'relaxed', description: 'France is very accepting of PDA. Kissing and holding hands in public is completely normal. Same-sex PDA is accepted in urban areas, particularly Paris. France is known as a romantic country, and affection is openly displayed.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'relaxed', description: 'France is a secular state (laicite). Religious expression in public institutions is limited. However, respect churches, cathedrals, and other religious sites. Sunday mornings are for church-goers. Ramadan is observed by the Muslim community.' },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'strict', description: 'Bargaining is not practiced in French shops, restaurants, or markets. Prices are fixed. The only exceptions are flea markets (marches aux puces) and some antique dealers, where polite negotiation is acceptable. Never haggle in food markets.' },
    ],
    language: {
      volumeNorm: 'The French generally speak at a moderate to soft volume. Loud conversations in restaurants, museums, or public transport are considered rude. Speaking quietly is a sign of good manners. Americans are often perceived as too loud.',
      gestures: [
        { gesture: 'La bise (cheek kisses)', emoji: '\u{1F48B}', meaning: 'Standard greeting between friends/acquaintances', safe: true },
        { gesture: 'Gallic shrug (shoulders + lips)', emoji: '\u{1F937}', meaning: '"I don\'t know" or "whatever"', safe: true },
        { gesture: 'OK hand sign (thumb + index circle)', emoji: '\u{1F44C}', meaning: 'Means "zero" or "worthless" in France (not OK)', safe: false },
        { gesture: 'Finger under eye and pulling down', emoji: '\u{1F440}', meaning: '"I don\'t believe you" or "be watchful"', safe: true },
        { gesture: 'Chef\'s kiss (fingers to lips)', emoji: '\u{1F618}', meaning: 'Delicious or perfect', safe: true },
      ],
      phrases: [
        { english: 'Hello', translation: 'Bonjour', pronunciation: 'bohn-ZHOOR' },
        { english: 'Thank you', translation: 'Merci', pronunciation: 'mair-SEE' },
        { english: 'Please', translation: 'S\'il vous plait', pronunciation: 'seel voo PLEH' },
        { english: 'Excuse me', translation: 'Excusez-moi', pronunciation: 'ex-koo-ZAY mwah' },
        { english: 'Yes / No', translation: 'Oui / Non', pronunciation: 'wee / nohn' },
        { english: 'Where is...?', translation: 'Ou est...?', pronunciation: 'oo EH' },
        { english: 'How much?', translation: 'Combien?', pronunciation: 'kohm-BYAN' },
        { english: 'I don\'t understand', translation: 'Je ne comprends pas', pronunciation: 'zhuh nuh kohm-PRAHN pah' },
        { english: 'Delicious!', translation: 'Delicieux!', pronunciation: 'day-lee-SYUH' },
        { english: 'Goodbye', translation: 'Au revoir', pronunciation: 'oh ruh-VWAHR' },
      ],
    },
    religiousSites: [
      { type: 'Cathedral / Church', emoji: '\u{26EA}', rules: ['Dress modestly - cover shoulders and knees', 'Maintain silence, especially during services', 'Photography without flash is usually allowed', 'Do not walk around during active services', 'Some areas may be restricted to worshippers', 'Donations are appreciated but not required'] },
      { type: 'Mosque', emoji: '\u{1F54C}', rules: ['Remove shoes before entering', 'Women must cover head and wear modest clothing', 'Men should also dress modestly', 'Do not enter during prayer times unless invited', 'Photography is generally not allowed inside', 'The Grand Mosque of Paris offers guided tours'] },
      { type: 'Synagogue', emoji: '\u{1F54D}', rules: ['Men must wear a kippah (head covering)', 'Dress modestly and conservatively', 'Security checks are common due to safety concerns', 'Photography may be restricted', 'Visits are often by appointment or guided tour', 'Shabbat hours: sunset Friday to sunset Saturday'] },
    ],
  },
  TH: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'The "wai" is the traditional greeting: press palms together at chest level and bow slightly. The higher the hands and deeper the bow, the more respect. Do not wai to children, servers, or taxi drivers (a smile suffices). Address elders with "Khun" before their name. Thai people value a calm, smiling demeanor.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'Tipping is not mandatory but appreciated. 10% at sit-down restaurants (if no service charge). Round up taxi fares by 10-20 baht. Tip massage therapists 50-100 baht. Hotel bellboys: 20-50 baht per bag. Street food vendors do not expect tips.' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'Dress modestly when visiting temples: cover shoulders and knees. The Grand Palace in Bangkok has strict dress codes (no sandals, shorts, or sleeveless tops). Thai people dress smartly for shopping malls and restaurants. Remove shoes before entering homes and temples. Avoid clothing with Buddha images - it is illegal and deeply offensive.' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: 'Thai culture is generally relaxed about time ("Thai time"). Social events may start 15-30 minutes late. Business meetings in Bangkok run closer to schedule. The BTS/MRT are punctual. Traffic in Bangkok can cause significant delays, so plan accordingly.' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Gifts are exchanged for many occasions. Use both hands to give and receive. Avoid wrapping in black (mourning). Yellow and gold are auspicious colors. Fruit, sweets, or flowers are safe choices. Do not gift sharp objects (symbolizes cutting the relationship). Gifts are not opened in front of the giver.' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'moderate', description: 'Photography is generally fine but always ask permission for people. NEVER take disrespectful photos with Buddha statues (no climbing, sitting, or selfies). Photography prohibited in some temple interiors. The royal palace has restricted areas.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'moderate', description: 'Thai culture is modest regarding PDA. Holding hands is acceptable but kissing in public is frowned upon. The head is considered sacred - never touch someone\'s head. Feet are the lowest body part - never point your feet at people or Buddha images.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'strict', description: 'Buddhism is deeply woven into Thai life. Monks are highly revered. Women must NEVER touch monks or hand anything directly to them. Do not sit higher than a monk. The king and royal family must be spoken of with utmost respect (lese-majeste laws are strictly enforced). Buddha images are sacred, not decorative items.', },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'relaxed', description: 'Bargaining is expected at street markets, night bazaars, and with tuk-tuk drivers. Start at 40-60% of asking price. Remain polite and smiling - Thai culture values keeping your cool (jai yen). Do not bargain at 7-Eleven, malls, or food stalls with listed prices.' },
    ],
    language: {
      volumeNorm: 'Thai people speak softly and value calm, composed communication. Raising your voice or showing anger in public is extremely frowned upon - it causes a "loss of face" (sia na). Stay calm and smile, even in frustrating situations.',
      gestures: [
        { gesture: 'The wai (palms together, bow)', emoji: '\u{1F64F}', meaning: 'Hello, thank you, or respect', safe: true },
        { gesture: 'Pointing with feet', emoji: '\u{1F9B6}', meaning: 'Extremely rude - feet are the lowest body part', safe: false },
        { gesture: 'Touching someone\'s head', emoji: '\u{1F9D1}', meaning: 'Very offensive - the head is sacred', safe: false },
        { gesture: 'Beckoning with palm up', emoji: '\u{261D}\u{FE0F}', meaning: 'Rude; use palm-down waving motion instead', safe: false },
        { gesture: 'Smiling', emoji: '\u{1F60A}', meaning: 'Thailand is the "Land of Smiles" - smile often!', safe: true },
      ],
      phrases: [
        { english: 'Hello', translation: 'Sawasdee (ka/krap)', pronunciation: 'sah-wah-DEE kah/krahp' },
        { english: 'Thank you', translation: 'Khop khun (ka/krap)', pronunciation: 'kohp KOON kah/krahp' },
        { english: 'Yes / No', translation: 'Chai / Mai chai', pronunciation: 'chai / mai chai' },
        { english: 'Excuse me', translation: 'Khor thot', pronunciation: 'kor TOHT' },
        { english: 'How much?', translation: 'Tao rai?', pronunciation: 'tow RAI' },
        { english: 'Too expensive', translation: 'Paeng pai', pronunciation: 'pang BPai' },
        { english: 'Delicious!', translation: 'Aroi!', pronunciation: 'ah-ROY' },
        { english: 'Where is...?', translation: '...yoo tee nai?', pronunciation: 'yoo tee NAI' },
        { english: 'No spicy', translation: 'Mai pet', pronunciation: 'mai PET' },
        { english: 'Goodbye', translation: 'La gon', pronunciation: 'lah GOHN' },
      ],
    },
    religiousSites: [
      { type: 'Buddhist Temple (Wat)', emoji: '\u{1F3EF}', rules: ['Remove shoes before entering temple buildings', 'Dress modestly: cover shoulders and knees (wraps available)', 'Never point feet toward Buddha images or monks', 'Women must never touch monks or their belongings', 'Sit with feet tucked behind you, not crossed', 'Do not climb on Buddha statues for photos'] },
      { type: 'Royal Palace', emoji: '\u{1F3F0}', rules: ['Strict dress code: long pants, covered shoulders, closed shoes', 'No hats, sunglasses, or headphones inside', 'Follow designated paths and restricted areas', 'Show respect to all images of the royal family', 'Photography restricted in certain areas', 'Guides are recommended for the full experience'] },
    ],
  },
  AE: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'Men greet with a handshake and "As-salamu alaykum." Do not initiate handshake with women unless she extends her hand first. Place your right hand over your heart after a handshake as a sign of sincerity. It is common to exchange pleasantries about health and family before business. Use titles (Sheikh, Dr., etc.) when addressing people.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'Tipping is common and expected. 10-15% at restaurants (even if service charge is included, extra is appreciated). Tip taxi drivers by rounding up. Hotel staff: 5-10 AED. Valet parking: 5-10 AED. Delivery drivers: 5-10 AED. Generosity in tipping reflects well on you.' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'Modest dress is required by law in public areas. Cover shoulders and knees in malls and public spaces. Swimwear only at pools and beaches. Women do not need to wear abaya but should dress conservatively. During Ramadan, dress even more conservatively. Luxury venues may have specific dress codes.', severity: 'important' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: 'Business meetings may start 10-15 minutes late; patience is key. Social gatherings are flexible with timing. However, government offices and airlines operate on strict schedules. "Inshallah" (God willing) attached to a time commitment means flexibility is expected.' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Give and receive gifts with the right hand or both hands. Avoid alcohol and pork products as gifts. Perfumes, dates, and luxury items are appreciated. Avoid overly personal gifts. Gold is highly valued. Do not admire possessions too enthusiastically (host may feel obligated to give it to you).' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'strict', description: 'Never photograph Emirati women without explicit permission. Government buildings, military areas, and palaces are off-limits. Avoid photographing people in traditional dress without asking. Photography in malls requires permission from management.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'strict', description: 'PDA is illegal in the UAE and can result in fines or arrest. Even married couples should refrain from kissing in public. Holding hands is tolerated for married couples but should be discreet. Same-sex PDA is strictly illegal.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'strict', description: 'Islam governs daily life. During Ramadan, eating, drinking, and smoking in public during daylight hours is illegal (even for non-Muslims). Friday is the holy day. The call to prayer happens 5 times daily. Show respect during prayer times. Alcohol is only available in licensed venues.' },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'moderate', description: 'Bargaining is expected and enjoyed at traditional souks (markets). Gold Souk, Spice Souk, and textile markets welcome negotiation. Start at 50-60% of the asking price. Modern malls and chain stores have fixed prices. Bargaining is a social ritual - enjoy the tea offered during negotiations.' },
    ],
    language: {
      volumeNorm: 'Arabic conversation can be animated and may seem loud to Western ears, but this is normal expressiveness. In formal settings and mosques, keep your voice low. During Ramadan, maintain a quieter demeanor in public.',
      gestures: [
        { gesture: 'Right hand over heart', emoji: '\u{2764}\u{FE0F}', meaning: 'Sincerity and respect after handshake', safe: true },
        { gesture: 'Showing the sole of your shoe', emoji: '\u{1F45F}', meaning: 'Extremely disrespectful - keep feet flat on floor', safe: false },
        { gesture: 'Thumbs up', emoji: '\u{1F44D}', meaning: 'Can be considered rude in traditional settings', safe: false },
        { gesture: 'Eating/giving with left hand', emoji: '\u{1F91A}', meaning: 'Left hand is considered unclean', safe: false },
        { gesture: 'Touching your nose bridge', emoji: '\u{1F443}', meaning: '"Watch out" or "be careful"', safe: true },
      ],
      phrases: [
        { english: 'Hello', translation: 'As-salamu alaykum', pronunciation: 'as-sah-LAH-moo ah-LAY-koom' },
        { english: 'Thank you', translation: 'Shukran', pronunciation: 'SHOOK-ran' },
        { english: 'Please', translation: 'Min fadlak', pronunciation: 'min FAD-lak' },
        { english: 'Yes / No', translation: 'Na\'am / La', pronunciation: 'nah-AM / lah' },
        { english: 'Excuse me', translation: 'Afwan', pronunciation: 'AF-wahn' },
        { english: 'How much?', translation: 'Kam?', pronunciation: 'kahm' },
        { english: 'God willing', translation: 'Inshallah', pronunciation: 'in-SHAH-lah' },
        { english: 'Goodbye', translation: 'Ma\'a salama', pronunciation: 'mah-ah sah-LAH-mah' },
        { english: 'No problem', translation: 'Mafi mushkila', pronunciation: 'MAH-fee moosh-KEE-lah' },
        { english: 'Welcome (response)', translation: 'Ahlan wa sahlan', pronunciation: 'AH-lan wa SAH-lan' },
      ],
    },
    religiousSites: [
      { type: 'Mosque', emoji: '\u{1F54C}', rules: ['Remove shoes before entering', 'Women must cover head, arms, and legs (abayas often provided)', 'Men should wear long pants and cover shoulders', 'Do not walk in front of someone praying', 'Maintain silence and avoid loud conversations', 'Some mosques offer visitor tours at specific times', 'Non-Muslims cannot enter during prayer times'] },
      { type: 'Church', emoji: '\u{26EA}', rules: ['Dress modestly and conservatively', 'Several churches operate in the UAE for expatriate communities', 'Visitors are welcome but should be respectful', 'Photography may be restricted during services', 'Christian worship is allowed in designated areas', 'Proselytizing is illegal in the UAE'] },
    ],
  },
  IT: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'Italians greet with two cheek kisses (starting with left cheek) among friends and family. Handshakes for formal/first meetings. "Ciao" is informal; use "Buongiorno" (good morning) or "Buonasera" (good evening) in formal settings. Italians value eye contact during conversation. Titles (Dottore, Professore) are commonly used.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'A "coperto" (cover charge of 1-3 EUR) is standard at restaurants. Additional tipping of 5-10% for good service is appreciated but not mandatory. Round up taxi fares. Tip hotel bellhops 1-2 EUR per bag. Baristas at standing coffee bars do not expect tips. Leave small change at sit-down cafes.' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'Italians take fashion seriously. La bella figura (making a good impression) is a cultural concept. Avoid athletic wear in cities. Smart casual for restaurants and shopping. Cover shoulders and knees for churches (Vatican enforces strictly). No flip-flops or beachwear in town centers.' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: 'Social punctuality is flexible - arriving 15-20 minutes late to dinner parties is normal. Business meetings should start on time. Restaurant reservations should be honored. Trains in northern Italy are generally punctual; southern schedules are more relaxed.' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Bring wine, chocolates, or pastries when invited to dinner. Avoid chrysanthemums (funerals) and even numbers of flowers. Quality matters more than quantity. A bottle of wine from your region is always welcome. Gifts are usually opened when received. Wrap gifts attractively.' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'relaxed', description: 'Photography is welcome at most tourist sites. Flash photography is often restricted in museums and churches. Tripods may require special permission. Vatican museums have specific rules. Always ask before photographing locals, especially children.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'relaxed', description: 'Italy is very romantic and PDA is completely normal. Kissing, hugging, and holding hands in public is common. Italian culture celebrates love and affection openly. Same-sex PDA is increasingly accepted, especially in northern cities.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'moderate', description: 'Italy is predominantly Catholic, and religious traditions are deeply cultural. Respect churches as active places of worship, not just tourist sites. Sunday mornings and religious holidays may affect business hours. August 15 (Ferragosto) is a major holiday when many shops close.' },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'strict', description: 'Bargaining is not common in Italy. Prices are fixed in shops, restaurants, and most markets. Some flexibility at open-air antique markets or flea markets. Never bargain in food markets or shops. Trying to haggle in stores is considered offensive.' },
    ],
    language: {
      volumeNorm: 'Italians are animated and expressive speakers. Louder conversation is normal and not considered rude. Hand gestures are an integral part of communication. However, keep your voice moderate in churches, museums, and on public transport.',
      gestures: [
        { gesture: 'Fingertips pinched together, hand up', emoji: '\u{1F90C}', meaning: '"What do you want?" or "What are you saying?"', safe: true },
        { gesture: 'Hand on stomach', emoji: '\u{1F60B}', meaning: '"The food is delicious"', safe: true },
        { gesture: 'Chin flick (back of fingers under chin)', emoji: '\u{1F612}', meaning: '"I don\'t care" or dismissal', safe: true },
        { gesture: 'Forearm jerk (hand in elbow crook)', emoji: '\u{1F4AA}', meaning: 'Very rude insult - never use', safe: false },
        { gesture: 'Two-finger horn sign', emoji: '\u{1F918}', meaning: 'Can imply a spouse is unfaithful - use carefully', safe: false },
      ],
      phrases: [
        { english: 'Hello', translation: 'Buongiorno / Ciao', pronunciation: 'bwohn-JOHR-noh / CHOW' },
        { english: 'Thank you', translation: 'Grazie', pronunciation: 'GRAH-tsee-eh' },
        { english: 'Please', translation: 'Per favore', pronunciation: 'pair fah-VOH-reh' },
        { english: 'Excuse me', translation: 'Scusi', pronunciation: 'SKOO-zee' },
        { english: 'Yes / No', translation: 'Si / No', pronunciation: 'see / noh' },
        { english: 'Where is...?', translation: 'Dov\'e...?', pronunciation: 'doh-VEH' },
        { english: 'How much?', translation: 'Quanto costa?', pronunciation: 'KWAHN-toh KOS-tah' },
        { english: 'Delicious!', translation: 'Buonissimo!', pronunciation: 'bwoh-NEE-see-moh' },
        { english: 'I don\'t understand', translation: 'Non capisco', pronunciation: 'nohn kah-PEES-koh' },
        { english: 'Goodbye', translation: 'Arrivederci', pronunciation: 'ah-ree-veh-DAIR-chee' },
      ],
    },
    religiousSites: [
      { type: 'Church / Basilica', emoji: '\u{26EA}', rules: ['Cover shoulders and knees (strictly enforced at the Vatican)', 'No hats for men inside churches', 'Maintain silence, especially during mass', 'Photography without flash is usually allowed', 'Do not eat or drink inside churches', 'Some churches charge admission to specific areas'] },
      { type: 'Synagogue', emoji: '\u{1F54D}', rules: ['Men must wear a kippah (head covering)', 'Security checks are standard', 'Photography may be restricted', 'Visits often by guided tour or appointment', 'Dress modestly and conservatively', 'Great Synagogue of Rome offers regular tours'] },
    ],
  },
  TR: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'Handshakes are common for both men and women. Close friends may exchange cheek kisses (one on each side). Elders are often greeted by kissing their hand and placing it on your forehead. Use "Merhaba" (hello) and "Hosgeldiniz" (welcome). Tea or Turkish coffee is often offered during greetings - always accept.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'Tipping is customary: 10-15% at restaurants. Round up taxi fares. Tip hotel staff 5-10 TRY. Turkish bath (hamam) attendants: 15-20% of service cost. Tour guides: 50-100 TRY per day. Tea served at shops is free (part of hospitality), no tip needed.' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'Dress modestly when visiting mosques: women must cover head, shoulders, and knees. Men should wear long pants. Headscarves are provided at major mosques. Istanbul is cosmopolitan and Western dress is common. Rural and eastern Turkey are more conservative. Swimwear only at beaches and pools.' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: 'Turkish culture has a relaxed attitude to time. Social events may start 30 minutes late. Business in Istanbul tends to be more punctual. "Simdi" (now) can mean anytime in the near future. However, flights and intercity buses run on schedule.' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Turkish delight, baklava, or quality tea sets make good gifts. Avoid alcohol unless you know the person drinks. Flowers (avoid red roses and white lilies) and chocolates are safe. Gifts are opened immediately. Nazar (evil eye charm) is a popular and meaningful gift. Always bring something when visiting a Turkish home.' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'moderate', description: 'Photography is fine at most tourist sites. Ask permission before photographing people, especially women in conservative areas. Military zones, government buildings, and some archaeological sites restrict photography. Interior photos in some mosques require permission.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'moderate', description: 'Holding hands is acceptable. Kissing in public is tolerated in Istanbul and tourist areas but frowned upon in conservative regions. Same-sex PDA should be avoided as acceptance varies widely. Eastern Turkey is significantly more conservative than western cities.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'moderate', description: 'Turkey is a secular state with a Muslim majority. The call to prayer echoes 5 times daily from mosques. During Ramadan, be discreet about eating/drinking in public during fasting hours. Respect prayer times. Alcohol is available but consumption in public during Ramadan is frowned upon.' },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'relaxed', description: 'Bargaining is a beloved cultural tradition at the Grand Bazaar, Spice Market, and local shops. Start at 40-50% of the asking price. Accept offered tea during negotiations. Walking away is a valid negotiation tactic. Fixed prices only at supermarkets and chain stores.' },
    ],
    language: {
      volumeNorm: 'Turkish people are warm and expressive. Conversation volume is moderate to lively. In mosques and during prayer times, silence is expected. Turks appreciate when visitors attempt even basic Turkish phrases.',
      gestures: [
        { gesture: 'Hand on chest', emoji: '\u{2764}\u{FE0F}', meaning: 'Thank you, sincerity, or respect', safe: true },
        { gesture: 'Tsk sound with head tilt back', emoji: '\u{1F646}', meaning: '"No" - often confusing for visitors', safe: true },
        { gesture: 'Pointing sole of shoe at someone', emoji: '\u{1F45F}', meaning: 'Very disrespectful', safe: false },
        { gesture: 'OK sign (thumb + index)', emoji: '\u{1F44C}', meaning: 'Can be vulgar in Turkey - avoid', safe: false },
        { gesture: 'Nazar (evil eye) charm', emoji: '\u{1F9FF}', meaning: 'Protection from evil eye - common everywhere', safe: true },
      ],
      phrases: [
        { english: 'Hello', translation: 'Merhaba', pronunciation: 'mehr-HAH-bah' },
        { english: 'Thank you', translation: 'Tesekkur ederim', pronunciation: 'teh-shek-KOOR eh-deh-REEM' },
        { english: 'Please', translation: 'Lutfen', pronunciation: 'LOOT-fen' },
        { english: 'Yes / No', translation: 'Evet / Hayir', pronunciation: 'eh-VET / hah-YUHR' },
        { english: 'Excuse me', translation: 'Afedersiniz', pronunciation: 'ah-feh-dehr-see-NEEZ' },
        { english: 'How much?', translation: 'Ne kadar?', pronunciation: 'neh kah-DAHR' },
        { english: 'Where is...?', translation: '...nerede?', pronunciation: 'neh-reh-DEH' },
        { english: 'Delicious!', translation: 'Nefis!', pronunciation: 'neh-FEES' },
        { english: 'Cheers!', translation: 'Serefe!', pronunciation: 'sheh-reh-FEH' },
        { english: 'Goodbye', translation: 'Hosca kal', pronunciation: 'hosh-CHA kahl' },
      ],
    },
    religiousSites: [
      { type: 'Mosque (Cami)', emoji: '\u{1F54C}', rules: ['Remove shoes before entering (bags provided)', 'Women must cover head, shoulders, and knees', 'Men should wear long pants', 'Do not walk in front of someone praying', 'Silence during prayer times', 'Photography generally allowed outside prayer times', 'Scarves and coverings available at major mosques'] },
      { type: 'Church', emoji: '\u{26EA}', rules: ['Dress modestly', 'Some historic churches are now museums (like Hagia Sophia)', 'Photography rules vary by location', 'Maintain respectful behavior', 'Some charge admission fees', 'Active churches welcome visitors outside service times'] },
    ],
  },
  MX: {
    sections: [
      { key: 'greetings', emoji: '\u{1F44B}', title: 'Greeting Customs', content: 'Mexicans greet with a handshake or a single cheek kiss (right cheek) among friends. "Hola" is casual; "Buenos dias/tardes/noches" is more polite. Embraces (abrazos) are common between male friends. Use "Senor/Senora" for formality. Mexicans value personal space less - standing close is normal.' },
      { key: 'tipping', emoji: '\u{1F4B0}', title: 'Tipping Culture', content: 'Tipping is essential and expected: 15-20% at restaurants. Gas station attendants: 10-20 MXN. Grocery baggers (often elderly) rely on tips. Valet parking: 20-50 MXN. Hotel housekeeping: 50 MXN/day. Taxi drivers: round up. Tour guides: 100-200 MXN/day.', severity: 'important' },
      { key: 'dress-code', emoji: '\u{1F454}', title: 'Dress Code', content: 'Casual dress is acceptable in most settings. Cover shoulders when visiting churches. Beach attire stays at the beach. Business dress is formal in Mexico City. Indigenous communities may have specific expectations. Avoid wearing the Mexican flag on clothing (can be offensive).' },
      { key: 'punctuality', emoji: '\u{23F0}', title: 'Punctuality Norms', content: '"Mexican time" means events typically start 30 minutes to an hour late for social gatherings. Business meetings in Mexico City and with international companies run on time. Parties start well after the stated time. Only formal events and flights require punctuality.' },
      { key: 'gift-giving', emoji: '\u{1F381}', title: 'Gift Giving', content: 'Bring flowers (not marigolds - associated with Day of the Dead funerals) or quality tequila/mezcal when invited to a home. Chocolates and pastries are safe choices. Gifts are opened immediately. Avoid silver gifts from outside Mexico (Mexico is proud of its silver). Quality over quantity.' },
    ],
    behavior: [
      { key: 'photography', emoji: '\u{1F4F8}', title: 'Photography', level: 'relaxed', description: 'Photography is welcome at most sites. Some archaeological sites charge camera fees. Indigenous communities may not want to be photographed - always ask. Military and government buildings restrict photography. Churches generally allow photos outside of services.' },
      { key: 'pda', emoji: '\u{1F491}', title: 'Public Displays of Affection', level: 'relaxed', description: 'Mexico is a warm, affectionate culture. PDA is common and accepted - kissing, hugging, and holding hands in public is normal. Same-sex PDA is accepted in Mexico City and resort areas but may draw attention in rural/conservative regions.' },
      { key: 'religion', emoji: '\u{1F64F}', title: 'Religious Observance', level: 'moderate', description: 'Mexico is predominantly Catholic. The Virgin of Guadalupe is deeply revered. Day of the Dead (November 1-2) is a major cultural event, not a somber occasion. Churches are active places of worship. Semana Santa (Holy Week) affects business hours nationwide.' },
      { key: 'bargaining', emoji: '\u{1F6CD}\u{FE0F}', title: 'Bargaining Culture', level: 'relaxed', description: 'Bargaining is expected at markets, artisan shops, and with street vendors. Start at 60-70% of asking price. Be friendly and respectful. Fixed prices at supermarkets, malls, and chain restaurants. Tipping artisans who demonstrate their craft is appreciated.' },
    ],
    language: {
      volumeNorm: 'Mexicans are warm and expressive communicators. Animated conversation at a lively volume is completely normal. Music is a big part of culture - expect live music at restaurants. Silence can be uncomfortable. Engage in small talk readily.',
      gestures: [
        { gesture: 'Abrazo (hug and back pat)', emoji: '\u{1F917}', meaning: 'Warm greeting between friends', safe: true },
        { gesture: 'Finger wag (index finger side to side)', emoji: '\u{261D}\u{FE0F}', meaning: '"No" - commonly used', safe: true },
        { gesture: 'Hand out, palm down, fingers fluttering', emoji: '\u{1F44B}', meaning: '"Come here" gesture (palm up is rude)', safe: true },
        { gesture: 'Placing hand on elbow of other arm', emoji: '\u{1F4AA}', meaning: 'Calling someone stingy or cheap', safe: false },
        { gesture: 'Thumbs up', emoji: '\u{1F44D}', meaning: 'Positive, OK, good', safe: true },
      ],
      phrases: [
        { english: 'Hello', translation: 'Hola / Buenos dias', pronunciation: 'OH-lah / BWEH-nohs DEE-ahs' },
        { english: 'Thank you', translation: 'Gracias', pronunciation: 'GRAH-see-ahs' },
        { english: 'Please', translation: 'Por favor', pronunciation: 'pohr fah-VOHR' },
        { english: 'Excuse me', translation: 'Disculpe', pronunciation: 'dees-KOOL-peh' },
        { english: 'Yes / No', translation: 'Si / No', pronunciation: 'see / noh' },
        { english: 'How much?', translation: 'Cuanto cuesta?', pronunciation: 'KWAHN-toh KWES-tah' },
        { english: 'Where is...?', translation: 'Donde esta...?', pronunciation: 'DOHN-deh es-TAH' },
        { english: 'Delicious!', translation: 'Delicioso!', pronunciation: 'deh-lee-see-OH-soh' },
        { english: 'Cheers!', translation: 'Salud!', pronunciation: 'sah-LOOD' },
        { english: 'Goodbye', translation: 'Adios / Hasta luego', pronunciation: 'ah-dee-OHS / AHS-tah LWEH-goh' },
      ],
    },
    religiousSites: [
      { type: 'Catholic Church / Cathedral', emoji: '\u{26EA}', rules: ['Cover shoulders and knees', 'Remove hats upon entering', 'Maintain silence during services', 'Photography without flash is usually allowed', 'Light a candle as a respectful gesture', 'Active worship spaces - be respectful of parishioners'] },
      { type: 'Archaeological / Sacred Sites', emoji: '\u{1F3DB}\u{FE0F}', rules: ['Stay on designated paths', 'Do not climb restricted pyramids', 'Camera fees may apply', 'Some sites have spiritual significance to indigenous communities', 'Do not remove any stones or artifacts', 'Hire a licensed guide for the best experience'] },
    ],
  },
};

/* ──────────────── Loading Skeleton ──────────────── */

function CulturalSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-11 w-80" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ──────────────── Main Page ──────────────── */

export default function CulturalPage() {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [isLoading, setIsLoading] = useState(false);
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  const country = countries.find((c) => c.code === selectedCountry);
  const culture = cultureDatabase[selectedCountry];

  const handleCountryChange = useCallback((code: string) => {
    setIsLoading(true);
    setSelectedCountry(code);
    // Simulate loading from API
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const handlePlayPhrase = useCallback((phrase: string) => {
    setPlayingPhrase(phrase);
    // Simulate audio playback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.8;
      utterance.onend = () => setPlayingPhrase(null);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingPhrase(null), 1500);
    }
  }, []);

  if (isLoading) {
    return <CulturalSkeleton />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-[#1A3C5E]">Cultural Guide</h1>
        <p className="text-gray-500 mt-1">Navigate local customs, etiquette, and traditions with confidence</p>
      </motion.div>

      {/* Country Selector */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Select Destination</label>
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="Choose a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {culture ? (
        <>
          {/* Culture Cards - Main customs */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#E8733A]" />
                  {country?.flag} {country?.name} - Customs & Etiquette
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible defaultValue={culture.sections[0]?.key} className="w-full">
                  {culture.sections.map((section) => {
                    const Icon = sectionIcons[section.key] || BookOpen;
                    return (
                      <AccordionItem key={section.key} value={section.key}>
                        <AccordionTrigger>
                          <span className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#E8733A]/10">
                              <Icon className="h-4 w-4 text-[#E8733A]" />
                            </span>
                            <span className="text-[#1A3C5E] font-semibold">{section.title}</span>
                            {section.severity === 'warning' && (
                              <Badge className="bg-amber-100 text-amber-700 text-[10px] ml-1">Note</Badge>
                            )}
                            {section.severity === 'important' && (
                              <Badge className="bg-red-100 text-red-700 text-[10px] ml-1">Important</Badge>
                            )}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11">
                            <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* Behavior & Public Conduct */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#1A3C5E]" />
                  Behavior & Public Conduct
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {culture.behavior.map((rule, i) => {
                    const style = levelStyles[rule.level];
                    const behaviorIcons: Record<string, React.ElementType> = {
                      photography: Camera,
                      pda: Heart,
                      religion: Church,
                      bargaining: ShoppingBag,
                    };
                    const BIcon = behaviorIcons[rule.key] || Info;
                    return (
                      <motion.div
                        key={rule.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className={cn('p-4 rounded-xl border-2 h-full', style.bg)}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center">
                                <BIcon className={cn('w-4.5 h-4.5', style.text)} />
                              </div>
                              <h4 className="font-bold text-sm text-[#1A3C5E]">{rule.title}</h4>
                            </div>
                            <Badge className={cn('text-[10px]', style.badge)}>
                              {style.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{rule.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Language & Communication + Religious Sites in Tabs */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <Tabs defaultValue="language" className="w-full">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="language" className="gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  Language & Communication
                </TabsTrigger>
                <TabsTrigger value="religious" className="gap-1.5">
                  <Church className="w-4 h-4" />
                  Religious Sites
                </TabsTrigger>
              </TabsList>

              {/* Language & Communication Tab */}
              <TabsContent value="language">
                <div className="space-y-6 mt-4">
                  {/* Volume Norms */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-[#E8733A]" />
                        Volume & Communication Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Volume2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{culture.language.volumeNorm}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gestures */}
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <HandMetal className="w-4 h-4 text-[#1A3C5E]" />
                          Gesture Guide
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {culture.language.gestures.map((g, i) => (
                            <motion.div
                              key={g.gesture}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className={cn(
                                'flex items-start gap-3 p-3 rounded-xl border transition-colors',
                                g.safe
                                  ? 'bg-green-50/50 border-green-100 hover:bg-green-50'
                                  : 'bg-red-50/50 border-red-100 hover:bg-red-50'
                              )}
                            >
                              <span className="text-xl mt-0.5">{g.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-semibold text-[#1A3C5E]">{g.gesture}</p>
                                  {g.safe ? (
                                    <Badge className="bg-green-100 text-green-700 text-[10px] gap-0.5">
                                      <CheckCircle className="w-2.5 h-2.5" />
                                      Safe
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-red-100 text-red-700 text-[10px] gap-0.5">
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      Avoid
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{g.meaning}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Polite Phrases */}
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#E8733A]" />
                          Essential Phrases
                          <Badge variant="outline" className="text-[10px] ml-1">Tap to hear</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1.5">
                          {culture.language.phrases.map((phrase, i) => (
                            <motion.div
                              key={phrase.english}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                              onClick={() => handlePlayPhrase(phrase.translation)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1A3C5E]">{phrase.english}</p>
                                <p className="text-sm text-[#E8733A] font-medium">{phrase.translation}</p>
                                <p className="text-[11px] text-gray-400 italic mt-0.5">{phrase.pronunciation}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  'shrink-0 h-8 w-8 transition-all',
                                  playingPhrase === phrase.translation
                                    ? 'opacity-100 text-[#E8733A]'
                                    : 'opacity-0 group-hover:opacity-100 text-gray-400'
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayPhrase(phrase.translation);
                                }}
                              >
                                <Volume2 className={cn(
                                  'w-4 h-4',
                                  playingPhrase === phrase.translation && 'animate-pulse'
                                )} />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Religious Sites Tab */}
              <TabsContent value="religious">
                <div className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Church className="w-4 h-4 text-[#1A3C5E]" />
                        Religious Site Etiquette - {country?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {culture.religiousSites.map((site, i) => (
                          <motion.div
                            key={site.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-[#1A3C5E]/10 flex items-center justify-center">
                                <span className="text-xl">{site.emoji}</span>
                              </div>
                              <h4 className="font-bold text-[#1A3C5E]">{site.type}</h4>
                            </div>
                            <div className="space-y-2.5">
                              {site.rules.map((rule, j) => (
                                <motion.div
                                  key={j}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 + j * 0.04 }}
                                  className="flex items-start gap-2.5"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8733A] mt-1.5 shrink-0" />
                                  <p className="text-sm text-gray-600 leading-relaxed">{rule}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Quick Reference Footer */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-[#1A3C5E] to-[#1A3C5E]/90 border-0">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base mb-1">Cultural Tip</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      When in doubt, observe locals and follow their lead. A genuine smile and polite demeanor
                      go a long way in any culture. Showing effort to respect local customs, even imperfectly,
                      is always appreciated by locals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      ) : (
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-12 text-center">
              <Globe className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1A3C5E] mb-1">Cultural Guide Not Available</h3>
              <p className="text-gray-500 text-sm">
                We are working on adding cultural guides for more countries. Check back soon!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
