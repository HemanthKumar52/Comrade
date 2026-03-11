'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Phone, Plus, Star, MapPin, Building, Shield,
  Heart, Clock, Search, Globe, Download, Anchor, Brain, Eye,
  Siren, Users, PhoneCall, ChevronDown, X, ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  primary: boolean;
}

interface Hospital {
  id: string;
  name: string;
  distance: string;
  is24hr: boolean;
  phone: string;
  address: string;
}

interface Advisory {
  country: string;
  level: 'green' | 'yellow' | 'orange' | 'red';
  description: string;
  date: string;
}

interface Embassy {
  country: string;
  address: string;
  phone: string;
  hours: string;
  email: string;
}

interface CountryEmergency {
  code: string;
  name: string;
  flag: string;
  numbers: {
    police: string;
    ambulance: string;
    fire: string;
    universal: string;
    roadside?: string;
    coastGuard?: string;
    poisonControl?: string;
    mentalHealth?: string;
    touristPolice?: string;
    childHelpline?: string;
    womenHelpline?: string;
    antiCorruption?: string;
  };
}

/* ──────────────── Mock Data ──────────────── */

const mockContacts: EmergencyContact[] = [
  { id: '1', name: 'Mom', phone: '+91 98765 43210', relationship: 'Mother', primary: true },
  { id: '2', name: 'Rahul Sharma', phone: '+91 87654 32109', relationship: 'Friend', primary: false },
  { id: '3', name: 'Dr. Patel', phone: '+91 76543 21098', relationship: 'Doctor', primary: false },
];

const mockHospitals: Hospital[] = [
  { id: '1', name: 'Apollo Hospital', distance: '1.2 km', is24hr: true, phone: '+91 44 2829 3333', address: '21 Greams Lane, Chennai' },
  { id: '2', name: 'Fortis Hospital', distance: '2.8 km', is24hr: true, phone: '+91 44 4289 2222', address: '154 Mowbrays Road, Chennai' },
  { id: '3', name: 'City Medical Center', distance: '3.5 km', is24hr: false, phone: '+91 44 2531 4141', address: '45 Anna Nagar, Chennai' },
];

const mockAdvisories: Advisory[] = [
  { country: 'Thailand', level: 'green', description: 'Exercise normal precautions. Standard safety measures advised for tourists.', date: '2026-03-01' },
  { country: 'Sri Lanka', level: 'yellow', description: 'Exercise increased caution due to sporadic civil unrest in some areas.', date: '2026-02-28' },
  { country: 'Myanmar', level: 'orange', description: 'Reconsider travel. Political instability and armed conflict in border regions.', date: '2026-03-05' },
  { country: 'Afghanistan', level: 'red', description: 'Do not travel. Armed conflict, kidnapping, and terrorism.', date: '2026-03-07' },
  { country: 'Ukraine', level: 'red', description: 'Do not travel. Active armed conflict throughout the country.', date: '2026-03-08' },
  { country: 'Japan', level: 'green', description: 'Exercise normal precautions. One of the safest tourist destinations.', date: '2026-03-06' },
  { country: 'Turkey', level: 'yellow', description: 'Exercise increased caution. Possible terrorism, particularly in border areas.', date: '2026-03-04' },
  { country: 'Mexico', level: 'yellow', description: 'Exercise increased caution due to crime and kidnapping in some states.', date: '2026-03-03' },
];

const mockEmbassies: Embassy[] = [
  { country: 'Thailand', address: '46 Soi Prasarnmitr, Sukhumvit 23, Bangkok 10110', phone: '+66 2 258 0300', hours: 'Mon-Fri: 8:30 AM - 5:00 PM', email: 'cons.bangkok@mea.gov.in' },
  { country: 'Japan', address: '2-2-11 Kudan Minami, Chiyoda-ku, Tokyo', phone: '+81 3 3262 2391', hours: 'Mon-Fri: 9:00 AM - 5:30 PM', email: 'cons.tokyo@mea.gov.in' },
  { country: 'United States', address: '2107 Massachusetts Ave NW, Washington DC', phone: '+1 202 939 7000', hours: 'Mon-Fri: 9:00 AM - 5:30 PM', email: 'cons.washington@mea.gov.in' },
  { country: 'United Kingdom', address: 'India House, Aldwych, London WC2B 4NA', phone: '+44 20 7836 8484', hours: 'Mon-Fri: 9:00 AM - 5:30 PM', email: 'cons.london@mea.gov.in' },
  { country: 'UAE', address: 'Plot No. 10, Sector W-59/02, Abu Dhabi', phone: '+971 2 449 2700', hours: 'Mon-Fri: 8:30 AM - 4:30 PM', email: 'cons.abudhabi@mea.gov.in' },
];

