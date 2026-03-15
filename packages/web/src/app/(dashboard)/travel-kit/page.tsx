'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Search, Clock, Shield, Plug, Scale, Phone, DollarSign,
  Camera, Plane, Wine, Shirt, Car, AlertTriangle, Sun, Sunset, Sunrise,
  Zap, Info, ChevronDown, MapPin, Cigarette, ShoppingBag,
  HandCoins, Landmark, Heart, Smartphone, Wifi, Signal,
  FileText, Pill, CheckCircle, XCircle, AlertCircle, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/* ───────────────────────── Types ───────────────────────── */

interface CountryData {
  code: string;
  name: string;
  flag: string;
  capital: string;
  region: string;
  callingCode: string;
  currency: { code: string; name: string; symbol: string };
  timezone: {
    name: string;
    utcOffset: number;
    dst: boolean;
    sunrise: string;
    sunset: string;
  };
  visa: {
    type: 'Visa Free' | 'Visa on Arrival' | 'eVisa Required' | 'Embassy Visa Required' | 'Schengen Visa Required';
    color: string;
    maxDays: number;
    processingTime: string;
    passportValidity: string;
    entryRestrictions: string[];
    documentsRequired: string[];
  };
  plug: {
    types: string[];
    voltage: string;
    frequency: string;
    adapter: string;
  };
  laws: {
    driving: { side: string; license: string; speedLimits: string };
    alcohol: { legalAge: number; publicDrinking: string };
    photography: string;
    drones: string;
    lgbtq: { safety: string; color: string };
    dressCode: string;
    tipping: string;
    bargaining: string;
    smoking: string;
    importRestrictions: string;
    drugs: string;
  };
  emergency: {
    police: string;
    ambulance: string;
    fire: string;
    universal: string;
    other: { label: string; number: string }[];
  };
  sim: {
    esimSupported: boolean;
    providers: { name: string; type: 'eSIM' | 'Local SIM'; dataPrice: string; coverage: string; speed: string }[];
    registrationRequired: boolean;
    registrationNote: string;
    bestFor: string;
  };
}

/* ───────────────────────── Comprehensive Mock Data ───────────────────────── */

