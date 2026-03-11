'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Lock, Bell, Map, Languages, AlertTriangle,
  Camera, Save, Trash2, Eye, EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    bio: 'Solo traveler and mountain enthusiast. Exploring India one chai stall at a time.',
  });

  const [privacy, setPrivacy] = useState({
    locationSharing: true,
    publicProfile: true,
    showTravelStats: true,
    allowPartnerRequests: true,
  });

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    tripReminders: true,
    badgeAlerts: true,
    partnerMessages: true,
  });

  const [mapPrefs, setMapPrefs] = useState({
    theme: 'daylight',
    view: '2D',
    distanceUnit: 'km',
  });

  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your profile, preferences, and account</p>
      </motion.div>

      {/* Profile */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1A3C5E] flex items-center gap-2 text-base">
              <User className="w-5 h-5 text-[#E8733A]" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1A3C5E] to-[#E8733A] flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#E8733A] text-white flex items-center justify-center shadow-md hover:bg-[#d4642e] transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Upload a photo (max 5MB)</p>
                <p className="text-xs text-gray-400">JPG, PNG, or WebP</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Full Name</label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Email</label>
              <Input value={profile.email} disabled className="bg-gray-50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bio</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] focus:ring-2 focus:ring-[#1A3C5E]/20 focus:border-[#1A3C5E] resize-none"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
            <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2" onClick={handleSave}>
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>
      </motion.section>

      {/* Privacy */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1A3C5E] flex items-center gap-2 text-base">
              <Lock className="w-5 h-5 text-[#E8733A]" /> Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              { key: 'locationSharing' as const, label: 'Location Sharing', desc: 'Share your live location with travel partners' },
              { key: 'publicProfile' as const, label: 'Public Profile', desc: 'Allow other travelers to view your profile' },
              { key: 'showTravelStats' as const, label: 'Show Travel Stats', desc: 'Display your travel statistics publicly' },
              { key: 'allowPartnerRequests' as const, label: 'Allow Partner Requests', desc: 'Let others send you travel partner requests' },
            ] as const).map((item, i) => (
              <div key={item.key}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1A3C5E]">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={privacy[item.key]}
                    onCheckedChange={(v) => setPrivacy({ ...privacy, [item.key]: v })}
                  />
                </div>
                {i < 3 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.section>

      {/* Notifications */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1A3C5E] flex items-center gap-2 text-base">
              <Bell className="w-5 h-5 text-[#E8733A]" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              { key: 'push' as const, label: 'Push Notifications', desc: 'Receive push notifications on your device' },
              { key: 'email' as const, label: 'Email Notifications', desc: 'Receive email updates and summaries' },
              { key: 'tripReminders' as const, label: 'Trip Reminders', desc: 'Get reminded about upcoming trips and deadlines' },
              { key: 'badgeAlerts' as const, label: 'Badge Alerts', desc: 'Notifications when you earn new badges' },
              { key: 'partnerMessages' as const, label: 'Partner Messages', desc: 'Alerts for new messages from travel partners' },
            ] as const).map((item, i) => (
              <div key={item.key}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1A3C5E]">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                  />
                </div>
                {i < 4 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.section>

      {/* Map Preferences */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1A3C5E] flex items-center gap-2 text-base">
              <Map className="w-5 h-5 text-[#E8733A]" /> Map Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Default Theme</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 focus:border-[#1A3C5E]"
                value={mapPrefs.theme}
                onChange={(e) => setMapPrefs({ ...mapPrefs, theme: e.target.value })}
              >
                <option value="daylight">Daylight</option>
                <option value="dark-voyage">Dark Voyage</option>
                <option value="terrain">Terrain</option>
                <option value="satellite">Satellite</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-2">Default View</label>
              <div className="flex gap-2">
                {['2D', '3D'].map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={mapPrefs.view === v ? 'default' : 'outline'}
                    className={cn(mapPrefs.view === v ? 'bg-[#1A3C5E] text-white' : 'text-[#1A3C5E] border-[#1A3C5E]/30')}
                    onClick={() => setMapPrefs({ ...mapPrefs, view: v })}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-2">Distance Unit</label>
              <div className="flex gap-4">
                {[{ value: 'km', label: 'Kilometers (km)' }, { value: 'miles', label: 'Miles (mi)' }].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="distanceUnit"
                      value={opt.value}
                      checked={mapPrefs.distanceUnit === opt.value}
                      onChange={() => setMapPrefs({ ...mapPrefs, distanceUnit: opt.value })}
                      className="accent-[#E8733A]"
                    />
                    <span className="text-sm text-[#1A3C5E]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Language */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1A3C5E] flex items-center gap-2 text-base">
              <Languages className="w-5 h-5 text-[#E8733A]" /> Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="text-xs text-gray-500 block mb-1">App Language</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 focus:border-[#1A3C5E]"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            </select>
          </CardContent>
        </Card>
      </motion.section>

      {/* Danger Zone */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2 text-base">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                Change Password
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Delete Account</p>
                <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