const countryEmergencies: CountryEmergency[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', numbers: { police: '911', ambulance: '911', fire: '911', universal: '911', roadside: '1-800-222-4357', poisonControl: '1-800-222-1222', mentalHealth: '988', childHelpline: '1-800-422-4453' } },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', numbers: { police: '999', ambulance: '999', fire: '999', universal: '112', coastGuard: '999', mentalHealth: '116 123', childHelpline: '0800 1111', roadside: 'RAC: 0330 159 1111' } },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', numbers: { police: '191', ambulance: '1669', fire: '199', universal: '1155', touristPolice: '1155', roadside: '1146', poisonControl: '1367' } },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', numbers: { police: '110', ambulance: '119', fire: '119', universal: '110', coastGuard: '118', mentalHealth: '0570-064-211', roadside: '#8139' } },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', numbers: { police: '999', ambulance: '998', fire: '997', universal: '112', coastGuard: '996', touristPolice: '901', roadside: '800 4900', womenHelpline: '800 111' } },
  { code: 'FR', name: 'France', flag: '🇫🇷', numbers: { police: '17', ambulance: '15', fire: '18', universal: '112', poisonControl: '01 40 05 48 48', mentalHealth: '3114', childHelpline: '119', coastGuard: '196' } },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', numbers: { police: '000', ambulance: '000', fire: '000', universal: '112', poisonControl: '13 11 26', mentalHealth: '13 11 14', childHelpline: '1800 55 1800', roadside: 'NRMA: 13 11 22' } },
  { code: 'IN', name: 'India', flag: '🇮🇳', numbers: { police: '100', ambulance: '108', fire: '101', universal: '112', womenHelpline: '181', childHelpline: '1098', mentalHealth: '9152987821', antiCorruption: '1031', roadside: '1073' } },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', numbers: { police: '999', ambulance: '995', fire: '995', universal: '112', coastGuard: '6325 2488', mentalHealth: '6389 2222', childHelpline: '1800 111 0000' } },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', numbers: { police: '110', ambulance: '112', fire: '112', universal: '112', poisonControl: '030 192 40', mentalHealth: '0800 111 0 111', childHelpline: '0800 111 0 333' } },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', numbers: { police: '113', ambulance: '118', fire: '115', universal: '112', coastGuard: '1530', roadside: '803 116', mentalHealth: '06 77208977' } },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', numbers: { police: '091', ambulance: '112', fire: '080', universal: '112', coastGuard: '900 202 202', touristPolice: '902 102 112', mentalHealth: '024' } },
];

// Current trip destination for quick dial
const currentDestination = countryEmergencies.find((c) => c.code === 'TH');

const advisoryStyles: Record<string, { bg: string; text: string; label: string; icon: string; mapColor: string }> = {
  green: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', label: 'Safe', icon: '🟢', mapColor: 'bg-green-400' },
  yellow: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', label: 'Caution', icon: '🟡', mapColor: 'bg-yellow-400' },
  orange: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: 'High Risk', icon: '🟠', mapColor: 'bg-orange-400' },
  red: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Do Not Travel', icon: '🔴', mapColor: 'bg-red-500' },
};

const numberIcons: Record<string, React.ElementType> = {
  police: Shield,
  ambulance: Heart,
  fire: AlertTriangle,
  universal: Phone,
  roadside: Siren,
  coastGuard: Anchor,
  poisonControl: AlertTriangle,
  mentalHealth: Brain,
  touristPolice: Eye,
  childHelpline: Users,
  womenHelpline: Users,
  antiCorruption: Shield,
};

const numberLabels: Record<string, string> = {
  police: 'Police',
  ambulance: 'Ambulance',
  fire: 'Fire',
  universal: 'Universal Emergency',
  roadside: 'Roadside Assist',
  coastGuard: 'Coast Guard',
  poisonControl: 'Poison Control',
  mentalHealth: 'Mental Health',
  touristPolice: 'Tourist Police',
  childHelpline: 'Child Helpline',
  womenHelpline: 'Women Helpline',
  antiCorruption: 'Anti-Corruption',
};

