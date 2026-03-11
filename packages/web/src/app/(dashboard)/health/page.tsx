'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Syringe, Shield, Search, Pill, Globe, Plus, Check, X,
  ChevronDown, ChevronUp, Clock, MapPin, Phone, Edit,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const mockVaccinations = [
  { id: 1, name: 'COVID-19', date: '2024-03-15', brand: 'Covishield (AstraZeneca)', nextBooster: '2026-09-15' },
  { id: 2, name: 'Yellow Fever', date: '2023-11-20', brand: 'Stamaril', nextBooster: '2033-11-20' },
  { id: 3, name: 'Hepatitis A', date: '2023-06-10', brand: 'Havrix', nextBooster: '2024-06-10' },
  { id: 4, name: 'Typhoid', date: '2024-01-05', brand: 'Typhim Vi', nextBooster: '2026-01-05' },
];

const countryRequirements: Record<string, { required: string[]; recommended: string[] }> = {
  Thailand: { required: [], recommended: ['Hepatitis A', 'Typhoid', 'Japanese Encephalitis', 'Rabies'] },
  Kenya: { required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Typhoid', 'Malaria Prophylaxis', 'Rabies', 'Meningitis'] },
  Brazil: { required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Typhoid', 'Rabies', 'Malaria Prophylaxis'] },
  India: { required: [], recommended: ['Hepatitis A', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Cholera'] },
  'Saudi Arabia': { required: ['Meningitis ACWY', 'COVID-19'], recommended: ['Hepatitis A', 'Typhoid', 'Polio'] },
};

const mockInsurance = {
  policyNumber: 'TRV-2026-IN-48291',
  insurer: 'ICICI Lombard Travel Shield',
  startDate: '2026-03-01',
  endDate: '2026-12-31',
  coverageTypes: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss', 'Flight Delay', 'Adventure Sports', 'COVID Coverage'],
};

const mockPharmacies = [
  { id: 1, name: 'Apollo Pharmacy', address: 'MG Road, Bangalore', is24hr: true, distance: '0.8 km' },
  { id: 2, name: 'MedPlus', address: 'Koramangala, Bangalore', is24hr: false, distance: '1.2 km' },
  { id: 3, name: 'Netmeds Store', address: 'Indiranagar, Bangalore', is24hr: true, distance: '2.1 km' },
];

const drugTranslations: Record<string, Record<string, string>> = {
  Paracetamol: { Japan: 'Acetaminophen (Calonal)', USA: 'Acetaminophen (Tylenol)', Germany: 'Paracetamol (Ben-u-ron)', Thailand: 'Sara / Tylenol' },
  Ibuprofen: { Japan: 'Ibuprofen (Eve)', USA: 'Ibuprofen (Advil/Motrin)', Germany: 'Ibuprofen (Dolormin)', Thailand: 'Brufen / Nurofen' },
  Cetirizine: { Japan: 'Cetirizine (Zyrtec)', USA: 'Cetirizine (Zyrtec)', Germany: 'Cetirizin (Zyrtec)', Thailand: 'Incidal / Zyrtec' },
};

export default function HealthPage() {
  const [vaccinations, setVaccinations] = useState(mockVaccinations);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVax, setNewVax] = useState({ name: '', date: '', brand: '', nextBooster: '' });
  const [selectedCountry, setSelectedCountry] = useState('');
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [drugName, setDrugName] = useState('');
  const [drugCountry, setDrugCountry] = useState('');

  const handleAddVaccination = () => {
    if (newVax.name && newVax.date) {
      setVaccinations([...vaccinations, { id: Date.now(), ...newVax }]);
      setNewVax({ name: '', date: '', brand: '', nextBooster: '' });
      setShowAddForm(false);
    }
  };

  const drugResult = drugName && drugCountry ? drugTranslations[drugName]?.[drugCountry] : null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Health & Vaccination</h1>
        <p className="text-gray-500 text-sm">Track vaccinations, insurance, and health resources</p>
      </motion.div>

      {/* My Vaccinations */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1A3C5E] flex items-center gap-2">
            <Syringe className="w-5 h-5 text-[#E8733A]" /> My Vaccinations
          </h2>
          <Button size="sm" className="bg-[#E8733A] hover:bg-[#d4642e] gap-1" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'Cancel' : 'Add Vaccination'}
          </Button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Card className="mb-4 border-[#E8733A]/30">
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="Vaccine Name" value={newVax.name} onChange={(e) => setNewVax({ ...newVax, name: e.target.value })} />
                    <Input type="date" placeholder="Date" value={newVax.date} onChange={(e) => setNewVax({ ...newVax, date: e.target.value })} />
                    <Input placeholder="Brand" value={newVax.brand} onChange={(e) => setNewVax({ ...newVax, brand: e.target.value })} />
                    <Input type="date" placeholder="Next Booster" value={newVax.nextBooster} onChange={(e) => setNewVax({ ...newVax, nextBooster: e.target.value })} />
                  </div>
                  <Button className="bg-[#1A3C5E] hover:bg-[#15334f]" onClick={handleAddVaccination}>Save Vaccination</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vaccinations.map((vax, i) => (
            <motion.div key={vax.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1A3C5E] text-sm">{vax.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Brand: {vax.brand}</p>
                      <p className="text-xs text-gray-500">Date: {new Date(vax.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Booster: {vax.nextBooster ? new Date(vax.nextBooster).toLocaleDateString() : 'N/A'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Country Requirements */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#E8733A]" /> Country Requirements
        </h2>
        <Card>
          <CardContent className="pt-4 space-y-4">
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 focus:border-[#1A3C5E]"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select a country...</option>
              {Object.keys(countryRequirements).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {selectedCountry && countryRequirements[selectedCountry] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Required</p>
                  <div className="flex flex-wrap gap-2">
                    {countryRequirements[selectedCountry].required.length === 0 ? (
                      <Badge className="bg-green-100 text-green-700 text-xs">No mandatory vaccines</Badge>
                    ) : (
                      countryRequirements[selectedCountry].required.map((v) => (
                        <Badge key={v} className="bg-red-100 text-red-700 text-xs">{v}</Badge>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Recommended</p>
                  <div className="flex flex-wrap gap-2">
                    {countryRequirements[selectedCountry].recommended.map((v) => (
                      <Badge key={v} className="bg-yellow-100 text-yellow-700 text-xs">{v}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* Travel Insurance */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#E8733A]" /> Travel Insurance
        </h2>
        <Card className="border-[#1A3C5E]/20">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Policy Number</p>
                <p className="font-mono text-sm font-semibold text-[#1A3C5E]">{mockInsurance.policyNumber}</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1 text-[#1A3C5E] border-[#1A3C5E]/30">
                <Edit className="w-3 h-3" /> Edit
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-1">{mockInsurance.insurer}</p>
            <p className="text-xs text-gray-500 mb-4">{mockInsurance.startDate} to {mockInsurance.endDate}</p>
            <Separator className="mb-3" />
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Coverage</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mockInsurance.coverageTypes.map((c) => (
                <div key={c} className="flex items-center gap-1.5 text-xs text-gray-700">
                  <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> {c}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Pharmacy Finder */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-[#E8733A]" /> Pharmacy Finder
        </h2>
        <div className="mb-4">
          <Input
            placeholder="Search by location..."
            value={pharmacySearch}
            onChange={(e) => setPharmacySearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mockPharmacies.map((ph) => (
            <Card key={ph.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#1A3C5E] text-sm">{ph.name}</h3>
                  {ph.is24hr && <Badge className="bg-green-100 text-green-700 text-xs">24hr</Badge>}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{ph.address}</p>
                <p className="text-xs text-gray-400 mt-1">{ph.distance} away</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Drug Translator */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-[#E8733A]" /> Drug Translator
        </h2>
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                className="border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 focus:border-[#1A3C5E]"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
              >
                <option value="">Select drug name...</option>
                {Object.keys(drugTranslations).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                className="border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 focus:border-[#1A3C5E]"
                value={drugCountry}
                onChange={(e) => setDrugCountry(e.target.value)}
              >
                <option value="">Select country...</option>
                <option value="Japan">Japan</option>
                <option value="USA">USA</option>
                <option value="Germany">Germany</option>
                <option value="Thailand">Thailand</option>
              </select>
            </div>
            {drugResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-[#1A3C5E]/5 border-[#1A3C5E]/20">
                  <CardContent className="py-3">
                    <p className="text-xs text-gray-500">Generic equivalent in {drugCountry}</p>
                    <p className="text-lg font-semibold text-[#1A3C5E]">{drugResult}</p>
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
