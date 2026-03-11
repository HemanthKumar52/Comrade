'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stamp, Globe, HelpCircle, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PassportStamp {
  id: string;
  destination: string;
  state: string;
  country: string;
  date: string;
  unlocked: boolean;
  color: string;
  borderColor: string;
}

const mockStamps: PassportStamp[] = [
  { id: '1', destination: 'Munnar', state: 'Kerala', country: 'India', date: '2025-12-15', unlocked: true, color: 'from-green-400 to-emerald-600', borderColor: 'border-green-300' },
  { id: '2', destination: 'Goa', state: 'Goa', country: 'India', date: '2025-11-20', unlocked: true, color: 'from-blue-400 to-cyan-600', borderColor: 'border-blue-300' },
  { id: '3', destination: 'Jaipur', state: 'Rajasthan', country: 'India', date: '2025-10-05', unlocked: true, color: 'from-pink-400 to-rose-600', borderColor: 'border-pink-300' },
  { id: '4', destination: 'Varanasi', state: 'Uttar Pradesh', country: 'India', date: '2025-09-12', unlocked: true, color: 'from-orange-400 to-amber-600', borderColor: 'border-orange-300' },
  { id: '5', destination: 'Manali', state: 'Himachal Pradesh', country: 'India', date: '2025-08-01', unlocked: true, color: 'from-sky-400 to-indigo-600', borderColor: 'border-sky-300' },
  { id: '6', destination: 'Ooty', state: 'Tamil Nadu', country: 'India', date: '2025-07-10', unlocked: true, color: 'from-teal-400 to-green-600', borderColor: 'border-teal-300' },
  { id: '7', destination: 'Udaipur', state: 'Rajasthan', country: 'India', date: '2025-06-22', unlocked: true, color: 'from-violet-400 to-purple-600', borderColor: 'border-violet-300' },
  { id: '8', destination: 'Darjeeling', state: 'West Bengal', country: 'India', date: '', unlocked: false, color: '', borderColor: '' },
  { id: '9', destination: 'Hampi', state: 'Karnataka', country: 'India', date: '', unlocked: false, color: '', borderColor: '' },
  { id: '10', destination: 'Rishikesh', state: 'Uttarakhand', country: 'India', date: '', unlocked: false, color: '', borderColor: '' },
];

export default function PassportPage() {
  const unlockedStamps = mockStamps.filter((s) => s.unlocked);
  const lockedStamps = mockStamps.filter((s) => !s.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Digital Passport</h1>
        <p className="text-gray-500 text-sm">Your collection of travel stamps and memories</p>
      </motion.div>

      {/* Passport Book */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-[#0d1b2a] border-0 overflow-hidden relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-400/30 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-400/30 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-amber-400/30 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-amber-400/30 rounded-br-xl" />

          <CardContent className="p-6 sm:p-10 relative">
            {/* Passport Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="w-20 h-20 rounded-full border-2 border-amber-400 flex items-center justify-center mx-auto mb-4 bg-amber-400/10"
              >
                <Globe className="w-10 h-10 text-amber-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-amber-400 tracking-[0.2em] uppercase">
                Partner Passport
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto mt-3" />
              <p className="text-white/30 text-sm mt-2 tracking-wider">Travel Companion</p>
            </div>

            {/* Destinations Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-10 py-5 border-y border-amber-400/15"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-amber-400/70" />
                <p className="text-xs uppercase tracking-[0.15em] text-white/40">Destinations Explored</p>
              </div>
              <p className="text-5xl font-bold text-amber-400 mt-2">{unlockedStamps.length}</p>
              <p className="text-white/30 text-xs mt-1">of {mockStamps.length} destinations</p>
            </motion.div>

            {/* Stamp Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Unlocked Stamps */}
              {unlockedStamps.map((stamp, i) => (
                <motion.div
                  key={stamp.id}
                  initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
                >
                  <div
                    className={cn(
                      'relative rounded-xl p-4 bg-gradient-to-br text-white overflow-hidden border-2',
                      stamp.color,
                      stamp.borderColor
                    )}
                  >
                    {/* Decorative stamp pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1 left-1 right-1 bottom-1 border-2 border-dashed border-white rounded-lg" />
                    </div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <Stamp className="w-5 h-5 text-white/60" />
                        <span className="text-lg">🇮🇳</span>
                      </div>
                      <h3 className="font-bold text-base tracking-wide">{stamp.destination}</h3>
                      <p className="text-xs text-white/70 mt-0.5">{stamp.state}</p>
                      <div className="flex items-center gap-1 mt-3">
                        <Calendar className="w-3 h-3 text-white/50" />
                        <p className="text-[11px] text-white/50">
                          {new Date(stamp.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Locked Slots */}
              {lockedStamps.map((stamp, i) => (
                <motion.div
                  key={stamp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                >
                  <div className="rounded-xl border-2 border-dashed border-white/10 p-4 flex flex-col items-center justify-center min-h-[140px] hover:border-white/20 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
                      <HelpCircle className="w-7 h-7 text-white/15 group-hover:text-white/25 transition-colors" />
                    </div>
                    <p className="text-xs text-white/20 font-medium">Undiscovered</p>
                    <p className="text-[10px] text-white/10 mt-1">Keep exploring!</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-10 pt-6 border-t border-amber-400/10">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                Every stamp tells a story
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