const numberColors: Record<string, string> = {
  police: 'from-blue-500 to-blue-700',
  ambulance: 'from-red-500 to-red-700',
  fire: 'from-orange-500 to-orange-700',
  universal: 'from-green-500 to-green-700',
  roadside: 'from-amber-500 to-amber-700',
  coastGuard: 'from-cyan-500 to-cyan-700',
  poisonControl: 'from-purple-500 to-purple-700',
  mentalHealth: 'from-pink-500 to-pink-700',
  touristPolice: 'from-indigo-500 to-indigo-700',
  childHelpline: 'from-teal-500 to-teal-700',
  womenHelpline: 'from-rose-500 to-rose-700',
  antiCorruption: 'from-slate-500 to-slate-700',
};

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function EmergencyPage() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const sosTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [embassySearch, setEmbassySearch] = useState('');
  const [emergencySearch, setEmergencySearch] = useState('');
  const [selectedEmergencyCountry, setSelectedEmergencyCountry] = useState('');

  const handleSOSPress = useCallback(() => {
    sosTimerRef.current = setTimeout(() => {
      setSosActive(true);
      alert('SOS Alert sent! Your emergency contacts have been notified with your location.');
      setSosActive(false);
    }, 3000);
  }, []);

  const handleSOSRelease = useCallback(() => {
    if (sosTimerRef.current) {
      clearTimeout(sosTimerRef.current);
      sosTimerRef.current = null;
    }
  }, []);

  const filteredEmbassies = embassySearch
    ? mockEmbassies.filter((e) => e.country.toLowerCase().includes(embassySearch.toLowerCase()))
    : mockEmbassies;

  const filteredEmergencyCountries = useMemo(() => {
    if (!emergencySearch) return countryEmergencies;
    const q = emergencySearch.toLowerCase();
    return countryEmergencies.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [emergencySearch]);

  const selectedEmCountry = countryEmergencies.find((c) => c.code === selectedEmergencyCountry);

  const handleOfflineDownload = () => {
    const data = countryEmergencies.map((c) => ({
      country: c.name,
      ...c.numbers,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emergency-numbers.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-[#1A3C5E]">Emergency Hub</h1>
        <p className="text-gray-500 mt-1">Quick access to emergency resources worldwide</p>
      </motion.div>

      {/* SOS Section */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-red-500 to-red-700 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col items-center text-center">
              <motion.button
                onMouseDown={handleSOSPress}
                onMouseUp={handleSOSRelease}
                onMouseLeave={handleSOSRelease}
                onTouchStart={handleSOSPress}
                onTouchEnd={handleSOSRelease}
                whileTap={{ scale: 0.95 }}
                className="w-32 h-32 rounded-full bg-white/20 backdrop-blur border-4 border-white/40 flex flex-col items-center justify-center text-white mb-4 hover:bg-white/30 transition-colors animate-pulse shadow-lg shadow-red-900/50"
              >
                <AlertTriangle className="w-10 h-10 mb-1" />
                <span className="text-2xl font-black tracking-wider">SOS</span>
              </motion.button>
              <p className="text-white/80 text-sm font-medium">Press and hold for 3 seconds</p>
              <p className="text-white/50 text-xs mt-1">
                Will alert your emergency contacts with your live location
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Dial - Current Destination */}
      {currentDestination && (
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="border-2 border-[#E8733A]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                <PhoneCall className="w-5 h-5 text-[#E8733A]" />
                Quick Dial - {currentDestination.flag} {currentDestination.name}
                <Badge className="ml-2 bg-[#E8733A]/10 text-[#E8733A] border-[#E8733A]/30">Current Trip</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['police', 'ambulance', 'fire', 'universal'].map((key) => {
                  const num = currentDestination.numbers[key as keyof typeof currentDestination.numbers];
                  if (!num) return null;
                  const Icon = numberIcons[key] || Phone;
                  return (
                    <a key={key} href={`tel:${num}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn('bg-gradient-to-br text-white rounded-2xl p-6 text-center cursor-pointer shadow-lg', numberColors[key])}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-3xl font-bold font-mono">{num}</p>
                        <p className="text-xs text-white/80 mt-1 uppercase tracking-wide">{numberLabels[key]}</p>
                      </motion.div>
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Emergency Numbers by Country */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
              <Globe className="w-5 h-5 text-[#E8733A]" />
              Emergency Numbers by Country
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-[#1A3C5E] border-[#1A3C5E]/30"
              onClick={handleOfflineDownload}
            >
              <Download className="w-3.5 h-3.5" />
              Offline Pack
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search countries..."
                value={emergencySearch}
                onChange={(e) => setEmergencySearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {filteredEmergencyCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedEmergencyCountry(selectedEmergencyCountry === c.code ? '' : c.code)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedEmergencyCountry === c.code
                      ? 'bg-[#1A3C5E] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {selectedEmCountry && (
                <motion.div
                  key={selectedEmCountry.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-[#1A3C5E]/5 rounded-xl p-4 mb-2">
                    <h3 className="font-bold text-lg text-[#1A3C5E] mb-4">
                      {selectedEmCountry.flag} {selectedEmCountry.name} Emergency Numbers
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(selectedEmCountry.numbers).map(([key, number]) => {
                        if (!number) return null;
                        const Icon = numberIcons[key] || Phone;
                        return (
                          <a key={key} href={`tel:${number}`}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#E8733A] hover:shadow-md transition-all cursor-pointer text-center"
                            >
                              <div className={cn('w-10 h-10 rounded-full bg-gradient-to-br mx-auto mb-2 flex items-center justify-center', numberColors[key] || 'from-gray-500 to-gray-700')}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-xl font-bold font-mono text-[#1A3C5E]">{number}</p>
                              <p className="text-xs text-gray-500 mt-1">{numberLabels[key] || key}</p>
                            </motion.div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#E8733A]" />
                Emergency Contacts
              </CardTitle>
              <Button
                size="sm"
                className="bg-[#E8733A] hover:bg-[#d4642e] gap-1"
                onClick={() => setShowAddContact(!showAddContact)}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Contact
              </Button>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {showAddContact && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <Input placeholder="Name" />
                    <Input placeholder="Phone number" type="tel" />
                    <Input placeholder="Relationship" />
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#E8733A] hover:bg-[#d4642e]">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddContact(false)}>Cancel</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-3">
                {mockContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center font-bold text-sm">
                        {contact.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-[#1A3C5E]">{contact.name}</p>
                          {contact.primary && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </div>
                        <p className="text-xs text-gray-500">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{contact.relationship}</Badge>
                      <a href={`tel:${contact.phone}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="w-3.5 h-3.5 text-green-600" />
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nearby Hospitals */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Nearby Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-36 bg-gradient-to-br from-[#1A3C5E]/5 to-[#1A3C5E]/10 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-red-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">Map Preview</p>
                </div>
              </div>
              <div className="space-y-3">
                {mockHospitals.map((hospital, index) => (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#1A3C5E]">{hospital.name}</h4>
                          {hospital.is24hr && (
                            <Badge className="bg-green-100 text-green-700 text-[10px] py-0">24 HR</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{hospital.address}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" /> {hospital.distance}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="w-3 h-3" /> {hospital.phone}
                          </span>
                        </div>
                      </div>
                      <a href={`tel:${hospital.phone}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <Phone className="w-4 h-4 text-green-600" />
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Travel Advisory Map */}
      <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1A3C5E]" />
              Travel Advisories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mini risk level legend */}
            <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-medium text-gray-500 uppercase">Risk Levels:</span>
              {Object.entries(advisoryStyles).map(([key, style]) => (
                <span key={key} className="flex items-center gap-1.5 text-xs">
                  <span>{style.icon}</span>
                  <span className={style.text}>{style.label}</span>
                </span>
              ))}
            </div>

            {/* Visual world risk map placeholder */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {mockAdvisories.map((advisory) => {
                const style = advisoryStyles[advisory.level];
                return (
                  <div key={advisory.country} className={cn('p-3 rounded-xl border text-center', style.bg)}>
                    <span className="text-lg">{style.icon}</span>
                    <p className="font-semibold text-sm text-[#1A3C5E] mt-1">{advisory.country}</p>
                    <Badge className={cn('text-[10px] mt-1', style.text, `bg-transparent`)}>{style.label}</Badge>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              {mockAdvisories.map((advisory, index) => {
                const style = advisoryStyles[advisory.level];
                return (
                  <motion.div
                    key={advisory.country}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn('p-4 rounded-xl border', style.bg)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{style.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#1A3C5E]">{advisory.country}</h4>
                          <Badge className={cn('text-[10px] py-0', style.text,
                            advisory.level === 'green' ? 'bg-green-100' :
                            advisory.level === 'yellow' ? 'bg-yellow-100' :
                            advisory.level === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                          )}>
                            {style.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{advisory.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1.5">
                          Updated: {new Date(advisory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Embassy Locator */}
      <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-[#1A3C5E]" />
              Embassy Locator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by country..."
                  value={embassySearch}
                  onChange={(e) => setEmbassySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredEmbassies.length > 0 ? (
              <div className="space-y-3">
                {filteredEmbassies.map((embassy, index) => (
                  <motion.div
                    key={embassy.country}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-[#1A3C5E] flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#E8733A]" />
                          Indian Embassy - {embassy.country}
                        </h4>
                        <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {embassy.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {embassy.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {embassy.hours}
                          </p>
                        </div>
                      </div>
                      <a href={`tel:${embassy.phone}`}>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Phone className="w-4 h-4 text-green-600" />
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  {embassySearch ? 'No embassies found for that country' : 'Search for embassies in your destination country'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
