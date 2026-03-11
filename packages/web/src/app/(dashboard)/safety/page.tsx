'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, Heart, Car, Users,
  Scale, Moon, Eye, Fingerprint, Globe2, ArrowRight, Plus, X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SafetyData {
  overall: number;
  categories: { name: string; score: number; icon: React.ElementType }[];
  soloFemale: { score: number; tips: string[]; safeAreas: string[]; avoidAreas: string[] };
  lgbtq: { score: number; legal: string; safety: string; culture: string };
  scams: { name: string; description: string; avoid: string }[];
}

const safetyDatabase: Record<string, SafetyData> = {
  India: {
    overall: 55,
    categories: [
      { name: 'Crime', score: 50, icon: Fingerprint },
      { name: 'Terrorism', score: 55, icon: ShieldAlert },
      { name: 'Natural Disasters', score: 45, icon: AlertTriangle },
      { name: 'Healthcare', score: 50, icon: Heart },
      { name: 'Road Safety', score: 35, icon: Car },
      { name: 'Political Stability', score: 60, icon: Scale },
      { name: 'Women Safety', score: 40, icon: Users },
      { name: 'LGBTQ+ Safety', score: 45, icon: Users },
      { name: 'Night Safety', score: 42, icon: Moon },
      { name: 'Scam Risk', score: 38, icon: Eye },
    ],
    soloFemale: {
      score: 40,
      tips: ['Avoid traveling alone at night', 'Use verified taxi apps (Ola/Uber)', 'Dress conservatively in rural areas', 'Share live location with trusted contacts'],
      safeAreas: ['South Mumbai', 'Bangalore (Indiranagar)', 'Goa (North beaches)', 'Jaipur (tourist areas)'],
      avoidAreas: ['Isolated areas after dark', 'Overcrowded local trains at night', 'Unlicensed accommodations', 'Remote rural areas alone'],
    },
    lgbtq: { score: 45, legal: 'Decriminalized (Section 377 struck down 2018)', safety: 'Generally safe in metro cities, caution in rural areas', culture: 'Increasing acceptance in urban areas. PDA not advisable.' },
    scams: [
      { name: 'Taxi Meter Scam', description: 'Drivers claim meter is broken and charge inflated rates.', avoid: 'Use app-based taxis or agree on fare beforehand.' },
      { name: 'Gem Scam', description: 'Shops offer to sell gems at "wholesale" prices for resale abroad.', avoid: 'Never buy gems from strangers or for "investment".' },
      { name: 'Fake Tour Guide', description: 'Unofficial guides at tourist sites charge high fees for poor service.', avoid: 'Only use government-licensed guides. Check ID.' },
      { name: 'Temple Blessing Scam', description: 'Self-appointed priests at temples demand large donations for blessings.', avoid: 'Politely decline. Official temple donations have counters.' },
    ],
  },
  Japan: {
    overall: 85,
    categories: [
      { name: 'Crime', score: 92, icon: Fingerprint },
      { name: 'Terrorism', score: 90, icon: ShieldAlert },
      { name: 'Natural Disasters', score: 55, icon: AlertTriangle },
      { name: 'Healthcare', score: 90, icon: Heart },
      { name: 'Road Safety', score: 88, icon: Car },
      { name: 'Political Stability', score: 92, icon: Scale },
      { name: 'Women Safety', score: 75, icon: Users },
      { name: 'LGBTQ+ Safety', score: 70, icon: Users },
      { name: 'Night Safety', score: 90, icon: Moon },
      { name: 'Scam Risk', score: 88, icon: Eye },
    ],
    soloFemale: {
      score: 75,
      tips: ['Women-only train cars available during rush hours', 'Japan is generally very safe for solo female travelers', 'Be aware of crowded trains during peak hours', 'Emergency police boxes (koban) are everywhere'],
      safeAreas: ['Tokyo (all areas)', 'Kyoto', 'Osaka', 'Okinawa'],
      avoidAreas: ['Kabukicho late at night (touts)', 'Overcrowded trains during rush hour'],
    },
    lgbtq: { score: 70, legal: 'Legal. No same-sex marriage nationally.', safety: 'Generally safe. Acceptance varies.', culture: 'Private culture. PDA uncommon for all couples. Shinjuku Ni-chome is LGBTQ+ district.' },
    scams: [
      { name: 'Bar Scam', description: 'Friendly locals invite you to a bar where drinks are extremely overpriced.', avoid: 'Be cautious of random invitations. Check prices before ordering.' },
      { name: 'Temple Fortune Scam', description: 'Overpriced fortune readings or charms at tourist temples.', avoid: 'Official omikuji (fortunes) at temples cost 100-200 yen max.' },
    ],
  },
  Thailand: {
    overall: 65,
    categories: [
      { name: 'Crime', score: 60, icon: Fingerprint },
      { name: 'Terrorism', score: 70, icon: ShieldAlert },
      { name: 'Natural Disasters', score: 55, icon: AlertTriangle },
      { name: 'Healthcare', score: 72, icon: Heart },
      { name: 'Road Safety', score: 40, icon: Car },
      { name: 'Political Stability', score: 55, icon: Scale },
      { name: 'Women Safety', score: 60, icon: Users },
      { name: 'LGBTQ+ Safety', score: 78, icon: Users },
      { name: 'Night Safety', score: 55, icon: Moon },
      { name: 'Scam Risk', score: 45, icon: Eye },
    ],
    soloFemale: {
      score: 60,
      tips: ['Thailand is popular with solo female travelers', 'Stick to well-lit areas at night', 'Be cautious with drinks at bars', 'Use registered taxis and Grab app'],
      safeAreas: ['Bangkok (Sukhumvit)', 'Chiang Mai Old City', 'Koh Samui', 'Phuket Town'],
      avoidAreas: ['Patpong after midnight', 'Isolated beaches at night', 'Walking Nana area alone'],
    },
    lgbtq: { score: 78, legal: 'Legal. Same-sex partnership bill passed.', safety: 'Very accepting culture. Bangkok has vibrant LGBTQ+ scene.', culture: 'One of the most LGBTQ+ friendly countries in Asia.' },
    scams: [
      { name: 'Tuk-Tuk Scam', description: 'Drivers offer cheap rides but take you to gem/suit shops for commission.', avoid: 'Decline shopping detours. Use Grab instead.' },
      { name: 'Jet Ski Damage Scam', description: 'Rental operators claim pre-existing damage was caused by you.', avoid: 'Photograph equipment before use. Use reputable operators.' },
      { name: 'Grand Palace Closed Scam', description: 'Touts say the palace is closed today and offer alternative tours.', avoid: 'The palace is rarely closed. Verify at the entrance directly.' },
    ],
  },
  France: {
    overall: 72,
    categories: [
      { name: 'Crime', score: 68, icon: Fingerprint },
      { name: 'Terrorism', score: 60, icon: ShieldAlert },
      { name: 'Natural Disasters', score: 85, icon: AlertTriangle },
      { name: 'Healthcare', score: 92, icon: Heart },
      { name: 'Road Safety', score: 78, icon: Car },
      { name: 'Political Stability', score: 72, icon: Scale },
      { name: 'Women Safety', score: 65, icon: Users },
      { name: 'LGBTQ+ Safety', score: 80, icon: Users },
      { name: 'Night Safety', score: 62, icon: Moon },
      { name: 'Scam Risk', score: 55, icon: Eye },
    ],
    soloFemale: {
      score: 65,
      tips: ['Use well-lit metro stations at night', 'Be aware of pickpockets in tourist areas', 'Paris is generally safe, exercise normal caution', 'Keep valuables secure on public transport'],
      safeAreas: ['Marais (Paris)', 'Saint-Germain', 'Nice Old Town', 'Lyon Centre'],
      avoidAreas: ['Gare du Nord at night', 'Bois de Boulogne after dark', 'Northern suburbs alone'],
    },
    lgbtq: { score: 80, legal: 'Same-sex marriage legal since 2013.', safety: 'Generally very accepting, especially in cities.', culture: 'Le Marais in Paris is the historic LGBTQ+ district.' },
    scams: [
      { name: 'Petition Scam', description: 'Groups ask you to sign a petition while pickpocketing you.', avoid: 'Politely decline and keep walking.' },
      { name: 'Ring Scam', description: 'Someone "finds" a gold ring and offers to sell it to you.', avoid: 'Ignore and walk away. The ring is worthless.' },
      { name: 'Bracelet Scam', description: 'Someone ties a bracelet on your wrist and demands payment.', avoid: 'Keep hands in pockets near Sacre-Coeur. Firmly say no.' },
    ],
  },
  Brazil: {
    overall: 42,
    categories: [
      { name: 'Crime', score: 30, icon: Fingerprint },
      { name: 'Terrorism', score: 82, icon: ShieldAlert },
      { name: 'Natural Disasters', score: 65, icon: AlertTriangle },
      { name: 'Healthcare', score: 55, icon: Heart },
      { name: 'Road Safety', score: 40, icon: Car },
      { name: 'Political Stability', score: 45, icon: Scale },
      { name: 'Women Safety', score: 35, icon: Users },
      { name: 'LGBTQ+ Safety', score: 42, icon: Users },
      { name: 'Night Safety', score: 28, icon: Moon },
      { name: 'Scam Risk', score: 35, icon: Eye },
    ],
    soloFemale: {
      score: 35,
      tips: ['Avoid displaying jewelry or electronics', 'Use registered taxis or Uber/99', 'Stay in well-populated areas', 'Learn basic Portuguese phrases for emergencies'],
      safeAreas: ['Ipanema (Rio)', 'Jardins (Sao Paulo)', 'Barra da Tijuca', 'Florianopolis South'],
      avoidAreas: ['Favelas without a guide', 'Copacabana beach at night', 'Downtown areas after dark', 'ATMs on streets'],
    },
    lgbtq: { score: 42, legal: 'Same-sex marriage legal since 2013.', safety: 'Mixed. Progressive laws but violence exists.', culture: 'Sao Paulo Pride is one of the world\'s largest. Cities generally more accepting.' },
    scams: [
      { name: 'Express Kidnapping', description: 'Forced ATM withdrawals by armed criminals.', avoid: 'Use ATMs inside banks during business hours only.' },
      { name: 'Fake Police', description: 'Criminals posing as police demanding to check your wallet.', avoid: 'Ask for badge ID. Real police rarely check wallets on street.' },
      { name: 'Beach Theft', description: 'Belongings stolen while swimming.', avoid: 'Never leave valuables unattended. Use waterproof pouches.' },
    ],
  },
};