const allCountries: CountryData[] = [
  {
    code: 'US', name: 'United States', flag: '\u{1F1FA}\u{1F1F8}', capital: 'Washington D.C.', region: 'North America', callingCode: '+1',
    currency: { code: 'USD', name: 'US Dollar', symbol: '$' },
    timezone: { name: 'EST/PST (multiple)', utcOffset: -5, dst: true, sunrise: '6:45 AM', sunset: '7:30 PM' },
    visa: {
      type: 'Embassy Visa Required', color: 'red', maxDays: 180, processingTime: '3-5 weeks',
      passportValidity: 'Must be valid for 6 months beyond stay',
      entryRestrictions: ['Valid B1/B2 visa required', 'ESTA for Visa Waiver countries only', 'Proof of return ticket required', 'Sufficient funds must be demonstrated'],
      documentsRequired: ['Valid passport', 'DS-160 confirmation', 'Visa appointment letter', 'Financial documents', 'Travel itinerary', 'Passport-size photos'],
    },
    plug: { types: ['A', 'B'], voltage: '120V', frequency: '60Hz', adapter: 'Bring Type A/B adapter. Indian devices may need voltage converter (India uses 230V).' },
    laws: {
      driving: { side: 'Right', license: 'IDP recommended', speedLimits: '25-70 mph (40-112 km/h)' },
      alcohol: { legalAge: 21, publicDrinking: 'Illegal in most states' },
      photography: 'Generally unrestricted in public. No photos of military installations.',
      drones: 'FAA registration for >250g. No-fly near airports.',
      lgbtq: { safety: 'Generally safe, varies by state', color: 'green' },
      dressCode: 'No specific dress code. Casual widely accepted.',
      tipping: '15-20% at restaurants, $1-2 for service staff',
      bargaining: 'Not common except at flea markets',
      smoking: 'Banned in most indoor public spaces',
      importRestrictions: 'No fresh produce, meat, or dairy. Declare items over $800.',
      drugs: 'Federal law prohibits marijuana. Prescription meds require original packaging with doctor\'s note. Some states allow recreational cannabis.',
    },
    emergency: { police: '911', ambulance: '911', fire: '911', universal: '911', other: [{ label: 'Poison Control', number: '1-800-222-1222' }, { label: 'Suicide Prevention', number: '988' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'T-Mobile Tourist Plan', type: 'Local SIM', dataPrice: '$30/3 weeks - unlimited', coverage: 'Excellent nationwide', speed: '5G/4G LTE' },
        { name: 'Airalo USA', type: 'eSIM', dataPrice: '$5/1GB - $18/5GB', coverage: 'Good in urban areas', speed: '4G LTE' },
        { name: 'Holafly USA', type: 'eSIM', dataPrice: '$19/5 days unlimited', coverage: 'Very good nationwide', speed: '4G LTE' },
      ],
      registrationRequired: false, registrationNote: 'No registration needed for prepaid SIMs.',
      bestFor: 'eSIM recommended for short visits. T-Mobile Tourist Plan for extended stays.',
    },
  },
  {
    code: 'GB', name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}', capital: 'London', region: 'Europe', callingCode: '+44',
    currency: { code: 'GBP', name: 'British Pound', symbol: '\u{00A3}' },
    timezone: { name: 'GMT/BST', utcOffset: 0, dst: true, sunrise: '6:15 AM', sunset: '8:20 PM' },
    visa: {
      type: 'Embassy Visa Required', color: 'red', maxDays: 180, processingTime: '3-4 weeks',
      passportValidity: 'Must be valid for duration of stay',
      entryRestrictions: ['Standard Visitor Visa required for Indian nationals', 'Must prove intent to leave UK', 'No working on visitor visa', 'TB test certificate may be required'],
      documentsRequired: ['Valid passport', 'Visa application form', 'Financial proof (bank statements)', 'Accommodation details', 'Travel insurance', 'Biometric appointment'],
    },
    plug: { types: ['G'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type G adapter. Voltage is compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Left', license: 'IDP valid 12 months', speedLimits: '30-70 mph (48-112 km/h)' },
      alcohol: { legalAge: 18, publicDrinking: 'Legal in most areas, some cities have bans' },
      photography: 'Unrestricted. GDPR applies to identifiable individuals.',
      drones: 'CAA registration required. Max 120m altitude.',
      lgbtq: { safety: 'Very safe, strong legal protections', color: 'green' },
      dressCode: 'No specific dress code. Smart casual for restaurants.',
      tipping: '10-15% at restaurants (check if service charge included)',
      bargaining: 'Not common',
      smoking: 'Banned in all enclosed public spaces',
      importRestrictions: 'No meat/dairy from non-EU. Limited alcohol/tobacco allowance.',
      drugs: 'All recreational drugs illegal. Prescription meds need letter from doctor. Cannabis is Class B controlled substance.',
    },
    emergency: { police: '999', ambulance: '999', fire: '999', universal: '112', other: [{ label: 'Non-Emergency Police', number: '101' }, { label: 'NHS Direct', number: '111' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'Three UK Tourist SIM', type: 'Local SIM', dataPrice: '\u{00A3}10/12GB (30 days)', coverage: 'Excellent nationwide', speed: '5G/4G' },
        { name: 'Airalo UK', type: 'eSIM', dataPrice: '$4.50/1GB - $16/5GB', coverage: 'Good urban coverage', speed: '4G LTE' },
        { name: 'GiffGaff', type: 'Local SIM', dataPrice: '\u{00A3}10/15GB', coverage: 'Very good (O2 network)', speed: '4G LTE' },
      ],
      registrationRequired: false, registrationNote: 'No ID registration needed for prepaid SIMs.',
      bestFor: 'GiffGaff or Three for best value. eSIM for convenience.',
    },
  },
  {
    code: 'TH', name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', capital: 'Bangkok', region: 'Southeast Asia', callingCode: '+66',
    currency: { code: 'THB', name: 'Thai Baht', symbol: '\u{0E3F}' },
    timezone: { name: 'ICT', utcOffset: 7, dst: false, sunrise: '6:20 AM', sunset: '6:15 PM' },
    visa: {
      type: 'Visa on Arrival', color: 'green', maxDays: 30, processingTime: 'On arrival (~30 min)',
      passportValidity: 'Must be valid for at least 6 months',
      entryRestrictions: ['Proof of accommodation required', 'Return ticket mandatory', 'Must carry 10,000 THB equivalent cash', 'Extension possible for 30 more days at immigration office'],
      documentsRequired: ['Valid passport', 'Completed arrival/departure card', '2 recent passport photos', 'Proof of accommodation', 'Return flight ticket'],
    },
    plug: { types: ['A', 'B', 'C', 'O'], voltage: '220V', frequency: '50Hz', adapter: 'Most Indian plugs work directly. Carry universal adapter to be safe.' },
    laws: {
      driving: { side: 'Left', license: 'IDP required', speedLimits: '50-120 km/h' },
      alcohol: { legalAge: 20, publicDrinking: 'No sales 14:00-17:00 and 00:00-11:00' },
      photography: 'No disrespectful photos of royal family or Buddhist images.',
      drones: 'Registration required with CAAT. No-fly over crowds.',
      lgbtq: { safety: 'Relatively tolerant, growing legal protections', color: 'yellow' },
      dressCode: 'Cover shoulders and knees at temples. Remove shoes.',
      tipping: '20-50 THB at restaurants. Not mandatory.',
      bargaining: 'Expected at markets and street vendors',
      smoking: 'Banned at beaches, temples, and public buildings',
      importRestrictions: 'No e-cigarettes. Limited alcohol/tobacco. No Buddha images for export.',
      drugs: 'Extremely strict drug laws. Death penalty for trafficking. Cannabis decriminalized for medical use. All other drugs carry severe penalties.',
    },
    emergency: { police: '191', ambulance: '1669', fire: '199', universal: '1155', other: [{ label: 'Tourist Police', number: '1155' }, { label: 'Immigration', number: '1178' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'AIS Tourist SIM', type: 'Local SIM', dataPrice: '\u{0E3F}299/15GB (8 days)', coverage: 'Best nationwide coverage', speed: '5G/4G' },
        { name: 'TrueMove H', type: 'Local SIM', dataPrice: '\u{0E3F}199/unlimited (7 days)', coverage: 'Great in cities', speed: '4G LTE' },
        { name: 'Airalo Thailand', type: 'eSIM', dataPrice: '$5/1GB - $14.50/5GB', coverage: 'Good urban areas', speed: '4G LTE' },
      ],
      registrationRequired: true, registrationNote: 'Passport required for SIM registration at point of sale.',
      bestFor: 'AIS Tourist SIM from airport for best coverage. eSIM if you want to avoid registration.',
    },
  },
  {
    code: 'JP', name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', capital: 'Tokyo', region: 'East Asia', callingCode: '+81',
    currency: { code: 'JPY', name: 'Japanese Yen', symbol: '\u{00A5}' },
    timezone: { name: 'JST', utcOffset: 9, dst: false, sunrise: '5:30 AM', sunset: '6:45 PM' },
    visa: {
      type: 'Embassy Visa Required', color: 'orange', maxDays: 90, processingTime: '5-7 business days',
      passportValidity: 'Must be valid for duration of stay',
      entryRestrictions: ['Return ticket required', 'Proof of sufficient funds', 'Visit Japan Web registration recommended', 'COVID-era restrictions fully lifted'],
      documentsRequired: ['Valid passport', 'Visa application form', 'Photo (4.5cm x 4.5cm)', 'Schedule of stay', 'Letter of guarantee/invitation', 'Financial proof'],
    },
    plug: { types: ['A', 'B'], voltage: '100V', frequency: '50/60Hz', adapter: 'Bring Type A adapter AND voltage converter. Japan uses only 100V.' },
    laws: {
      driving: { side: 'Left', license: 'IDP (Geneva Convention) required', speedLimits: '30-100 km/h' },
      alcohol: { legalAge: 20, publicDrinking: 'Legal. Vending machines sell alcohol.' },
      photography: 'No photos in many museums/temples. Ask permission for people.',
      drones: 'Registration required. Restricted in populated areas.',
      lgbtq: { safety: 'Generally safe, limited legal recognition', color: 'yellow' },
      dressCode: 'Business formal common. Modest at temples.',
      tipping: 'Not expected and can be considered rude',
      bargaining: 'Not practiced',
      smoking: 'Designated areas only. Fines for street smoking.',
      importRestrictions: 'No firearms, drugs, counterfeit goods. Medication limits apply.',
      drugs: 'Zero tolerance. Even small amounts of marijuana carry prison sentences. Some cold medicines and ADHD medications (containing pseudoephedrine/amphetamines) are banned. Bring Yakkan Shoumei (import certificate) for prescription meds.',
    },
    emergency: { police: '110', ambulance: '119', fire: '119', universal: '110', other: [{ label: 'Japan Helpline', number: '0570-064-211' }, { label: 'AMDA Medical', number: '03-5285-8088' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'Ubigi Japan', type: 'eSIM', dataPrice: '$9/3GB (30 days)', coverage: 'Excellent (Docomo/SoftBank)', speed: '4G LTE/5G' },
        { name: 'IIJmio Travel SIM', type: 'Local SIM', dataPrice: '\u{00A5}1,600/2GB', coverage: 'Very good nationwide', speed: '4G LTE' },
        { name: 'Sakura Mobile', type: 'Local SIM', dataPrice: '\u{00A5}3,500/unlimited (7 days)', coverage: 'Excellent', speed: '4G/5G' },
      ],
      registrationRequired: false, registrationNote: 'No registration for tourist SIMs. Available at airports and convenience stores.',
      bestFor: 'eSIM (Ubigi) for instant connectivity. Pocket WiFi also very popular in Japan.',
    },
  },
  {
    code: 'AE', name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}', capital: 'Abu Dhabi', region: 'Middle East', callingCode: '+971',
    currency: { code: 'AED', name: 'UAE Dirham', symbol: '\u{062F}.\u{0625}' },
    timezone: { name: 'GST', utcOffset: 4, dst: false, sunrise: '6:10 AM', sunset: '6:30 PM' },
    visa: {
      type: 'Visa on Arrival', color: 'green', maxDays: 30, processingTime: 'On arrival (~15 min)',
      passportValidity: 'Must be valid for at least 6 months',
      entryRestrictions: ['Free 30-day visa on arrival for Indian passport holders', 'Extendable for additional 30 days', 'Must have hotel booking or sponsor', 'No Israeli stamps (relaxed since 2020 Abraham Accords)'],
      documentsRequired: ['Valid passport', 'Return ticket', 'Hotel reservation or host details', 'Sufficient funds', 'Travel insurance recommended'],
    },
    plug: { types: ['C', 'D', 'G'], voltage: '220V', frequency: '50Hz', adapter: 'Indian Type D plugs work in many outlets. Carry Type G adapter for UK-style sockets.' },
    laws: {
      driving: { side: 'Right', license: 'IDP required', speedLimits: '40-140 km/h' },
      alcohol: { legalAge: 21, publicDrinking: 'Only in licensed venues. Zero tolerance DUI.' },
      photography: 'No photos of government buildings, military, or people without consent.',
      drones: 'GCAA permit required. Strict no-fly zones.',
      lgbtq: { safety: 'Same-sex relations are illegal. Exercise extreme caution.', color: 'red' },
      dressCode: 'Modest clothing expected. Cover shoulders and knees in public.',
      tipping: '10-15% at restaurants. Round up for taxis.',
      bargaining: 'Expected at souks and traditional markets',
      smoking: 'Banned in enclosed public spaces. Designated areas in malls.',
      importRestrictions: 'No pork, alcohol (duty free limits), or drugs. Prescription meds need documentation.',
      drugs: 'Extreme zero-tolerance policy. Death penalty for trafficking. Even trace amounts can lead to 4-year prison. Codeine, tramadol, and some antidepressants require prior approval. Carry prescriptions with attested doctor letter.',
    },
    emergency: { police: '999', ambulance: '998', fire: '997', universal: '112', other: [{ label: 'Coastguard', number: '996' }, { label: 'Electricity Emergency', number: '991' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'du Tourist SIM', type: 'Local SIM', dataPrice: 'AED 55/2GB (14 days)', coverage: 'Excellent nationwide', speed: '5G/4G' },
        { name: 'Etisalat Visitor Line', type: 'Local SIM', dataPrice: 'AED 75/3GB (28 days)', coverage: 'Excellent nationwide', speed: '5G/4G' },
        { name: 'Airalo UAE', type: 'eSIM', dataPrice: '$4.50/1GB - $14/5GB', coverage: 'Very good', speed: '4G LTE' },
      ],
      registrationRequired: true, registrationNote: 'Passport and Emirates ID (for residents) or passport copy for tourists required.',
      bestFor: 'du Tourist SIM from airport is convenient. eSIM if your phone supports it.',
    },
  },
  {
    code: 'FR', name: 'France', flag: '\u{1F1EB}\u{1F1F7}', capital: 'Paris', region: 'Europe', callingCode: '+33',
    currency: { code: 'EUR', name: 'Euro', symbol: '\u{20AC}' },
    timezone: { name: 'CET', utcOffset: 1, dst: true, sunrise: '7:00 AM', sunset: '9:15 PM' },
    visa: {
      type: 'Schengen Visa Required', color: 'orange', maxDays: 90, processingTime: '2-3 weeks',
      passportValidity: 'Must be valid 3 months beyond intended departure from Schengen area',
      entryRestrictions: ['Schengen visa valid for 26 countries', '90 days within 180-day period', 'Travel insurance with 30,000 EUR coverage mandatory', 'Must enter through the Schengen country that issued visa first'],
      documentsRequired: ['Valid passport (10 years old max)', 'Schengen visa application form', 'Travel insurance certificate', 'Flight reservation', 'Accommodation proof', 'Bank statements (3 months)', 'Cover letter'],
    },
    plug: { types: ['C', 'E'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type C/E adapter. Voltage compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Right', license: 'IDP required', speedLimits: '50-130 km/h' },
      alcohol: { legalAge: 18, publicDrinking: 'Legal in most public spaces' },
      photography: 'Generally unrestricted. Cannot publish photos of people without consent.',
      drones: 'Registration required for >800g. No-fly in Paris.',
      lgbtq: { safety: 'Very safe, strong legal protections', color: 'green' },
      dressCode: 'No face coverings in public (burqa ban). Smart casual dining.',
      tipping: 'Service charge included. Small tip (5-10%) appreciated.',
      bargaining: 'Not common except at flea markets',
      smoking: 'Banned in enclosed public spaces. Common on terraces.',
      importRestrictions: 'EU limits on tobacco/alcohol. No counterfeit goods.',
      drugs: 'All drugs illegal for personal use. Cannabis most commonly used but carries fines. Prescription medications require French or EU prescription or doctor\'s letter.',
    },
    emergency: { police: '17', ambulance: '15', fire: '18', universal: '112', other: [{ label: 'SAMU (Medical)', number: '15' }, { label: 'SOS Doctor', number: '01 47 07 77 77' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'Orange Holiday SIM', type: 'Local SIM', dataPrice: '\u{20AC}39.99/20GB (14 days)', coverage: 'Excellent + EU roaming', speed: '4G/5G' },
        { name: 'Free Mobile Tourist', type: 'Local SIM', dataPrice: '\u{20AC}19.99/unlimited (30 days)', coverage: 'Very good in cities', speed: '4G/5G' },
        { name: 'Airalo Europe', type: 'eSIM', dataPrice: '$5/1GB - $20/5GB', coverage: 'Good (multi-country)', speed: '4G LTE' },
      ],
      registrationRequired: false, registrationNote: 'No ID required for prepaid SIMs. Available at tabacs and phone shops.',
      bestFor: 'Orange Holiday for reliability. Airalo eSIM for multi-country European travel.',
    },
  },
  {
    code: 'AU', name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', capital: 'Canberra', region: 'Oceania', callingCode: '+61',
    currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    timezone: { name: 'AEST/AWST (multiple)', utcOffset: 10, dst: true, sunrise: '5:55 AM', sunset: '7:40 PM' },
    visa: {
      type: 'eVisa Required', color: 'orange', maxDays: 90, processingTime: '1-4 weeks',
      passportValidity: 'Must be valid for duration of stay',
      entryRestrictions: ['eVisitor (subclass 651) or ETA (subclass 601)', 'No work permitted on tourist visa', 'Character requirements apply', 'Health insurance strongly recommended'],
      documentsRequired: ['Valid passport', 'Online visa application (ImmiAccount)', 'Passport photos', 'Travel itinerary', 'Financial evidence', 'Health examination (if required)'],
    },
    plug: { types: ['I'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type I adapter. Voltage compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Left', license: 'IDP required', speedLimits: '50-130 km/h' },
      alcohol: { legalAge: 18, publicDrinking: 'Banned in most public areas' },
      photography: 'Unrestricted in public. Some indigenous sites restrict photography.',
      drones: 'CASA registration required. No-fly near airports, people, emergencies.',
      lgbtq: { safety: 'Very safe, marriage equality since 2017', color: 'green' },
      dressCode: 'Very casual. Thongs (flip-flops) widely acceptable.',
      tipping: 'Not expected. 10% for exceptional service.',
      bargaining: 'Not practiced',
      smoking: 'Strict bans in public spaces, outdoor dining, beaches.',
      importRestrictions: 'Extremely strict biosecurity. Declare ALL food, plant, animal products.',
      drugs: 'All recreational drugs illegal federally. ACT has decriminalized small amounts of cannabis. Prescription meds need original packaging and doctor\'s letter. Declare all medications at customs.',
    },
    emergency: { police: '000', ambulance: '000', fire: '000', universal: '112', other: [{ label: 'Poisons Info', number: '13 11 26' }, { label: 'SES Emergency', number: '132 500' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'Optus Prepaid', type: 'Local SIM', dataPrice: 'A$30/40GB (28 days)', coverage: 'Very good nationwide', speed: '4G/5G' },
        { name: 'Telstra Prepaid', type: 'Local SIM', dataPrice: 'A$30/30GB (28 days)', coverage: 'Best regional coverage', speed: '4G/5G' },
        { name: 'Airalo Australia', type: 'eSIM', dataPrice: '$6/1GB - $18/5GB', coverage: 'Good in cities', speed: '4G LTE' },
      ],
      registrationRequired: true, registrationNote: 'ID verification required. Passport accepted for tourists.',
      bestFor: 'Telstra for outback/regional travel. Optus for city stays. eSIM for short visits.',
    },
  },
  {
    code: 'SG', name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}', capital: 'Singapore', region: 'Southeast Asia', callingCode: '+65',
    currency: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    timezone: { name: 'SGT', utcOffset: 8, dst: false, sunrise: '7:00 AM', sunset: '7:10 PM' },
    visa: {
      type: 'Visa Free', color: 'green', maxDays: 30, processingTime: 'Stamp on arrival',
      passportValidity: 'Must be valid for at least 6 months',
      entryRestrictions: ['SG Arrival Card must be submitted online within 3 days before arrival', 'Return ticket required', 'Proof of sufficient funds', 'Yellow fever vaccination if from affected area'],
      documentsRequired: ['Valid passport', 'SG Arrival Card (electronic)', 'Return/onward ticket', 'Proof of accommodation'],
    },
    plug: { types: ['G'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type G adapter. Voltage compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Left', license: 'IDP required', speedLimits: '50-90 km/h' },
      alcohol: { legalAge: 18, publicDrinking: 'No public drinking 10:30pm-7:00am (Liquor Control Zones)' },
      photography: 'Generally unrestricted. No photos of military installations.',
      drones: 'Permit required from CAAS. Very restricted.',
      lgbtq: { safety: 'Decriminalized in 2022, improving acceptance', color: 'yellow' },
      dressCode: 'Casual and smart casual. Conservative at places of worship.',
      tipping: 'Not expected. 10% service charge usually added.',
      bargaining: 'Not common except at some markets',
      smoking: 'Banned in most public spaces. Heavy fines.',
      importRestrictions: 'No chewing gum. Strict drug laws (death penalty). Declare >S$20,000.',
      drugs: 'Death penalty for trafficking. Mandatory death for >15g heroin, >30g cocaine, >500g cannabis. Even small amounts lead to lengthy prison. Prescription meds need doctor letter and approval from HSA.',
    },
    emergency: { police: '999', ambulance: '995', fire: '995', universal: '112', other: [{ label: 'Non-Emergency', number: '1800-255-0000' }, { label: 'Health Hotline', number: '1800-333-9999' }] },
    sim: {
      esimSupported: true,
      providers: [
        { name: 'Singtel hi!Tourist', type: 'Local SIM', dataPrice: 'S$15/100GB (5 days)', coverage: 'Excellent nationwide', speed: '5G/4G' },
        { name: 'StarHub Travel SIM', type: 'Local SIM', dataPrice: 'S$18/100GB (7 days)', coverage: 'Excellent', speed: '5G/4G' },
        { name: 'Airalo Singapore', type: 'eSIM', dataPrice: '$4.50/1GB - $12/5GB', coverage: 'Excellent', speed: '4G LTE/5G' },
      ],
      registrationRequired: true, registrationNote: 'Passport required for SIM purchase. Available at Changi Airport on arrival.',
      bestFor: 'Singtel hi!Tourist from Changi Airport. Excellent 5G coverage island-wide.',
    },
  },
];

const homeTimezone = { name: 'IST', utcOffset: 5.5 };

const visaColorMap: Record<string, string> = {
  green: 'bg-green-100 text-green-800 border-green-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red: 'bg-red-100 text-red-800 border-red-200',
};

const visaIconMap: Record<string, React.ReactNode> = {
  green: <CheckCircle className="w-5 h-5 text-green-600" />,
  orange: <AlertCircle className="w-5 h-5 text-orange-600" />,
  red: <XCircle className="w-5 h-5 text-red-600" />,
};

const lgbtqColorMap: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
};

