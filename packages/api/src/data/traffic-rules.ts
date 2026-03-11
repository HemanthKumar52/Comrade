export interface TrafficRules {
  drivingSide: 'left' | 'right';
  speedLimits: { urban: string; rural: string; highway: string; unit: 'kmh' | 'mph' };
  seatbeltLaw: boolean;
  childSeatRequired: boolean;
  mobilePhoneBan: boolean;
  alcoholLimit: number;
  idpRequired: boolean;
  minimumAge: number;
  tollRoads: boolean;
  commonFines: { violation: string; fine: string }[];
  uniqueRules: string[];
  roundaboutPriority: string;
  headlightsRequired: string;
  hornUsage: string;
  fuelTypes: string[];
}

export const TRAFFIC_RULES: Record<string, TrafficRules> = {
  IN: {
    drivingSide: 'left', speedLimits: { urban: '50', rural: '80', highway: '100-120', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: false, mobilePhoneBan: true, alcoholLimit: 0.03,
    idpRequired: false, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'No seatbelt', fine: '₹1,000' }, { violation: 'Using phone', fine: '₹5,000' },
      { violation: 'Drunk driving', fine: '₹10,000' }, { violation: 'Speeding', fine: '₹2,000-5,000' },
      { violation: 'No helmet (two-wheeler)', fine: '₹1,000' }, { violation: 'Running red light', fine: '₹5,000' },
    ],
    uniqueRules: ['Honking is common and often used as a warning signal', 'Cows and animals on roads have right of way in many areas', 'Lane discipline is loosely followed', 'Two-wheelers often carry 3+ passengers despite rules', 'Night driving on highways can be dangerous due to unlit vehicles'],
    roundaboutPriority: 'Vehicles inside roundabout have priority, but in practice it varies',
    headlightsRequired: 'Required at night. High beam usage common on highways.',
    hornUsage: 'Extremely common. Trucks have "Horn OK Please" painted on them.',
    fuelTypes: ['Petrol', 'Diesel', 'CNG', 'Electric charging growing in cities'],
  },
  US: {
    drivingSide: 'right', speedLimits: { urban: '25-35', rural: '55', highway: '65-85', unit: 'mph' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.08,
    idpRequired: false, minimumAge: 16, tollRoads: true,
    commonFines: [
      { violation: 'Speeding', fine: '$150-500' }, { violation: 'Running red light', fine: '$200-500' },
      { violation: 'DUI', fine: '$1,000-10,000+' }, { violation: 'No seatbelt', fine: '$25-200' },
      { violation: 'Illegal parking', fine: '$50-100' }, { violation: 'Using phone', fine: '$100-500' },
    ],
    uniqueRules: ['Right turn on red is allowed in most states (except NYC)', 'School bus stop sign - all traffic must stop', 'Speed limits vary significantly by state', 'HOV lanes for carpooling on highways', 'Four-way stops: first to arrive goes first', 'Jaywalking can result in fines'],
    roundaboutPriority: 'Vehicles in roundabout have priority. Yield before entering.',
    headlightsRequired: 'Required 30 min after sunset to 30 min before sunrise.',
    hornUsage: 'Use sparingly. Honking aggressively can result in road rage.',
    fuelTypes: ['Regular (87)', 'Mid-grade (89)', 'Premium (91-93)', 'Diesel', 'Electric (Tesla Superchargers widespread)'],
  },
  GB: {
    drivingSide: 'left', speedLimits: { urban: '30', rural: '60', highway: '70', unit: 'mph' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.08,
    idpRequired: false, minimumAge: 17, tollRoads: true,
    commonFines: [
      { violation: 'Speeding', fine: '£100+' }, { violation: 'Using phone', fine: '£200 + 6 points' },
      { violation: 'No MOT', fine: '£1,000' }, { violation: 'Drink driving', fine: 'Unlimited + ban' },
      { violation: 'Bus lane violation', fine: '£60-130' },
    ],
    uniqueRules: ['London Congestion Charge £15/day', 'ULEZ (Ultra Low Emission Zone) charge in London', 'Roundabouts are very common - give way to traffic from right', 'Speed cameras (Gatso) are widespread', 'Mini roundabouts: give way to traffic from the right'],
    roundaboutPriority: 'Give way to traffic from the right (already in the roundabout).',
    headlightsRequired: 'Required in poor visibility and at night.',
    hornUsage: 'Do not use horn in built-up areas between 11:30pm and 7am.',
    fuelTypes: ['Unleaded', 'Super Unleaded', 'Diesel', 'Electric charging points growing rapidly'],
  },
  JP: {
    drivingSide: 'left', speedLimits: { urban: '30-40', rural: '50-60', highway: '80-100', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.03,
    idpRequired: true, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'Speeding (30+ over)', fine: '¥50,000-100,000' }, { violation: 'Drunk driving', fine: '¥500,000-1,000,000' },
      { violation: 'Using phone', fine: '¥50,000' }, { violation: 'Illegal parking', fine: '¥15,000-18,000' },
    ],
    uniqueRules: ['Zero tolerance for drunk driving - passengers can also be fined', 'Highway tolls are very expensive (Tokyo-Osaka ~¥13,000)', 'IDP from Geneva Convention countries only accepted', 'Must carry IDP and home license at all times', 'Flashing headlights means "go ahead" not "stop"', 'Excellent road conditions everywhere'],
    roundaboutPriority: 'Vehicles in roundabout have priority. Rare in Japan.',
    headlightsRequired: 'Required from sunset to sunrise.',
    hornUsage: 'Rarely used. Considered rude in most situations.',
    fuelTypes: ['Regular', 'High-octane', 'Diesel', 'Kei cars common (lightweight vehicles)'],
  },
  DE: {
    drivingSide: 'right', speedLimits: { urban: '50', rural: '100', highway: 'No limit (recommended 130)', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.05,
    idpRequired: false, minimumAge: 18, tollRoads: false,
    commonFines: [
      { violation: 'Speeding (20 over in city)', fine: '€115' }, { violation: 'Using phone', fine: '€100' },
      { violation: 'Running red light', fine: '€200+' }, { violation: 'Tailgating', fine: '€100-400' },
      { violation: 'Drunk driving', fine: '€500+' },
    ],
    uniqueRules: ['Autobahn has no general speed limit but recommended 130 km/h', 'It is ILLEGAL to run out of fuel on the Autobahn', 'Walking on the Autobahn is illegal', 'Must form emergency corridor (Rettungsgasse) in traffic jams', 'Winter tires mandatory in winter conditions', 'Right lane for driving, left lane for passing only on Autobahn'],
    roundaboutPriority: 'Vehicles in roundabout have priority unless signed otherwise.',
    headlightsRequired: 'Required in poor visibility. Daytime running lights recommended.',
    hornUsage: 'Only to warn of danger. Not in residential areas.',
    fuelTypes: ['Super E10 (95)', 'Super Plus (98)', 'Diesel', 'Electric (expanding Ionity network)'],
  },
  FR: {
    drivingSide: 'right', speedLimits: { urban: '50', rural: '80', highway: '130 (110 in rain)', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.05,
    idpRequired: false, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'Speeding (20 over)', fine: '€135' }, { violation: 'Using phone', fine: '€135' },
      { violation: 'No seatbelt', fine: '€135' }, { violation: 'Drunk driving', fine: '€4,500+' },
    ],
    uniqueRules: ['Must carry breathalyzer in car (law exists but fine suspended)', 'Priority to the right (priorité à droite) in unmarked intersections', 'Speed limits reduced by 20 km/h in rain', 'Crit\'Air sticker required in major city centers (pollution zones)', 'Toll autoroutes can be expensive (Paris-Nice ~€70)'],
    roundaboutPriority: 'Vehicles in roundabout have priority. Previously was priority to entering.',
    headlightsRequired: 'Dipped headlights required in poor visibility.',
    hornUsage: 'Only to prevent accidents. Forbidden in built-up areas except emergencies.',
    fuelTypes: ['Sans Plomb 95 (SP95)', 'Sans Plomb 98 (SP98)', 'Gazole (Diesel)', 'E85 (Flex fuel)', 'Electric'],
  },
  TH: {
    drivingSide: 'left', speedLimits: { urban: '50-80', rural: '90', highway: '120', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: false, mobilePhoneBan: true, alcoholLimit: 0.05,
    idpRequired: true, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'Speeding', fine: '฿500-1,000' }, { violation: 'No helmet', fine: '฿500' },
      { violation: 'Drunk driving', fine: '฿5,000-20,000' }, { violation: 'Running red light', fine: '฿1,000' },
    ],
    uniqueRules: ['IDP required for foreigners', 'Scooter rentals rarely check licenses', 'Traffic in Bangkok is extremely congested', 'Thai driving can be aggressive by Western standards', 'Many road signs are in Thai script only outside cities', 'Be extremely cautious on two-lane rural highways'],
    roundaboutPriority: 'Varies. Generally vehicles in roundabout have priority.',
    headlightsRequired: 'Required at night.',
    hornUsage: 'Common in traffic. Light beeps are standard.',
    fuelTypes: ['Benzene 91', 'Gasohol 95', 'Diesel', 'NGV', 'Electric charging growing in Bangkok'],
  },
  AU: {
    drivingSide: 'left', speedLimits: { urban: '50', rural: '100-110', highway: '110-130', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.05,
    idpRequired: true, minimumAge: 17, tollRoads: true,
    commonFines: [
      { violation: 'Speeding (10-20 over)', fine: 'A$300-500' }, { violation: 'Using phone', fine: 'A$500-1,000' },
      { violation: 'Drink driving', fine: 'A$2,200+' }, { violation: 'Running red light', fine: 'A$500' },
    ],
    uniqueRules: ['Wildlife on roads (kangaroos, wombats) especially at dawn/dusk', 'Outback roads can be hundreds of km without fuel stations', 'Hook turns in Melbourne CBD', 'Road trains (long trucks) have absolute right of way in outback', 'Carry extra water and fuel in remote areas', 'Mobile speed cameras common'],
    roundaboutPriority: 'Give way to vehicles already in the roundabout (from your right).',
    headlightsRequired: 'Required from sunset to sunrise and in poor visibility.',
    hornUsage: 'Only for warning. Not for expressing frustration.',
    fuelTypes: ['Unleaded 91', 'Premium 95', 'Premium 98', 'Diesel', 'E10', 'Electric (growing network)'],
  },
  IT: {
    drivingSide: 'right', speedLimits: { urban: '50', rural: '90-110', highway: '130 (110 in rain)', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.05,
    idpRequired: false, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'Speeding', fine: '€170-680' }, { violation: 'ZTL zone violation', fine: '€80-335' },
      { violation: 'Using phone', fine: '€165-660' }, { violation: 'No seatbelt', fine: '€80-323' },
    ],
    uniqueRules: ['ZTL (Zona Traffico Limitato) restricted zones in historic city centers - cameras enforce, tourists get fined', 'Headlights must be on outside urban areas 24/7', 'Must carry warning triangle and reflective vest', 'Autostrada tolls paid at exit', 'Fuel stations may close for lunch (1-3pm)'],
    roundaboutPriority: 'Vehicles in roundabout have priority.',
    headlightsRequired: 'Mandatory on all roads outside urban areas at all times.',
    hornUsage: 'Common in southern Italy. Restricted in city centers.',
    fuelTypes: ['Benzina (Petrol)', 'Gasolio (Diesel)', 'GPL (LPG)', 'Metano (CNG)', 'Electric'],
  },
  AE: {
    drivingSide: 'right', speedLimits: { urban: '60-80', rural: '100', highway: '120-140', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.0,
    idpRequired: true, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'Speeding (60+ over)', fine: 'AED 3,000' }, { violation: 'Using phone', fine: 'AED 800' },
      { violation: 'Drunk driving', fine: 'AED 20,000 + jail' }, { violation: 'Running red light', fine: 'AED 1,000' },
    ],
    uniqueRules: ['ZERO alcohol tolerance while driving', 'Salik toll gates in Dubai (AED 4 per pass)', 'Flashing headlights to indicate wanting to overtake', 'Speed cameras with 20 km/h buffer on most roads', 'Washing dirty car can result in fine in some areas', 'Very strict penalties for reckless driving'],
    roundaboutPriority: 'Vehicles in roundabout have priority.',
    headlightsRequired: 'Required at night. Fog lights in sandstorm conditions.',
    hornUsage: 'Used sparingly. Aggressive honking can result in fine.',
    fuelTypes: ['Special (91)', 'Super (95)', 'Super 98', 'Diesel', 'Electric (growing infrastructure)'],
  },
  CN: {
    drivingSide: 'right', speedLimits: { urban: '30-50', rural: '70', highway: '100-120', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: false, mobilePhoneBan: true, alcoholLimit: 0.02,
    idpRequired: false, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'Speeding (50% over)', fine: '¥200-2,000' }, { violation: 'Drunk driving', fine: '¥1,000-5,000 + detention' },
      { violation: 'Running red light', fine: '¥200' },
    ],
    uniqueRules: ['IDP NOT accepted - need Chinese driving license', 'Foreign tourists effectively cannot drive in mainland China', 'Traffic cameras EVERYWHERE', 'E-bikes and scooters share roads and sidewalks', 'Right on red NOT allowed unless specifically signed', 'Honking banned in many city centers'],
    roundaboutPriority: 'Vehicles in roundabout generally have priority.',
    headlightsRequired: 'Required at night.',
    hornUsage: 'Banned in many urban areas. Fines for honking in no-horn zones.',
    fuelTypes: ['92 (Regular)', '95 (Premium)', '98 (Super)', 'Diesel', 'Electric (most EV chargers globally)'],
  },
  BR: {
    drivingSide: 'right', speedLimits: { urban: '40-60', rural: '80', highway: '110', unit: 'kmh' },
    seatbeltLaw: true, childSeatRequired: true, mobilePhoneBan: true, alcoholLimit: 0.0,
    idpRequired: true, minimumAge: 18, tollRoads: true,
    commonFines: [
      { violation: 'Speeding', fine: 'R$130-880' }, { violation: 'Drunk driving', fine: 'R$2,934+' },
      { violation: 'No seatbelt', fine: 'R$195' }, { violation: 'Using phone', fine: 'R$293' },
    ],
    uniqueRules: ['ZERO alcohol tolerance', 'Headlights mandatory on all highways 24/7', 'Car must carry fire extinguisher and first aid kit', 'Rodízio system in São Paulo restricts cars by license plate number on weekdays', 'Avoid driving in favela areas', 'Gas stations are full-service (attendant pumps)'],
    roundaboutPriority: 'Vehicles in roundabout have priority.',
    headlightsRequired: 'Mandatory on highways at all times.',
    hornUsage: 'Common in traffic. Double beep means "go ahead."',
    fuelTypes: ['Gasolina (Ethanol blend)', 'Etanol (Pure ethanol)', 'Diesel', 'GNV (CNG)', 'Flex-fuel cars common'],
  },
};

export function getTrafficRules(countryCode: string): TrafficRules | null {
  return TRAFFIC_RULES[countryCode] || null;
}

export function getDrivingSide(countryCode: string): 'left' | 'right' | 'unknown' {
  return TRAFFIC_RULES[countryCode]?.drivingSide || 'unknown';
}