const countryList = Object.keys(safetyDatabase);

const scoreColor = (score: number) => {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
};

const scoreBg = (score: number) => {
  if (score >= 70) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

const gaugeColor = (score: number) => {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#eab308';
  if (score >= 30) return '#f97316';
  return '#ef4444';
};

export default function SafetyPage() {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [compareCountries, setCompareCountries] = useState<string[]>(['India', 'Japan']);

  const data = safetyDatabase[selectedCountry];
  const overallScore = data.overall;
  const circumference = 2 * Math.PI * 70;
  const strokeDash = (overallScore / 100) * circumference;

  const addCompare = (country: string) => {
    if (compareCountries.length < 3 && !compareCountries.includes(country)) {
      setCompareCountries([...compareCountries, country]);
    }
  };

  const removeCompare = (country: string) => {
    setCompareCountries(compareCountries.filter((c) => c !== country));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-[#E8733A]" />
          Safety Scores
        </h1>
        <p className="text-gray-500 text-sm mt-1">Comprehensive safety information for travelers</p>
      </motion.div>

      {/* Country Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full sm:w-72 h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
        >
          {countryList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </motion.div>

      {/* Overall Safety Gauge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6 sm:p-8 flex flex-col items-center">
            <h2 className="text-lg font-bold text-[#1A3C5E] mb-4">Overall Safety Score</h2>
            <div className="relative w-44 h-44 sm:w-52 sm:h-52">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <motion.circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke={gaugeColor(overallScore)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - strokeDash }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-4xl sm:text-5xl font-bold', scoreColor(overallScore))}>
                  {overallScore}
                </span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>
            <p className={cn('text-sm font-medium mt-3', scoreColor(overallScore))}>
              {overallScore >= 70 ? 'Generally Safe' : overallScore >= 50 ? 'Moderate Risk' : overallScore >= 30 ? 'Elevated Risk' : 'High Risk'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">Category Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {data.categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.03 }}
              >
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xl font-bold', scoreColor(cat.score))}>{cat.score}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.score}%` }}
                          transition={{ duration: 0.6, delay: 0.15 + i * 0.03 }}
                          className={cn('h-full rounded-full', scoreBg(cat.score))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Solo Female Safety */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-pink-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-pink-700">
                <Users className="w-5 h-5" />
                Solo Female Safety
              </CardTitle>
              <Badge className={cn('w-fit', data.soloFemale.score >= 60 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                Score: {data.soloFemale.score}/100
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Tips</p>
                <ul className="space-y-1.5">
                  {data.soloFemale.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-[10px] font-bold text-green-700 mb-1">SAFE AREAS</p>
                  {data.soloFemale.safeAreas.map((a) => (
                    <p key={a} className="text-xs text-green-600">{a}</p>
                  ))}
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-[10px] font-bold text-red-700 mb-1">AVOID</p>
                  {data.soloFemale.avoidAreas.map((a) => (
                    <p key={a} className="text-xs text-red-600">{a}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* LGBTQ+ Safety */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                <Heart className="w-5 h-5" />
                LGBTQ+ Safety
              </CardTitle>
              <Badge className={cn('w-fit', data.lgbtq.score >= 60 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                Score: {data.lgbtq.score}/100
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-[10px] font-bold text-gray-500">LEGAL STATUS</p>
                  <p className="text-xs text-gray-700 mt-0.5">{data.lgbtq.legal}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-[10px] font-bold text-gray-500">SAFETY LEVEL</p>
                  <p className="text-xs text-gray-700 mt-0.5">{data.lgbtq.safety}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-[10px] font-bold text-gray-500">CULTURAL ATTITUDE</p>
                  <p className="text-xs text-gray-700 mt-0.5">{data.lgbtq.culture}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Common Scams */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Common Scams - {selectedCountry}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.scams.map((scam, i) => (
                <motion.div
                  key={scam.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-amber-50 rounded-xl p-4 border border-amber-200"
                >
                  <h4 className="font-bold text-sm text-amber-800 mb-1">{scam.name}</h4>
                  <p className="text-xs text-amber-700 mb-2">{scam.description}</p>
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                    <p className="text-[10px] font-bold text-green-700">HOW TO AVOID</p>
                    <p className="text-xs text-green-600">{scam.avoid}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Safety Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg">Safety Comparison</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {compareCountries.map((c) => (
                <Badge key={c} className="gap-1 bg-[#1A3C5E] text-white">
                  {c}
                  <button onClick={() => removeCompare(c)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {compareCountries.length < 3 && (
                <select
                  onChange={(e) => { addCompare(e.target.value); e.target.value = ''; }}
                  className="h-7 rounded-md border border-gray-200 bg-white px-2 text-xs"
                  defaultValue=""
                >
                  <option value="" disabled>+ Add</option>
                  {countryList.filter((c) => !compareCountries.includes(c)).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {compareCountries.length >= 2 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Category</th>
                      {compareCountries.map((c) => (
                        <th key={c} className="text-center py-2 px-3 font-semibold text-[#1A3C5E]">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-2 px-3 font-bold text-gray-700">Overall</td>
                      {compareCountries.map((c) => (
                        <td key={c} className={cn('py-2 px-3 text-center font-bold', scoreColor(safetyDatabase[c].overall))}>
                          {safetyDatabase[c].overall}
                        </td>
                      ))}
                    </tr>
                    {safetyDatabase[compareCountries[0]].categories.map((cat) => (
                      <tr key={cat.name} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-gray-600 text-xs">{cat.name}</td>
                        {compareCountries.map((c) => {
                          const s = safetyDatabase[c].categories.find((x) => x.name === cat.name)?.score || 0;
                          return (
                            <td key={c} className={cn('py-2 px-3 text-center font-medium text-xs', scoreColor(s))}>
                              {s}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">Select at least 2 countries to compare</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