/* ───── Plug Type Visual Data ───── */

const plugTypeInfo: Record<string, { name: string; pins: string; countries: string; svg: string }> = {
  A: { name: 'Type A', pins: '2 flat parallel', countries: 'US, Canada, Japan, Mexico', svg: '||' },
  B: { name: 'Type B', pins: '2 flat + 1 round ground', countries: 'US, Canada, Mexico', svg: '||o' },
  C: { name: 'Type C', pins: '2 round pins', countries: 'Europe, S. America, Asia', svg: 'oo' },
  D: { name: 'Type D', pins: '3 large round pins (triangle)', countries: 'India, Nepal, Sri Lanka', svg: 'ooo' },
  E: { name: 'Type E', pins: '2 round + ground socket', countries: 'France, Belgium, Poland', svg: 'oo+' },
  F: { name: 'Type F', pins: '2 round + side ground clips', countries: 'Germany, Europe', svg: 'oo=' },
  G: { name: 'Type G', pins: '3 rectangular (fused)', countries: 'UK, Ireland, Singapore, UAE', svg: '=||' },
  H: { name: 'Type H', pins: '3 pins (V-shape)', countries: 'Israel', svg: 'v-o' },
  I: { name: 'Type I', pins: '2 angled flat + ground', countries: 'Australia, NZ, China, Argentina', svg: '/\\o' },
  J: { name: 'Type J', pins: '3 round pins', countries: 'Switzerland, Liechtenstein', svg: 'ooo' },
  K: { name: 'Type K', pins: '3 round pins', countries: 'Denmark, Greenland', svg: 'ooo' },
  L: { name: 'Type L', pins: '3 round in-line', countries: 'Italy, Chile', svg: 'o-o-o' },
  M: { name: 'Type M', pins: '3 large round pins', countries: 'South Africa, India (large)', svg: 'OOO' },
  N: { name: 'Type N', pins: '3 round pins', countries: 'Brazil, South Africa', svg: 'ooo' },
  O: { name: 'Type O', pins: '3 round pins', countries: 'Thailand', svg: 'ooo' },
};

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ───────────────────────── Loading Skeleton ───────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded-lg" />
      <div className="h-4 w-96 bg-gray-100 rounded" />
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="h-14 bg-gray-100 rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-100 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="h-10 bg-gray-100 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ───────────────────────── Main Page Component ───────────────────────── */

