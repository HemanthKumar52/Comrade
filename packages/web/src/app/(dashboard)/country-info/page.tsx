'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, MapPin, Users, Languages, Coins, Clock, Phone, Car, Flag,
  Search, ArrowLeftRight, X, ChevronRight, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface CountryData {
  name: string;
  flag: string;
  capital: string;
  population: string;
  area: string;
  region: string;
  subregion: string;
  languages: string[];
  currencies: { name: string; symbol: string }[];
  timezones: string[];
  callingCode: string;
  drivingSide: 'left' | 'right';
  borders: string[];
  tld: string;
  demonym: string;
  continent: string;
  gdpPerCapita: string;
  independenceYear: string;
}

/* ──────────────── Mock Data ──────────────── */

const countriesData: Record<string, CountryData> = {
  India: {
    name: 'India',
    flag: '🇮🇳',
    capital: 'New Delhi',
    population: '1,428,627,663',
    area: '3,287,263 km²',
    region: 'Asia',
    subregion: 'Southern Asia',
    languages: ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada'],
    currencies: [{ name: 'Indian Rupee', symbol: '₹' }],
    timezones: ['UTC+05:30'],
    callingCode: '+91',
    drivingSide: 'left',
    borders: ['Bangladesh', 'Bhutan', 'China', 'Myanmar', 'Nepal', 'Pakistan'],
    tld: '.in',
    demonym: 'Indian',
    continent: 'Asia',
    gdpPerCapita: '$2,601',
    independenceYear: '1947',
  },
  Japan: {
    name: 'Japan',
    flag: '🇯🇵',
    capital: 'Tokyo',
    population: '123,294,513',
    area: '377,975 km²',
    region: 'Asia',
    subregion: 'Eastern Asia',
    languages: ['Japanese'],
    currencies: [{ name: 'Japanese Yen', symbol: '¥' }],
    timezones: ['UTC+09:00'],
    callingCode: '+81',
    drivingSide: 'left',
    borders: [],
    tld: '.jp',
    demonym: 'Japanese',
    continent: 'Asia',
    gdpPerCapita: '$33,815',
    independenceYear: '660 BC',
  },
  France: {
    name: 'France',
    flag: '🇫🇷',
    capital: 'Paris',
    population: '67,750,000',
    area: '640,679 km²',
    region: 'Europe',
    subregion: 'Western Europe',
    languages: ['French'],
    currencies: [{ name: 'Euro', symbol: '€' }],
    timezones: ['UTC+01:00'],
    callingCode: '+33',
    drivingSide: 'right',
    borders: ['Andorra', 'Belgium', 'Germany', 'Italy', 'Luxembourg', 'Monaco', 'Spain', 'Switzerland'],
    tld: '.fr',
    demonym: 'French',
    continent: 'Europe',
    gdpPerCapita: '$40,886',
    independenceYear: '843',
  },
  'United States': {
    name: 'United States',
    flag: '🇺🇸',
    capital: 'Washington, D.C.',
    population: '331,449,281',
    area: '9,833,520 km²',
    region: 'Americas',
    subregion: 'Northern America',
    languages: ['English', 'Spanish'],
    currencies: [{ name: 'US Dollar', symbol: '$' }],
    timezones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00'],
    callingCode: '+1',
    drivingSide: 'right',
    borders: ['Canada', 'Mexico'],
    tld: '.us',
    demonym: 'American',
    continent: 'North America',
    gdpPerCapita: '$76,330',
    independenceYear: '1776',
  },
  Australia: {
    name: 'Australia',
    flag: '🇦🇺',
    capital: 'Canberra',
    population: '26,439,111',
    area: '7,692,024 km²',
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    languages: ['English'],
    currencies: [{ name: 'Australian Dollar', symbol: 'A$' }],
    timezones: ['UTC+08:00', 'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00'],
    callingCode: '+61',
    drivingSide: 'left',
    borders: [],
    tld: '.au',
    demonym: 'Australian',
    continent: 'Oceania',
    gdpPerCapita: '$65,099',
    independenceYear: '1901',
  },
  Brazil: {
    name: 'Brazil',
    flag: '🇧🇷',
    capital: 'Brasilia',
    population: '214,326,223',
    area: '8,515,767 km²',
    region: 'Americas',
    subregion: 'South America',
    languages: ['Portuguese'],
    currencies: [{ name: 'Brazilian Real', symbol: 'R$' }],
    timezones: ['UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00'],
    callingCode: '+55',
    drivingSide: 'right',
    borders: ['Argentina', 'Bolivia', 'Colombia', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'],
    tld: '.br',
    demonym: 'Brazilian',
    continent: 'South America',
    gdpPerCapita: '$8,917',
    independenceYear: '1822',
  },
  Germany: {
    name: 'Germany',
    flag: '🇩🇪',
    capital: 'Berlin',
    population: '83,240,525',
    area: '357,114 km²',
    region: 'Europe',
    subregion: 'Western Europe',
    languages: ['German'],
    currencies: [{ name: 'Euro', symbol: '€' }],
    timezones: ['UTC+01:00'],
    callingCode: '+49',
    drivingSide: 'right',
    borders: ['Austria', 'Belgium', 'Czech Republic', 'Denmark', 'France', 'Luxembourg', 'Netherlands', 'Poland', 'Switzerland'],
    tld: '.de',
    demonym: 'German',
    continent: 'Europe',
    gdpPerCapita: '$48,636',
    independenceYear: '1871',
  },
  Thailand: {
    name: 'Thailand',
    flag: '🇹🇭',
    capital: 'Bangkok',
    population: '71,801,279',
    area: '513,120 km²',
    region: 'Asia',
    subregion: 'South-Eastern Asia',
    languages: ['Thai'],
    currencies: [{ name: 'Thai Baht', symbol: '฿' }],
    timezones: ['UTC+07:00'],
    callingCode: '+66',
    drivingSide: 'left',
    borders: ['Cambodia', 'Laos', 'Malaysia', 'Myanmar'],
    tld: '.th',
    demonym: 'Thai',
    continent: 'Asia',
    gdpPerCapita: '$7,233',
    independenceYear: '1238',
  },
};

const featuredCountries = ['India', 'Japan', 'France', 'United States', 'Australia', 'Brazil'];

const infoItems: { key: keyof CountryData; label: string; icon: React.ElementType }[] = [
  { key: 'capital', label: 'Capital', icon: MapPin },
  { key: 'population', label: 'Population', icon: Users },
  { key: 'area', label: 'Area', icon: Globe },
  { key: 'region', label: 'Region', icon: Flag },
  { key: 'callingCode', label: 'Calling Code', icon: Phone },
  { key: 'drivingSide', label: 'Driving Side', icon: Car },
];

/* ──────────────── Component ──────────────── */

export default function CountryInfoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const allCountryNames = Object.keys(countriesData);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return featuredCountries;
    return allCountryNames.filter((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleCompare = (name: string) => {
    setCompareList((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : prev.length < 3
          ? [...prev, name]
          : prev
    );
  };

  const selected = selectedCountry ? countriesData[selectedCountry] : null;

  const compareKeys: { key: keyof CountryData; label: string }[] = [
    { key: 'capital', label: 'Capital' },
    { key: 'population', label: 'Population' },
    { key: 'area', label: 'Area' },
    { key: 'region', label: 'Region' },
    { key: 'subregion', label: 'Subregion' },
    { key: 'callingCode', label: 'Calling Code' },
    { key: 'drivingSide', label: 'Driving Side' },
    { key: 'gdpPerCapita', label: 'GDP Per Capita' },
    { key: 'independenceYear', label: 'Independence' },
    { key: 'tld', label: 'Domain (TLD)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E]">Country Info</h1>
        <p className="text-gray-500 text-sm mt-1">Explore detailed information about countries worldwide</p>
      </motion.div>

      {/* Search and Compare Toggle */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
          />
        </div>
        <Button
          className={cn(
            'gap-2 h-11 shrink-0',
            compareMode ? 'bg-[#E8733A] hover:bg-[#d4622e] text-white' : 'bg-[#1A3C5E] hover:bg-[#153350] text-white'
          )}
          onClick={() => {
            setCompareMode(!compareMode);
            if (compareMode) setCompareList([]);
            setSelectedCountry(null);
          }}
        >
          <ArrowLeftRight className="w-4 h-4" />
          {compareMode ? `Compare (${compareList.length}/3)` : 'Compare Mode'}
        </Button>
      </motion.div>

      {/* Country Grid */}
      {!selectedCountry && !compareMode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">
            {searchQuery ? 'Search Results' : 'Featured Countries'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map((name, i) => {
              const country = countriesData[name];
              if (!country) return null;
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-[#E8733A]/30 group"
                    onClick={() => setSelectedCountry(name)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-5xl">{country.flag}</span>
                        <div>
                          <h3 className="text-lg font-bold text-[#1A3C5E] group-hover:text-[#E8733A] transition-colors">{country.name}</h3>
                          <p className="text-sm text-gray-500">{country.capital}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-3.5 h-3.5 text-gray-400" />
                          {country.region}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {country.population.split(',').slice(0, 1).join('')}M+
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Languages className="w-3.5 h-3.5 text-gray-400" />
                          {country.languages[0]}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Coins className="w-3.5 h-3.5 text-gray-400" />
                          {country.currencies[0].symbol}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-xs text-[#E8733A] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ChevronRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          {filteredCountries.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No countries found matching &quot;{searchQuery}&quot;</p>
          )}
        </motion.div>
      )}

      {/* Compare Mode Grid */}
      {compareMode && !selectedCountry && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">Select Countries to Compare (max 3)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allCountryNames.map((name) => {
                const country = countriesData[name];
                const isSelected = compareList.includes(name);
                return (
                  <Card
                    key={name}
                    className={cn(
                      'cursor-pointer transition-all',
                      isSelected
                        ? 'border-[#E8733A] bg-[#E8733A]/5 shadow-md'
                        : 'hover:shadow-md hover:border-gray-300'
                    )}
                    onClick={() => toggleCompare(name)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A3C5E] text-sm truncate">{country.name}</p>
                        <p className="text-xs text-gray-400">{country.capital}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#E8733A] text-white flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold">{compareList.indexOf(name) + 1}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Comparison Table */}
          {compareList.length >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-[#E8733A]" />
                    Country Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 text-gray-500 font-medium">Attribute</th>
                          {compareList.map((name) => (
                            <th key={name} className="text-left py-3 px-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{countriesData[name].flag}</span>
                                <span className="font-bold text-[#1A3C5E]">{name}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {compareKeys.map((row) => (
                          <tr key={row.key} className="border-b last:border-0">
                            <td className="py-3 px-2 text-gray-500 font-medium">{row.label}</td>
                            {compareList.map((name) => (
                              <td key={name} className="py-3 px-2 text-[#1A3C5E]">
                                {String(countriesData[name][row.key])}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr className="border-b">
                          <td className="py-3 px-2 text-gray-500 font-medium">Languages</td>
                          {compareList.map((name) => (
                            <td key={name} className="py-3 px-2">
                              <div className="flex flex-wrap gap-1">
                                {countriesData[name].languages.slice(0, 3).map((lang) => (
                                  <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                                ))}
                                {countriesData[name].languages.length > 3 && (
                                  <Badge variant="outline" className="text-xs">+{countriesData[name].languages.length - 3}</Badge>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2 text-gray-500 font-medium">Currencies</td>
                          {compareList.map((name) => (
                            <td key={name} className="py-3 px-2 text-[#1A3C5E]">
                              {countriesData[name].currencies.map((c) => `${c.name} (${c.symbol})`).join(', ')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-2 text-gray-500 font-medium">Timezones</td>
                          {compareList.map((name) => (
                            <td key={name} className="py-3 px-2 text-[#1A3C5E] text-xs">
                              {countriesData[name].timezones.join(', ')}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {/* Detailed Country View */}
      {selected && !compareMode && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCountry}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Back Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCountry(null)}
              className="text-[#1A3C5E]"
            >
              <X className="w-4 h-4 mr-1" /> Back to Countries
            </Button>

            {/* Hero Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-[#1A3C5E] via-[#2a5a8a] to-[#3a7ab8] text-white p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <span className="text-8xl">{selected.flag}</span>
                  <div className="text-center sm:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold">{selected.name}</h2>
                    <p className="text-lg opacity-80 mt-1">{selected.capital}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap justify-center sm:justify-start">
                      <Badge className="bg-white/20 text-white">{selected.region}</Badge>
                      <Badge className="bg-white/20 text-white">{selected.subregion}</Badge>
                      <Badge className="bg-white/20 text-white">{selected.demonym}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {infoItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-all h-full">
                    <CardContent className="p-4 text-center">
                      <item.icon className="w-5 h-5 mx-auto mb-2 text-[#E8733A]" />
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="font-bold text-[#1A3C5E] text-sm">
                        {item.key === 'drivingSide'
                          ? selected.drivingSide === 'left' ? 'Left' : 'Right'
                          : String(selected[item.key])}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Languages */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Languages className="w-5 h-5 text-[#E8733A]" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selected.languages.map((lang) => (
                        <Badge key={lang} className="bg-[#1A3C5E]/10 text-[#1A3C5E] text-sm py-1.5 px-3">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Currencies */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[#E8733A]" />
                      Currencies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selected.currencies.map((curr) => (
                        <div key={curr.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <div className="w-10 h-10 rounded-full bg-[#E8733A]/10 flex items-center justify-center text-lg font-bold text-[#E8733A]">
                            {curr.symbol}
                          </div>
                          <p className="font-semibold text-[#1A3C5E]">{curr.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Timezones */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#E8733A]" />
                      Timezones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selected.timezones.map((tz) => (
                        <Badge key={tz} variant="outline" className="text-sm py-1.5 px-3">
                          {tz}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Borders */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#E8733A]" />
                      Neighboring Countries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selected.borders.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selected.borders.map((border) => {
                          const isClickable = border in countriesData;
                          return (
                            <Badge
                              key={border}
                              className={cn(
                                'text-sm py-1.5 px-3',
                                isClickable
                                  ? 'bg-[#E8733A]/10 text-[#E8733A] cursor-pointer hover:bg-[#E8733A]/20 transition-colors'
                                  : 'bg-gray-100 text-gray-600'
                              )}
                              onClick={() => isClickable && setSelectedCountry(border)}
                            >
                              {border}
                              {isClickable && <ChevronRight className="w-3 h-3 ml-1" />}
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Island nation - no land borders</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Facts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#E8733A]" />
                    Quick Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-[#1A3C5E]/5 text-center">
                      <p className="text-xs text-gray-500">GDP Per Capita</p>
                      <p className="font-bold text-[#1A3C5E] mt-1">{selected.gdpPerCapita}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1A3C5E]/5 text-center">
                      <p className="text-xs text-gray-500">Independence</p>
                      <p className="font-bold text-[#1A3C5E] mt-1">{selected.independenceYear}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1A3C5E]/5 text-center">
                      <p className="text-xs text-gray-500">Internet TLD</p>
                      <p className="font-bold text-[#1A3C5E] mt-1">{selected.tld}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1A3C5E]/5 text-center">
                      <p className="text-xs text-gray-500">Continent</p>
                      <p className="font-bold text-[#1A3C5E] mt-1">{selected.continent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
