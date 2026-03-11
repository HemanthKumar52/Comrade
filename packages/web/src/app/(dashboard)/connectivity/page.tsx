'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi, Signal, Smartphone, Download, Shield, MapPin,
  Eye, EyeOff, Lock, Cloud, Globe, AlertTriangle, Check, X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const mockHotspots = [
  { id: 1, name: 'Third Wave Coffee', location: 'Koramangala, Bangalore', speed: 4, reliability: 'Excellent', type: 'Indoor', password: 'thirdwave2026' },
  { id: 2, name: 'Atta Galatta Cafe', location: 'Koramangala, Bangalore', speed: 3, reliability: 'Good', type: 'Indoor', password: 'books&coffee' },
  { id: 3, name: 'Kempegowda Intl Airport', location: 'Terminal 1, Bangalore', speed: 5, reliability: 'Excellent', type: 'Indoor', password: 'Free (OTP based)' },
  { id: 4, name: 'Cubbon Park WiFi Zone', location: 'Cubbon Park, Bangalore', speed: 2, reliability: 'Fair', type: 'Outdoor', password: 'Free (BBMP WiFi)' },
  { id: 5, name: 'Starbucks MG Road', location: 'MG Road, Bangalore', speed: 3, reliability: 'Good', type: 'Indoor', password: 'starbucks#mgrd' },
];

const simOptions: Record<string, { carrier: string; data: string; validity: string; price: string; esim: boolean }[]> = {
  India: [
    { carrier: 'Jio', data: '2 GB/day', validity: '28 days', price: '₹299', esim: true },
    { carrier: 'Airtel', data: '1.5 GB/day', validity: '28 days', price: '₹269', esim: true },
    { carrier: 'Vi (Vodafone-Idea)', data: '1.5 GB/day', validity: '28 days', price: '₹249', esim: false },
  ],
  Thailand: [
    { carrier: 'TrueMove H', data: '15 GB', validity: '8 days', price: '₹720', esim: true },
    { carrier: 'AIS', data: '30 GB', validity: '8 days', price: '₹1,200', esim: true },
    { carrier: 'DTAC', data: '10 GB', validity: '7 days', price: '₹600', esim: false },
  ],
  Japan: [
    { carrier: 'IIJmio', data: '10 GB', validity: '30 days', price: '₹2,400', esim: true },
    { carrier: 'Mobal', data: '7 GB', validity: '8 days', price: '₹1,800', esim: true },
  ],
};

const offlineDownloads = [
  { id: 1, name: 'India Maps', region: 'Full Country', size: '1.2 GB', type: 'Maps', progress: 100 },
  { id: 2, name: 'Hindi Language Pack', region: 'Hindi', size: '45 MB', type: 'Language', progress: 100 },
  { id: 3, name: 'Tamil Phrasebook', region: 'Tamil Nadu', size: '12 MB', type: 'Phrasebook', progress: 60 },
  { id: 4, name: 'Rajasthan Cultural Guide', region: 'Rajasthan', size: '85 MB', type: 'Guide', progress: 0 },
  { id: 5, name: 'Kerala POI Data', region: 'Kerala', size: '32 MB', type: 'POI', progress: 0 },
];

const vpnData: Record<string, { status: 'legal' | 'restricted' | 'illegal'; recommendation: string }> = {
  India: { status: 'legal', recommendation: 'VPNs are legal in India. Useful for secure browsing on public WiFi.' },
  China: { status: 'restricted', recommendation: 'VPNs are heavily restricted. Only government-approved VPNs allowed. Download before arrival.' },
  Russia: { status: 'restricted', recommendation: 'Many VPN providers blocked. Download and configure before traveling.' },
  UAE: { status: 'restricted', recommendation: 'Using VPN for illegal activities is punishable. Legal for legitimate business use.' },
  'North Korea': { status: 'illegal', recommendation: 'Internet access is heavily restricted. No VPN usage possible.' },
  Thailand: { status: 'legal', recommendation: 'VPNs are legal. Recommended for public WiFi security.' },
  Japan: { status: 'legal', recommendation: 'VPNs are legal and widely used. No restrictions.' },
};