export default function TravelKitPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('visa');
  const [isLoading, setIsLoading] = useState(true);
  const [passportExpiry, setPassportExpiry] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return allCountries;
    const q = searchQuery.toLowerCase();
    return allCountries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const country = allCountries.find((c) => c.code === selectedCode);

  const getLocalTime = (utcOffset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    return new Date(utc + utcOffset * 3600000);
  };

  const formatClock = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const homeTime = getLocalTime(homeTimezone.utcOffset);
  const destTime = country ? getLocalTime(country.timezone.utcOffset) : null;
  const hoursDiff = country ? Math.abs(homeTimezone.utcOffset - country.timezone.utcOffset) : 0;
  const jetLagDays = Math.ceil(hoursDiff / 2);

  const passportValid = useMemo(() => {
    if (!passportExpiry || !country) return null;
    const expiry = new Date(passportExpiry);
    const now = new Date();
    const monthsRemaining = (expiry.getFullYear() - now.getFullYear()) * 12 + (expiry.getMonth() - now.getMonth());
    const sixMonthsOk = monthsRemaining >= 6;
    const threeMonthsOk = monthsRemaining >= 3;
    const durationOk = expiry > now;
    const requirement = country.visa.passportValidity.toLowerCase();
    const isOk = requirement.includes('6 months') ? sixMonthsOk : requirement.includes('3 months') ? threeMonthsOk : durationOk;
    return { isOk, monthsRemaining, expiryDate: expiry };
  }, [passportExpiry, country]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#E8733A] animate-spin" />
          <span className="text-gray-500">Loading Travel Kit...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-[#1A3C5E]">International Travel Kit</h1>
        <p className="text-gray-500 mt-1">Everything you need to know before traveling to any country</p>
      </motion.div>

      {/* Country Selector */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <Card className="border-2 border-[#1A3C5E]/20 shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A3C5E] to-[#E8733A] flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A3C5E]">Country Explorer</h2>
                <p className="text-sm text-gray-500">Select a destination for comprehensive travel information</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search countries by name, code, or capital..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-[#E8733A]"
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 relative"
                >
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1A3C5E]/5 transition-colors text-left',
                        selectedCode === c.code && 'bg-[#E8733A]/10'
                      )}
                      onClick={() => { setSelectedCode(c.code); setSearchQuery(''); setShowDropdown(false); }}
                    >
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <p className="font-semibold text-[#1A3C5E]">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.capital} &middot; {c.region}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-xs">{c.code}</Badge>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-400">No countries found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick select chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {allCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setSelectedCode(c.code); setShowDropdown(false); setSearchQuery(''); }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedCode === c.code
                      ? 'bg-[#E8733A] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Country Details */}
      <AnimatePresence mode="wait">
        {country && (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Country Header Banner */}
            <Card className="bg-gradient-to-r from-[#1A3C5E] to-[#2a5a87] text-white border-0 overflow-hidden">
              <CardContent className="py-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <span className="text-7xl">{country.flag}</span>
                  <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-bold">{country.name}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                      <Badge className="bg-white/20 text-white border-white/30">
                        <MapPin className="w-3 h-3 mr-1" /> {country.capital}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Globe className="w-3 h-3 mr-1" /> {country.region}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Phone className="w-3 h-3 mr-1" /> {country.callingCode}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <DollarSign className="w-3 h-3 mr-1" /> {country.currency.code} ({country.currency.symbol})
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-gray-100 p-1.5 rounded-xl">
                <TabsTrigger value="visa" className="flex items-center gap-1.5 text-xs sm:text-sm flex-1 min-w-[120px]">
                  <Landmark className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Visa & Entry</span>
                  <span className="sm:hidden">Visa</span>
                </TabsTrigger>
                <TabsTrigger value="power" className="flex items-center gap-1.5 text-xs sm:text-sm flex-1 min-w-[120px]">
                  <Plug className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Plug & Voltage</span>
                  <span className="sm:hidden">Power</span>
                </TabsTrigger>
                <TabsTrigger value="time" className="flex items-center gap-1.5 text-xs sm:text-sm flex-1 min-w-[120px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Time Zones</span>
                  <span className="sm:hidden">Time</span>
                </TabsTrigger>
                <TabsTrigger value="laws" className="flex items-center gap-1.5 text-xs sm:text-sm flex-1 min-w-[120px]">
                  <Scale className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Laws & Rules</span>
                  <span className="sm:hidden">Laws</span>
                </TabsTrigger>
                <TabsTrigger value="sim" className="flex items-center gap-1.5 text-xs sm:text-sm flex-1 min-w-[120px]">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">eSIM & SIM</span>
                  <span className="sm:hidden">SIM</span>
                </TabsTrigger>
              </TabsList>

              {/* ═══════════════ TAB 1: Visa & Entry ═══════════════ */}
              <TabsContent value="visa" className="space-y-6">
                {/* Visa Type Overview */}
                <motion.div {...fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                        <Landmark className="w-5 h-5 text-[#E8733A]" /> Visa & Entry Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Visa Status Banner */}
                      <div className={cn('p-5 rounded-xl border-2 flex items-center gap-4', visaColorMap[country.visa.color])}>
                        {visaIconMap[country.visa.color]}
                        <div>
                          <p className="text-lg font-bold">{country.visa.type}</p>
                          <p className="text-sm opacity-80">For Indian passport holders</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Max Stay</p>
                          <p className="text-2xl font-bold text-[#1A3C5E] mt-1">{country.visa.maxDays}</p>
                          <p className="text-xs text-gray-500">days</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Processing Time</p>
                          <p className="text-lg font-bold text-[#1A3C5E] mt-1">{country.visa.processingTime}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Passport Validity</p>
                          <p className="text-sm font-bold text-[#1A3C5E] mt-1">{country.visa.passportValidity}</p>
                        </div>
                      </div>

                      {/* Passport Validity Checker */}
                      <div className="p-5 bg-[#1A3C5E]/5 rounded-xl">
                        <h4 className="font-semibold text-[#1A3C5E] flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-[#E8733A]" />
                          Passport Validity Checker
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Passport Expiry Date</label>
                            <Input
                              type="date"
                              value={passportExpiry}
                              onChange={(e) => setPassportExpiry(e.target.value)}
                              className="max-w-xs"
                            />
                          </div>
                          {passportValid && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={cn(
                                'p-3 rounded-xl border-2 flex items-center gap-3 flex-1',
                                passportValid.isOk
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-red-50 border-red-200'
                              )}
                            >
                              {passportValid.isOk ? (
                                <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                              )}
                              <div>
                                <p className={cn('font-semibold text-sm', passportValid.isOk ? 'text-green-700' : 'text-red-700')}>
                                  {passportValid.isOk ? 'Passport Valid' : 'Passport May Not Be Accepted'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {passportValid.monthsRemaining} months remaining &middot; Expires {passportValid.expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Entry Restrictions */}
                      <div>
                        <h4 className="font-semibold text-[#1A3C5E] flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-[#E8733A]" />
                          Entry Restrictions & Notes
                        </h4>
                        <div className="space-y-2">
                          {country.visa.entryRestrictions.map((r, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50/50">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-sm text-gray-700">{r}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documents Required */}
                      <div>
                        <h4 className="font-semibold text-[#1A3C5E] flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-[#E8733A]" />
                          Documents Required
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {country.visa.documentsRequired.map((doc, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                              <p className="text-sm text-gray-700">{doc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ═══════════════ TAB 2: Plug & Voltage ═══════════════ */}
              <TabsContent value="power" className="space-y-6">
                <motion.div {...fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                        <Plug className="w-5 h-5 text-[#E8733A]" /> Electrical Plug & Voltage Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Quick stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Voltage</p>
                          </div>
                          <p className="text-2xl font-bold text-[#1A3C5E]">{country.plug.voltage}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {parseInt(country.plug.voltage) === 230
                              ? 'Compatible with Indian devices (230V)'
                              : parseInt(country.plug.voltage) < 200
                                ? 'Voltage converter needed for Indian devices'
                                : 'Check device compatibility'}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Signal className="w-5 h-5 text-blue-600" />
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Frequency</p>
                          </div>
                          <p className="text-2xl font-bold text-[#1A3C5E]">{country.plug.frequency}</p>
                          <p className="text-xs text-gray-500 mt-1">India uses 50Hz</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Plug className="w-5 h-5 text-green-600" />
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Plug Types</p>
                          </div>
                          <p className="text-2xl font-bold text-[#1A3C5E]">
                            {country.plug.types.join(', ')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{country.plug.types.length} type{country.plug.types.length > 1 ? 's' : ''} used</p>
                        </div>
                      </div>

                      {/* Plug Type Visual Diagrams */}
                      <div>
                        <h4 className="font-semibold text-[#1A3C5E] mb-3">Plug Type Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {country.plug.types.map((type) => {
                            const info = plugTypeInfo[type];
                            if (!info) return null;
                            return (
                              <Card key={type} className="hover:shadow-md transition-shadow overflow-hidden">
                                <div className="bg-gradient-to-br from-[#1A3C5E]/5 to-[#1A3C5E]/10 p-6 flex items-center justify-center">
                                  {/* Visual plug diagram */}
                                  <div className="relative">
                                    <div className="w-24 h-28 rounded-2xl border-4 border-[#1A3C5E]/30 bg-white flex flex-col items-center justify-center gap-1 relative">
                                      {/* Top label */}
                                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8733A] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {info.name}
                                      </div>
                                      {/* Pin visualization */}
                                      {type === 'A' && (
                                        <div className="flex gap-3 mt-2">
                                          <div className="w-1.5 h-8 bg-[#1A3C5E] rounded-sm" />
                                          <div className="w-1.5 h-8 bg-[#1A3C5E] rounded-sm" />
                                        </div>
                                      )}
                                      {type === 'B' && (
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                          <div className="flex gap-3">
                                            <div className="w-1.5 h-6 bg-[#1A3C5E] rounded-sm" />
                                            <div className="w-1.5 h-6 bg-[#1A3C5E] rounded-sm" />
                                          </div>
                                          <div className="w-3 h-3 rounded-full bg-[#1A3C5E]" />
                                        </div>
                                      )}
                                      {type === 'C' && (
                                        <div className="flex gap-4 mt-2">
                                          <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                          <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                        </div>
                                      )}
                                      {type === 'D' && (
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                          <div className="w-4 h-4 rounded-full bg-[#1A3C5E]" />
                                          <div className="flex gap-3">
                                            <div className="w-4 h-4 rounded-full bg-[#1A3C5E]" />
                                            <div className="w-4 h-4 rounded-full bg-[#1A3C5E]" />
                                          </div>
                                        </div>
                                      )}
                                      {type === 'E' && (
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                          <div className="w-3 h-3 rounded-full border-2 border-[#1A3C5E] bg-white" />
                                          <div className="flex gap-4">
                                            <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                            <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                          </div>
                                        </div>
                                      )}
                                      {type === 'F' && (
                                        <div className="flex items-center gap-1 mt-2">
                                          <div className="w-1 h-10 bg-[#1A3C5E] rounded" />
                                          <div className="flex gap-3 mx-2">
                                            <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                            <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                          </div>
                                          <div className="w-1 h-10 bg-[#1A3C5E] rounded" />
                                        </div>
                                      )}
                                      {type === 'G' && (
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                          <div className="w-2 h-6 bg-[#1A3C5E] rounded-sm" />
                                          <div className="flex gap-2">
                                            <div className="w-1.5 h-5 bg-[#1A3C5E] rounded-sm" />
                                            <div className="w-1.5 h-5 bg-[#1A3C5E] rounded-sm" />
                                          </div>
                                        </div>
                                      )}
                                      {type === 'I' && (
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                          <div className="flex gap-2">
                                            <div className="w-1.5 h-6 bg-[#1A3C5E] rounded-sm rotate-[20deg]" />
                                            <div className="w-1.5 h-6 bg-[#1A3C5E] rounded-sm -rotate-[20deg]" />
                                          </div>
                                          <div className="w-1.5 h-5 bg-[#1A3C5E] rounded-sm" />
                                        </div>
                                      )}
                                      {type === 'O' && (
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                          <div className="w-3 h-3 rounded-full bg-[#1A3C5E]" />
                                          <div className="flex gap-3">
                                            <div className="w-3 h-5 rounded-full bg-[#1A3C5E]" />
                                            <div className="w-3 h-5 rounded-full bg-[#1A3C5E]" />
                                          </div>
                                        </div>
                                      )}
                                      {!['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'O'].includes(type) && (
                                        <div className="flex gap-3 mt-2">
                                          <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                          <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                          <div className="w-3 h-6 rounded-full bg-[#1A3C5E]" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <p className="font-semibold text-[#1A3C5E] text-sm">{info.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{info.pins}</p>
                                  <p className="text-xs text-gray-400 mt-1">Common in: {info.countries}</p>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {/* Adapter Recommendation */}
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm text-blue-800">Adapter Recommendation</p>
                            <p className="text-sm text-blue-700 mt-1">{country.plug.adapter}</p>
                          </div>
                        </div>
                      </div>

                      {/* Voltage comparison */}
                      <div>
                        <h4 className="font-semibold text-[#1A3C5E] mb-3">Voltage Comparison</h4>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="text-center flex-1">
                            <p className="text-xs text-gray-500">India</p>
                            <p className="text-xl font-bold text-[#1A3C5E]">230V / 50Hz</p>
                            <Badge className="mt-1 bg-blue-100 text-blue-700">Type C, D, M</Badge>
                          </div>
                          <div className="text-center px-4">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs',
                              parseInt(country.plug.voltage) >= 220 && parseInt(country.plug.voltage) <= 240
                                ? 'bg-green-500' : 'bg-red-500'
                            )}>
                              {parseInt(country.plug.voltage) >= 220 && parseInt(country.plug.voltage) <= 240 ? 'OK' : '!!'}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {parseInt(country.plug.voltage) >= 220 && parseInt(country.plug.voltage) <= 240
                                ? 'Compatible' : 'Needs converter'}
                            </p>
                          </div>
                          <div className="text-center flex-1">
                            <p className="text-xs text-gray-500">{country.name}</p>
                            <p className="text-xl font-bold text-[#E8733A]">{country.plug.voltage} / {country.plug.frequency}</p>
                            <Badge className="mt-1 bg-orange-100 text-orange-700">Type {country.plug.types.join(', ')}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ═══════════════ TAB 3: Time Zone Dashboard ═══════════════ */}
              <TabsContent value="time" className="space-y-6">
                <motion.div {...fadeIn}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* World Clock */}
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                          <Clock className="w-5 h-5 text-[#E8733A]" /> World Clock
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Home Time */}
                        <div className="text-center p-5 bg-blue-50 rounded-xl">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Home Time ({homeTimezone.name})</p>
                          <p className="text-4xl font-bold font-mono text-[#1A3C5E]">{formatClock(homeTime)}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(homeTime)}</p>
                          <Badge variant="outline" className="mt-2">UTC+5:30</Badge>
                        </div>
                        {/* Destination Time */}
                        <div className="text-center p-5 bg-orange-50 rounded-xl">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{country.name} ({country.timezone.name})</p>
                          <p className="text-4xl font-bold font-mono text-[#E8733A]">{destTime && formatClock(destTime)}</p>
                          <p className="text-sm text-gray-500 mt-1">{destTime && formatDate(destTime)}</p>
                          <div className="flex justify-center gap-2 mt-2">
                            <Badge variant="outline">UTC{country.timezone.utcOffset >= 0 ? '+' : ''}{country.timezone.utcOffset}</Badge>
                            <Badge variant="outline" className={country.timezone.dst ? 'bg-yellow-50 text-yellow-700' : ''}>
                              {country.timezone.dst ? 'DST Active' : 'No DST'}
                            </Badge>
                          </div>
                        </div>
                        {/* Time Diff & Jet Lag */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500">Time Difference</p>
                            <p className="text-2xl font-bold text-[#1A3C5E]">
                              {hoursDiff}h {country.timezone.utcOffset > homeTimezone.utcOffset ? 'ahead' : hoursDiff === 0 ? '' : 'behind'}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500">Jet Lag Recovery</p>
                            <p className="text-2xl font-bold text-[#1A3C5E]">~{jetLagDays} day{jetLagDays !== 1 ? 's' : ''}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Approx. 1 day per 2hr shift</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Meeting Planner & Sunrise/Sunset */}
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                          <Globe className="w-5 h-5 text-[#E8733A]" /> Meeting Planner & Daylight
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Working Hours Overlap */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Working Hours Overlap (9 AM - 5 PM)</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 24 }, (_, h) => {
                              const homeH = (h + homeTimezone.utcOffset + 24) % 24;
                              const destH = (h + country.timezone.utcOffset + 24) % 24;
                              const homeW = homeH >= 9 && homeH < 17;
                              const destW = destH >= 9 && destH < 17;
                              return (
                                <div
                                  key={h}
                                  className={cn(
                                    'flex-1 h-6 rounded-sm transition-colors',
                                    homeW && destW ? 'bg-green-400' : homeW || destW ? 'bg-yellow-200' : 'bg-gray-100'
                                  )}
                                  title={`UTC ${h}:00 | Home: ${(h + homeTimezone.utcOffset + 24) % 24}:00 | Dest: ${(h + country.timezone.utcOffset + 24) % 24}:00`}
                                />
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-gray-400">0:00 UTC</span>
                            <span className="text-[10px] text-gray-400">12:00 UTC</span>
                            <span className="text-[10px] text-gray-400">23:00 UTC</span>
                          </div>
                          <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-green-400" /> Both working</span>
                            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-yellow-200" /> One side</span>
                            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-gray-100" /> Off hours</span>
                          </div>
                        </div>

                        {/* Best Meeting Times */}
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <h4 className="font-semibold text-green-800 text-sm mb-2">Best Meeting Times</h4>
                          <div className="space-y-1">
                            {(() => {
                              const slots: string[] = [];
                              for (let h = 0; h < 24; h++) {
                                const homeH = (h + homeTimezone.utcOffset + 24) % 24;
                                const destH = (h + country.timezone.utcOffset + 24) % 24;
                                if (homeH >= 9 && homeH < 17 && destH >= 9 && destH < 17) {
                                  const homeLabel = `${homeH > 12 ? homeH - 12 : homeH || 12}${homeH >= 12 ? 'PM' : 'AM'}`;
                                  const destLabel = `${destH > 12 ? destH - 12 : destH || 12}${destH >= 12 ? 'PM' : 'AM'}`;
                                  slots.push(`${homeLabel} IST = ${destLabel} ${country.timezone.name}`);
                                }
                              }
                              return slots.length > 0 ? (
                                slots.map((s, i) => (
                                  <p key={i} className="text-sm text-green-700 font-mono">{s}</p>
                                ))
                              ) : (
                                <p className="text-sm text-amber-700">No overlapping business hours. Consider asynchronous communication.</p>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Sunrise & Sunset */}
                        <div>
                          <h4 className="font-semibold text-[#1A3C5E] text-sm mb-3">Sunrise & Sunset</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 text-center">
                              <Sunrise className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                              <p className="text-xs text-gray-500 uppercase">Sunrise</p>
                              <p className="text-xl font-bold text-[#1A3C5E]">{country.timezone.sunrise}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 text-center">
                              <Sunset className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                              <p className="text-xs text-gray-500 uppercase">Sunset</p>
                              <p className="text-xl font-bold text-[#1A3C5E]">{country.timezone.sunset}</p>
                            </div>
                          </div>
                        </div>

                        {/* Jet Lag Tips */}
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <h4 className="font-semibold text-purple-800 text-sm mb-2">Jet Lag Tips</h4>
                          <ul className="space-y-1 text-xs text-purple-700">
                            {hoursDiff >= 3 && <li>- Start adjusting sleep 2-3 days before departure</li>}
                            {hoursDiff >= 5 && <li>- Consider melatonin supplements (consult doctor)</li>}
                            <li>- Stay hydrated during the flight</li>
                            <li>- Get sunlight exposure at destination to reset body clock</li>
                            {country.timezone.utcOffset > homeTimezone.utcOffset && <li>- Traveling east: Try sleeping earlier before trip</li>}
                            {country.timezone.utcOffset < homeTimezone.utcOffset && <li>- Traveling west: Try staying up later before trip</li>}
                            <li>- Avoid caffeine and alcohol near bedtime</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* ═══════════════ TAB 4: Laws & Regulations ═══════════════ */}
              <TabsContent value="laws" className="space-y-6">
                <motion.div {...fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                        <Scale className="w-5 h-5 text-[#E8733A]" /> Local Laws & Regulations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="multiple" className="w-full">
                        {/* Driving */}
                        <AccordionItem value="driving">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Car className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Driving Requirements</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-11">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Drive Side</p>
                                <p className="font-semibold text-[#1A3C5E]">{country.laws.driving.side}</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">License Required</p>
                                <p className="font-semibold text-[#1A3C5E]">{country.laws.driving.license}</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Speed Limits</p>
                                <p className="font-semibold text-[#1A3C5E]">{country.laws.driving.speedLimits}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Alcohol */}
                        <AccordionItem value="alcohol">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Wine className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Alcohol Laws</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-11">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Legal Drinking Age</p>
                                <p className="text-2xl font-bold text-[#1A3C5E]">{country.laws.alcohol.legalAge}+</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Public Drinking</p>
                                <p className="font-semibold text-[#1A3C5E] text-sm">{country.laws.alcohol.publicDrinking}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Photography */}
                        <AccordionItem value="photography">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Camera className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Photography Restrictions</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-gray-600 pl-11">{country.laws.photography}</p>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Drones */}
                        <AccordionItem value="drones">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                                <Plane className="w-4 h-4 text-sky-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Drone Laws</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-gray-600 pl-11">{country.laws.drones}</p>
                          </AccordionContent>
                        </AccordionItem>

                        {/* LGBTQ+ */}
                        <AccordionItem value="lgbtq">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                                <Heart className="w-4 h-4 text-pink-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">LGBTQ+ Safety</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-11">
                              <Badge className={cn('text-sm px-3 py-1', lgbtqColorMap[country.laws.lgbtq.color])}>
                                {country.laws.lgbtq.safety}
                              </Badge>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Dress Code */}
                        <AccordionItem value="dress">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Shirt className="w-4 h-4 text-indigo-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Dress Code</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-gray-600 pl-11">{country.laws.dressCode}</p>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Drug/Medication Rules */}
                        <AccordionItem value="drugs">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <Pill className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Drug & Medication Rules</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-11 p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm text-red-800">{country.laws.drugs}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Smoking */}
                        <AccordionItem value="smoking">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Cigarette className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Smoking Regulations</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-gray-600 pl-11">{country.laws.smoking}</p>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Import Restrictions */}
                        <AccordionItem value="import">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Import Restrictions</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-gray-600 pl-11">{country.laws.importRestrictions}</p>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Tipping & Bargaining */}
                        <AccordionItem value="tipping">
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                                <HandCoins className="w-4 h-4 text-teal-600" />
                              </div>
                              <span className="font-semibold text-[#1A3C5E]">Tipping & Bargaining</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-11">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Tipping</p>
                                <p className="text-sm font-medium text-[#1A3C5E]">{country.laws.tipping}</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Bargaining</p>
                                <p className="text-sm font-medium text-[#1A3C5E]">{country.laws.bargaining}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ═══════════════ TAB 5: eSIM & Local SIM ═══════════════ */}
              <TabsContent value="sim" className="space-y-6">
                <motion.div {...fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                        <Smartphone className="w-5 h-5 text-[#E8733A]" /> eSIM & Local SIM Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* eSIM Support Status */}
                      <div className={cn(
                        'p-5 rounded-xl border-2 flex items-center gap-4',
                        country.sim.esimSupported ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                      )}>
                        {country.sim.esimSupported ? (
                          <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-8 h-8 text-orange-600 shrink-0" />
                        )}
                        <div>
                          <p className="text-lg font-bold text-[#1A3C5E]">
                            {country.sim.esimSupported ? 'eSIM Supported' : 'eSIM Not Available'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {country.sim.esimSupported
                              ? 'Your eSIM-compatible device can connect instantly'
                              : 'Physical SIM card required for this destination'}
                          </p>
                        </div>
                      </div>

                      {/* Device Compatibility Note */}
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm text-blue-800">eSIM Device Compatibility</p>
                            <p className="text-sm text-blue-700 mt-1">
                              eSIM is supported on iPhone XS/XR and later, Samsung Galaxy S20+, Google Pixel 3a+, and most flagship phones from 2020 onwards. Check Settings &gt; Cellular/Mobile to verify your device supports eSIM.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Provider Cards */}
                      <div>
                        <h4 className="font-semibold text-[#1A3C5E] mb-3">Recommended Providers</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {country.sim.providers.map((provider, i) => (
                            <Card key={i} className="hover:shadow-md transition-shadow border-2 hover:border-[#E8733A]/30">
                              <CardContent className="pt-5 pb-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <p className="font-bold text-[#1A3C5E] text-sm">{provider.name}</p>
                                    <Badge className={cn(
                                      'text-[10px] mt-1',
                                      provider.type === 'eSIM'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                    )}>
                                      {provider.type}
                                    </Badge>
                                  </div>
                                  {provider.type === 'eSIM' ? (
                                    <Wifi className="w-5 h-5 text-purple-500" />
                                  ) : (
                                    <Smartphone className="w-5 h-5 text-blue-500" />
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-sm text-gray-700">{provider.dataPrice}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Signal className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-sm text-gray-700">{provider.coverage}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-sm text-gray-700">{provider.speed}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Registration Info */}
                      <div className={cn(
                        'p-4 rounded-xl border',
                        country.sim.registrationRequired
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-green-50 border-green-200'
                      )}>
                        <div className="flex items-start gap-3">
                          <FileText className={cn(
                            'w-5 h-5 mt-0.5 shrink-0',
                            country.sim.registrationRequired ? 'text-amber-600' : 'text-green-600'
                          )} />
                          <div>
                            <p className={cn(
                              'font-semibold text-sm',
                              country.sim.registrationRequired ? 'text-amber-800' : 'text-green-800'
                            )}>
                              {country.sim.registrationRequired
                                ? 'Registration Required'
                                : 'No Registration Needed'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{country.sim.registrationNote}</p>
                          </div>
                        </div>
                      </div>

                      {/* Best For Recommendation */}
                      <div className="p-4 bg-[#E8733A]/5 rounded-xl border border-[#E8733A]/20">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-[#E8733A] mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm text-[#1A3C5E]">Our Recommendation</p>
                            <p className="text-sm text-gray-700 mt-1">{country.sim.bestFor}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!country && (
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="text-center py-16">
          <Globe className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400">Select a country to explore</h3>
          <p className="text-sm text-gray-300 mt-1">Choose from the list above to see comprehensive travel information</p>
        </motion.div>
      )}
    </div>
  );
}