const vpnStatusConfig = {
  legal: { label: 'Legal', emoji: '✅', color: 'bg-green-100 text-green-700 border-green-200' },
  restricted: { label: 'Restricted', emoji: '⚠️', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  illegal: { label: 'Illegal', emoji: '❌', color: 'bg-red-100 text-red-700 border-red-200' },
};

function SignalBars({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn('w-1.5 rounded-sm transition-colors', i <= strength ? 'bg-[#E8733A]' : 'bg-gray-200')}
          style={{ height: `${(i / 5) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function ConnectivityPage() {
  const [revealedPasswords, setRevealedPasswords] = useState<Set<number>>(new Set());
  const [simCountry, setSIMCountry] = useState('India');
  const [vpnCountry, setVpnCountry] = useState('');
  const [downloads, setDownloads] = useState(offlineDownloads);

  const togglePassword = (id: number) => {
    setRevealedPasswords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const startDownload = (id: number) => {
    setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, progress: 15 } : d)));
    // Simulate progress
    let current = 15;
    const interval = setInterval(() => {
      current += Math.random() * 20;
      if (current >= 100) {
        clearInterval(interval);
        setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, progress: 100 } : d)));
      } else {
        setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, progress: Math.round(current) } : d)));
      }
    }, 500);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Connectivity Hub</h1>
        <p className="text-gray-500 text-sm">WiFi, SIM cards, offline data, and VPN info</p>
      </motion.div>

      {/* WiFi Hotspots */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5 text-[#E8733A]" /> WiFi Hotspots
        </h2>
        <div className="w-full h-40 rounded-xl bg-gradient-to-br from-[#1A3C5E] to-[#2d5a8a] mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-3 h-3 rounded-full bg-[#E8733A] animate-pulse" style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%`, animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
          <div className="text-center z-10">
            <Wifi className="w-8 h-8 text-white/60 mx-auto mb-2" />
            <p className="text-white/80 text-sm">5 hotspots near Bangalore</p>
          </div>
        </div>
        <div className="space-y-2">
          {mockHotspots.map((spot, i) => (
            <motion.div key={spot.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center shrink-0">
                      <Wifi className="w-5 h-5 text-[#1A3C5E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#1A3C5E] text-sm truncate">{spot.name}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">{spot.type}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{spot.location}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <SignalBars strength={spot.speed} />
                      <button onClick={() => togglePassword(spot.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#1A3C5E] transition-colors">
                        {revealedPasswords.has(spot.id) ? (
                          <><EyeOff className="w-3.5 h-3.5" /><span className="font-mono text-[#1A3C5E]">{spot.password}</span></>
                        ) : (
                          <><Eye className="w-3.5 h-3.5" /><span className="blur-sm select-none">••••••••</span></>
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SIM & eSIM */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#E8733A]" /> SIM & eSIM
        </h2>
        <select className="border rounded-md px-3 py-2 text-sm bg-white mb-4" value={simCountry} onChange={(e) => setSIMCountry(e.target.value)}>
          {Object.keys(simOptions).map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(simOptions[simCountry] || []).map((sim, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1A3C5E]/20 to-[#E8733A]/20 flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5 text-[#1A3C5E]" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[#1A3C5E] text-sm">{sim.carrier}</h3>
                  {sim.esim && <Badge className="bg-purple-100 text-purple-700 text-xs">eSIM</Badge>}
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>Data: {sim.data}</p>
                  <p>Validity: {sim.validity}</p>
                </div>
                <p className="text-lg font-bold text-[#E8733A] mt-2">{sim.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Offline Downloads */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-[#E8733A]" /> Offline Downloads
        </h2>
        <div className="space-y-3">
          {downloads.map((dl) => (
            <Card key={dl.id}>
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center shrink-0">
                    <Cloud className="w-5 h-5 text-[#1A3C5E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-[#1A3C5E] text-sm">{dl.name}</h3>
                      <span className="text-xs text-gray-400">{dl.size}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{dl.region}</p>
                    {dl.progress > 0 && dl.progress < 100 && (
                      <Progress value={dl.progress} className="h-1.5" />
                    )}
                  </div>
                  <div className="shrink-0">
                    {dl.progress === 100 ? (
                      <Badge className="bg-green-100 text-green-700 text-xs"><Check className="w-3 h-3 mr-1" />Downloaded</Badge>
                    ) : dl.progress > 0 ? (
                      <span className="text-xs text-[#E8733A] font-medium">{dl.progress}%</span>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs text-[#E8733A] border-[#E8733A]/30" onClick={() => startDownload(dl.id)}>
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* VPN Guide */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#E8733A]" /> VPN Guide
        </h2>
        <Card>
          <CardContent className="pt-4 space-y-4">
            <select className="w-full sm:w-64 border rounded-md px-3 py-2 text-sm bg-white" value={vpnCountry} onChange={(e) => setVpnCountry(e.target.value)}>
              <option value="">Select country...</option>
              {Object.keys(vpnData).map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            {vpnCountry && vpnData[vpnCountry] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className={cn('border', vpnStatusConfig[vpnData[vpnCountry].status].color)}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{vpnStatusConfig[vpnData[vpnCountry].status].emoji}</span>
                      <div>
                        <p className="font-semibold text-[#1A3C5E]">VPN Status: {vpnStatusConfig[vpnData[vpnCountry].status].label}</p>
                        <p className="text-xs text-gray-500">{vpnCountry}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{vpnData[vpnCountry].recommendation}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
