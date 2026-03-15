import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

final selectedCountryProvider = StateProvider<String>((ref) => 'Japan');

final travelKitDataProvider =
    Provider.family<Map<String, dynamic>?, String>((ref, country) {
  return _travelKitDatabase[country];
});

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const _countries = [
  'Japan',
  'Thailand',
  'France',
  'USA',
  'UAE',
  'India',
  'Australia',
  'Brazil',
];

final _travelKitDatabase = <String, Map<String, dynamic>>{
  'Japan': {
    'flag': '\u{1F1EF}\u{1F1F5}',
    'visa': {
      'type': 'Tourist Visa / Visa Waiver',
      'processingTime': '5-7 business days',
      'maxStay': '90 days (visa waiver)',
      'passportValidity': '6 months beyond stay',
      'entryRestrictions': [
        'Valid return ticket required',
        'Proof of accommodation needed',
        'Sufficient funds (~\$100/day)',
        'No criminal record declaration',
      ],
      'documents': [
        'Passport with 6+ months validity',
        'Completed visa application form',
        'Passport-size photos (45x45mm)',
        'Flight itinerary',
        'Hotel reservations',
      ],
    },
    'plugs': {
      'type': 'Type A / Type B',
      'voltage': '100V',
      'frequency': '50/60 Hz',
      'adapterNeeded': true,
      'adapterNote':
          'Japan uses 100V. Most devices with 100-240V adapters work, but high-wattage appliances may underperform.',
      'plugVisual': 'Two flat parallel pins (Type A)',
    },
    'time': {
      'timezone': 'JST (UTC+9)',
      'utcOffset': 9,
      'dstObserved': false,
      'sunrise': '06:12',
      'sunset': '17:48',
      'jetLagFromUTC': '9 hours ahead',
    },
    'laws': {
      'photography': [
        'No photos at some shrines/temples without permission',
        'No photos of people without consent (privacy law)',
        'No photography in most museums',
      ],
      'drone': [
        'Registration required for drones over 100g',
        'No flying near airports, crowds, or above 150m',
        'DID (Densely Inhabited Districts) flights need permits',
      ],
      'alcohol': [
        'Legal drinking age: 20',
        'Public drinking is legal (but be respectful)',
        'No open container restrictions',
        'Drunk and disorderly conduct is punishable',
      ],
      'lgbtq': {
        'safety': 'Moderate',
        'note':
            'No anti-discrimination laws. Same-sex marriage not recognized nationally. Generally safe but low public acceptance.',
        'color': 'warning',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'Ubigi', 'data': '10GB / 30 days', 'price': '\$18'},
        {'name': 'Airalo', 'data': '5GB / 30 days', 'price': '\$11'},
        {'name': 'Holafly', 'data': 'Unlimited / 15 days', 'price': '\$44'},
      ],
      'localSim': 'Available at airports (BIC SIM, Mobal). Passport required.',
      'tip':
          'eSIM is the easiest option. Japan has excellent 4G/5G coverage nationwide.',
    },
    'driving': {
      'side': 'Left',
      'idpRequired': true,
      'idpNote':
          'International Driving Permit (1949 Geneva Convention) required. US/EU licenses alone are not valid.',
      'speedLimits': {
        'urban': '40 km/h',
        'rural': '60 km/h',
        'expressway': '100 km/h',
      },
      'rules': [
        'Zero tolerance for alcohol (0.0% BAC)',
        'Seat belts mandatory for all passengers',
        'Using phone while driving is strictly prohibited',
        'Expressway tolls can be expensive (\$20-\$80)',
      ],
    },
  },
  'Thailand': {
    'flag': '\u{1F1F9}\u{1F1ED}',
    'visa': {
      'type': 'Visa Exemption / Visa on Arrival',
      'processingTime': 'Instant (VOA) / 3-5 days (embassy)',
      'maxStay': '30-60 days (exemption varies by nationality)',
      'passportValidity': '6 months beyond entry',
      'entryRestrictions': [
        'Return ticket within 30 days',
        'Proof of funds (10,000 THB per person)',
        'Hotel booking confirmation',
        'TM.6 arrival/departure card',
      ],
      'documents': [
        'Passport with 6+ months validity',
        'Completed arrival card',
        'Passport-size photo (VOA)',
        'Proof of accommodation',
        'Proof of onward travel',
      ],
    },
    'plugs': {
      'type': 'Type A / Type B / Type C',
      'voltage': '220V',
      'frequency': '50 Hz',
      'adapterNeeded': false,
      'adapterNote':
          'Most international plugs fit. Voltage is 220V so US 110V-only appliances need a converter.',
      'plugVisual': 'Mixed socket types; universal sockets common in hotels',
    },
    'time': {
      'timezone': 'ICT (UTC+7)',
      'utcOffset': 7,
      'dstObserved': false,
      'sunrise': '06:25',
      'sunset': '18:15',
      'jetLagFromUTC': '7 hours ahead',
    },
    'laws': {
      'photography': [
        'No photos inside Grand Palace chapels',
        'Ask permission before photographing monks',
        'Avoid photographing military installations',
      ],
      'drone': [
        'Registration with CAAT required',
        'Max altitude 90m without special permit',
        'No flying over national parks or temples',
      ],
      'alcohol': [
        'Legal drinking age: 20',
        'No alcohol sales 14:00-17:00 and 00:00-11:00',
        'Strictly no alcohol on Buddhist holidays',
        'No drinking on public transport',
      ],
      'lgbtq': {
        'safety': 'Generally Safe',
        'note':
            'Thailand is relatively welcoming. Same-sex civil partnership law passed. Bangkok has a vibrant LGBTQ+ scene.',
        'color': 'success',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'AIS', 'data': '15GB / 15 days', 'price': '\$8'},
        {'name': 'Airalo', 'data': '5GB / 30 days', 'price': '\$6.50'},
        {'name': 'DTAC Happy', 'data': '30GB / 30 days', 'price': '\$15'},
      ],
      'localSim':
          'SIM cards available at every 7-Eleven. Very affordable. Passport required for registration.',
      'tip':
          'Thai SIMs are extremely cheap. Get one at the airport or any convenience store.',
    },
    'driving': {
      'side': 'Left',
      'idpRequired': true,
      'idpNote':
          'IDP required along with your original license. Rental agencies may not check but police will.',
      'speedLimits': {
        'urban': '50 km/h',
        'rural': '90 km/h',
        'expressway': '120 km/h',
      },
      'rules': [
        'Helmet mandatory for motorbikes',
        'Traffic can be chaotic; defensive driving essential',
        'BAC limit: 0.05%',
        'Seat belts mandatory in front seats',
      ],
    },
  },
  'France': {
    'flag': '\u{1F1EB}\u{1F1F7}',
    'visa': {
      'type': 'Schengen Visa / Visa Waiver',
      'processingTime': '15 calendar days (Schengen visa)',
      'maxStay': '90 days within 180-day period',
      'passportValidity': '3 months beyond departure date',
      'entryRestrictions': [
        'Valid for entire Schengen area',
        'Travel insurance required (\u20AC30,000 coverage)',
        'Return ticket required',
        'Proof of accommodation',
      ],
      'documents': [
        'Passport valid 3+ months past departure',
        'Schengen visa application form',
        'Travel insurance certificate',
        'Flight itinerary and hotel bookings',
        'Bank statements (3 months)',
      ],
    },
    'plugs': {
      'type': 'Type C / Type E',
      'voltage': '230V',
      'frequency': '50 Hz',
      'adapterNeeded': true,
      'adapterNote':
          'Type E has a grounding pin from the socket. A Type C plug fits into Type E sockets. US/UK travelers need an adapter.',
      'plugVisual': 'Two round pins (Type C/E)',
    },
    'time': {
      'timezone': 'CET / CEST (UTC+1/+2)',
      'utcOffset': 1,
      'dstObserved': true,
      'sunrise': '07:35',
      'sunset': '18:50',
      'jetLagFromUTC': '1-2 hours ahead',
    },
    'laws': {
      'photography': [
        'No photos inside some churches/museums',
        'Right to privacy strongly enforced',
        'Eiffel Tower night lights are copyrighted',
      ],
      'drone': [
        'Registration required for drones 250g+',
        'No flying over Paris city center',
        'Max altitude 120m in open areas',
      ],
      'alcohol': [
        'Legal drinking age: 18',
        'No public intoxication',
        'Wine/beer sold in supermarkets',
        'No alcohol sales to minors strictly enforced',
      ],
      'lgbtq': {
        'safety': 'Safe',
        'note':
            'Same-sex marriage legal since 2013. Strong anti-discrimination protections. Paris is very LGBTQ+ friendly.',
        'color': 'success',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'Orange Holiday', 'data': '20GB / 14 days', 'price': '\u20AC20'},
        {'name': 'Airalo', 'data': '5GB / 30 days', 'price': '\$9'},
        {'name': 'Ubigi', 'data': '10GB / 30 days', 'price': '\u20AC16'},
      ],
      'localSim':
          'Available at airports and tabac shops. EU roaming included.',
      'tip':
          'Any EU SIM works across the Schengen area with no roaming charges.',
    },
    'driving': {
      'side': 'Right',
      'idpRequired': false,
      'idpNote':
          'EU licenses accepted. Non-EU licenses valid for 1 year with official translation or IDP recommended.',
      'speedLimits': {
        'urban': '50 km/h',
        'rural': '80 km/h',
        'expressway': '130 km/h',
      },
      'rules': [
        'BAC limit: 0.05% (0.02% for new drivers)',
        'Must carry reflective vest and warning triangle',
        'Radar detector apps/devices are illegal',
        'Autoroute tolls can add up quickly',
      ],
    },
  },
  'USA': {
    'flag': '\u{1F1FA}\u{1F1F8}',
    'visa': {
      'type': 'ESTA / B-1/B-2 Tourist Visa',
      'processingTime': '72 hours (ESTA) / 3-6 weeks (visa)',
      'maxStay': '90 days (ESTA) / 180 days (B visa)',
      'passportValidity': '6 months beyond stay',
      'entryRestrictions': [
        'ESTA required for Visa Waiver Program countries',
        'CBP officer has final entry authority',
        'ESTA costs \$21, valid 2 years',
        'Social media disclosure may be requested',
      ],
      'documents': [
        'Passport valid 6+ months past stay',
        'ESTA approval or valid visa',
        'Return/onward ticket',
        'Proof of funds',
        'Travel itinerary',
      ],
    },
    'plugs': {
      'type': 'Type A / Type B',
      'voltage': '120V',
      'frequency': '60 Hz',
      'adapterNeeded': true,
      'adapterNote':
          'US uses 120V at 60Hz. European/Asian travelers need an adapter and possibly a voltage converter for non-dual-voltage devices.',
      'plugVisual': 'Two flat parallel pins (Type A) or with grounding (Type B)',
    },
    'time': {
      'timezone': 'Multiple (EST to HST)',
      'utcOffset': -5,
      'dstObserved': true,
      'sunrise': '07:15',
      'sunset': '19:05',
      'jetLagFromUTC': '5-10 hours behind (varies by state)',
    },
    'laws': {
      'photography': [
        'Generally very permissive in public spaces',
        'No photos inside federal buildings without permission',
        'Some museums prohibit flash photography',
      ],
      'drone': [
        'FAA registration required for drones 250g+',
        'Remote ID required since 2024',
        'No flying in restricted airspace (airports, DC)',
      ],
      'alcohol': [
        'Legal drinking age: 21 (strictly enforced)',
        'Open container laws vary by state',
        'DUI laws are strict; penalties severe',
        'Some counties are "dry" (no alcohol sales)',
      ],
      'lgbtq': {
        'safety': 'Generally Safe (varies by region)',
        'note':
            'Same-sex marriage legal nationwide. Strong protections in major cities. Rural areas may be less welcoming.',
        'color': 'success',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'T-Mobile Prepaid', 'data': '10GB / 30 days', 'price': '\$40'},
        {'name': 'Airalo', 'data': '5GB / 30 days', 'price': '\$14'},
        {'name': 'Mint Mobile', 'data': 'Unlimited / 30 days', 'price': '\$30'},
      ],
      'localSim':
          'Available at airports, Best Buy, Target, and carrier stores.',
      'tip':
          'Coverage varies dramatically by carrier. T-Mobile and Verizon have the best coverage in cities.',
    },
    'driving': {
      'side': 'Right',
      'idpRequired': false,
      'idpNote':
          'IDP recommended but not always required. Some states accept foreign licenses for up to 90 days.',
      'speedLimits': {
        'urban': '25-35 mph (~40-55 km/h)',
        'rural': '55 mph (~90 km/h)',
        'expressway': '65-75 mph (~105-120 km/h)',
      },
      'rules': [
        'Right turn on red usually allowed (unless posted)',
        'Seat belts mandatory in most states',
        'School bus stop law: must stop when lights flash',
        'Speed limits vary significantly by state',
      ],
    },
  },
  'UAE': {
    'flag': '\u{1F1E6}\u{1F1EA}',
    'visa': {
      'type': 'Visa on Arrival / Tourist Visa',
      'processingTime': 'Instant (VOA for many nationalities)',
      'maxStay': '30-90 days depending on nationality',
      'passportValidity': '6 months beyond entry',
      'entryRestrictions': [
        'Israeli passport stamps are now accepted',
        'Certain medications require pre-approval',
        'Strict customs on importing goods',
        'Dress code expectations at entry',
      ],
      'documents': [
        'Passport with 6+ months validity',
        'Return ticket',
        'Hotel booking or host invitation',
        'Travel insurance recommended',
        'COVID vaccination record (check latest)',
      ],
    },
    'plugs': {
      'type': 'Type G',
      'voltage': '220V',
      'frequency': '50 Hz',
      'adapterNeeded': true,
      'adapterNote':
          'Uses UK-style three-pin rectangular plugs. US/EU travelers need an adapter. Hotels often provide adapters.',
      'plugVisual': 'Three rectangular pins in triangle pattern (Type G)',
    },
    'time': {
      'timezone': 'GST (UTC+4)',
      'utcOffset': 4,
      'dstObserved': false,
      'sunrise': '06:30',
      'sunset': '18:10',
      'jetLagFromUTC': '4 hours ahead',
    },
    'laws': {
      'photography': [
        'No photos of government/military buildings',
        'No photos of people without consent',
        'No photos inside mosques without permission',
      ],
      'drone': [
        'GCAA registration and permit required',
        'No flying in Dubai without DCAA permit',
        'Heavy fines for unauthorized drone use',
      ],
      'alcohol': [
        'Legal drinking age: 21',
        'Only in licensed venues (hotels, restaurants)',
        'Public intoxication is a criminal offense',
        'Zero tolerance for drink-driving',
      ],
      'lgbtq': {
        'safety': 'Unsafe',
        'note':
            'Same-sex relations are illegal. Exercise extreme discretion. Public displays of affection are illegal for all.',
        'color': 'error',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'Etisalat Visitor', 'data': '6GB / 14 days', 'price': '\$16'},
        {'name': 'du Tourist', 'data': '5GB / 28 days', 'price': '\$14'},
        {'name': 'Airalo', 'data': '3GB / 30 days', 'price': '\$11'},
      ],
      'localSim':
          'Available at airports. Etisalat and du are the two carriers. Passport and photo required.',
      'tip':
          'VoIP services (WhatsApp calls, FaceTime) may be restricted. Use a VPN or licensed alternatives.',
    },
    'driving': {
      'side': 'Right',
      'idpRequired': true,
      'idpNote':
          'IDP required for most nationalities. Some countries have reciprocal license agreements.',
      'speedLimits': {
        'urban': '60-80 km/h',
        'rural': '100 km/h',
        'expressway': '120-140 km/h',
      },
      'rules': [
        'Zero tolerance for alcohol while driving',
        'Speed cameras everywhere; flash fines are steep',
        'Seat belts mandatory',
        'Using phone while driving: heavy fine',
      ],
    },
  },
  'India': {
    'flag': '\u{1F1EE}\u{1F1F3}',
    'visa': {
      'type': 'e-Visa / Tourist Visa',
      'processingTime': '3-5 days (e-Visa) / 5-10 days (regular)',
      'maxStay': '30/90/180 days depending on visa type',
      'passportValidity': '6 months with 2 blank pages',
      'entryRestrictions': [
        'e-Visa available for 150+ nationalities',
        'Yellow fever certificate if from endemic area',
        'Restricted area permits for some regions',
        'Satellite phones require permission',
      ],
      'documents': [
        'Passport with 6+ months validity',
        'e-Visa printout or visa stamp',
        'Passport-size photos (2x2 inches)',
        'Return ticket',
        'Proof of accommodation',
      ],
    },
    'plugs': {
      'type': 'Type C / Type D / Type M',
      'voltage': '230V',
      'frequency': '50 Hz',
      'adapterNeeded': true,
      'adapterNote':
          'India uses a mix of plug types. A universal adapter is recommended. Power cuts are common; carry a power bank.',
      'plugVisual': 'Three large round pins (Type D/M) or two round pins (Type C)',
    },
    'time': {
      'timezone': 'IST (UTC+5:30)',
      'utcOffset': 5.5,
      'dstObserved': false,
      'sunrise': '06:20',
      'sunset': '18:25',
      'jetLagFromUTC': '5.5 hours ahead',
    },
    'laws': {
      'photography': [
        'No photos at military installations',
        'Some temples prohibit photography inside',
        'Taj Mahal: tripods and drones banned',
      ],
      'drone': [
        'DGCA registration required',
        'No flying near airports, borders, or military areas',
        'Foreign nationals need special permission',
      ],
      'alcohol': [
        'Legal age: 21-25 (varies by state)',
        'Gujarat and some states are fully dry',
        'Alcohol banned on national holidays',
        'Public drinking is generally frowned upon',
      ],
      'lgbtq': {
        'safety': 'Moderate',
        'note':
            'Homosexuality decriminalized in 2018. Same-sex marriage not recognized. Urban areas more accepting.',
        'color': 'warning',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'Jio', 'data': '2GB/day / 28 days', 'price': '\$3.50'},
        {'name': 'Airtel', 'data': '1.5GB/day / 28 days', 'price': '\$3'},
        {'name': 'Airalo', 'data': '5GB / 30 days', 'price': '\$8'},
      ],
      'localSim':
          'Indian SIM requires passport + local address proof. Process can take 24-48 hours to activate.',
      'tip':
          'eSIM via Airalo is easiest for tourists. Local SIMs are incredibly cheap but activation is slow.',
    },
    'driving': {
      'side': 'Left',
      'idpRequired': true,
      'idpNote':
          'IDP required. Driving in India is challenging due to traffic conditions. Hiring a driver is recommended.',
      'speedLimits': {
        'urban': '50 km/h',
        'rural': '70 km/h',
        'expressway': '100-120 km/h',
      },
      'rules': [
        'Horn usage is extremely common',
        'Traffic rules are loosely followed',
        'Hiring a driver is strongly recommended',
        'Avoid night driving outside cities',
      ],
    },
  },
  'Australia': {
    'flag': '\u{1F1E6}\u{1F1FA}',
    'visa': {
      'type': 'ETA / eVisitor / Tourist Visa (subclass 600)',
      'processingTime': 'Minutes (ETA) / 1-4 weeks (subclass 600)',
      'maxStay': '90 days (ETA) / 3-12 months (600)',
      'passportValidity': 'Valid for duration of stay',
      'entryRestrictions': [
        'Strict biosecurity: declare all food/plant/animal items',
        'Character requirements (criminal history check)',
        'Health requirements for some nationalities',
        'No work permitted on tourist visa',
      ],
      'documents': [
        'Valid passport',
        'ETA or visa grant letter',
        'Return/onward ticket',
        'Proof of funds (AUD \$5,000+)',
        'Travel insurance recommended',
      ],
    },
    'plugs': {
      'type': 'Type I',
      'voltage': '230V',
      'frequency': '50 Hz',
      'adapterNeeded': true,
      'adapterNote':
          'Australia uses unique angled flat pins (Type I). You will definitely need an adapter. Available at airports.',
      'plugVisual': 'Two angled flat pins with optional grounding pin (Type I)',
    },
    'time': {
      'timezone': 'AEST/ACST/AWST (UTC+8 to +11)',
      'utcOffset': 10,
      'dstObserved': true,
      'sunrise': '06:40',
      'sunset': '19:20',
      'jetLagFromUTC': '8-11 hours ahead (varies by state)',
    },
    'laws': {
      'photography': [
        'Generally permissive in public spaces',
        'Aboriginal sacred sites may restrict photography',
        'No photography at some military/government sites',
      ],
      'drone': [
        'CASA registration required',
        'No flying over people or in controlled airspace',
        'Max altitude 120m; must maintain visual line of sight',
      ],
      'alcohol': [
        'Legal drinking age: 18',
        'Strict drink-driving laws (0.05% BAC)',
        'Alcohol-free zones in many public areas',
        'Some Indigenous communities are dry zones',
      ],
      'lgbtq': {
        'safety': 'Very Safe',
        'note':
            'Same-sex marriage legal since 2017. Strong anti-discrimination laws. Sydney Mardi Gras is world-famous.',
        'color': 'success',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'Telstra Prepaid', 'data': '40GB / 28 days', 'price': 'AUD \$30'},
        {'name': 'Optus', 'data': '50GB / 28 days', 'price': 'AUD \$30'},
        {'name': 'Airalo', 'data': '5GB / 30 days', 'price': '\$10'},
      ],
      'localSim':
          'Available at airports and convenience stores. Excellent coverage in cities; patchy in outback.',
      'tip':
          'Telstra has the best rural/outback coverage. Essential if traveling beyond cities.',
    },
    'driving': {
      'side': 'Left',
      'idpRequired': true,
      'idpNote':
          'IDP required if license is not in English. Some states accept foreign licenses for 3 months.',
      'speedLimits': {
        'urban': '50 km/h',
        'rural': '100-110 km/h',
        'expressway': '110 km/h',
      },
      'rules': [
        'Kangaroos and wildlife on roads at dawn/dusk',
        'Distances between towns can be extreme (carry water/fuel)',
        'Seat belts mandatory for all occupants',
        'Random breath testing is common',
      ],
    },
  },
  'Brazil': {
    'flag': '\u{1F1E7}\u{1F1F7}',
    'visa': {
      'type': 'Visa Exemption / Tourist Visa / e-Visa',
      'processingTime': '5-15 business days (e-Visa)',
      'maxStay': '90 days within 180-day period',
      'passportValidity': '6 months beyond entry',
      'entryRestrictions': [
        'Yellow fever vaccination recommended (required from some countries)',
        'Return/onward ticket required',
        'Proof of financial means',
        'e-Visa now available for US, Canada, Australia citizens',
      ],
      'documents': [
        'Passport with 6+ months validity',
        'e-Visa or visa stamp',
        'Return ticket',
        'Proof of accommodation',
        'Yellow fever certificate (if applicable)',
      ],
    },
    'plugs': {
      'type': 'Type N',
      'voltage': '127V / 220V (varies by city)',
      'frequency': '60 Hz',
      'adapterNeeded': true,
      'adapterNote':
          'Brazil has its own unique plug (Type N). Voltage varies by region! Check hotel voltage before plugging in.',
      'plugVisual': 'Three round pins in triangle (Type N)',
    },
    'time': {
      'timezone': 'BRT (UTC-3)',
      'utcOffset': -3,
      'dstObserved': false,
      'sunrise': '05:55',
      'sunset': '17:50',
      'jetLagFromUTC': '3 hours behind',
    },
    'laws': {
      'photography': [
        'Generally permissive',
        'Avoid photographing in favelas without a guide',
        'Military areas are restricted',
      ],
      'drone': [
        'ANAC registration required',
        'No flying over crowds or urban areas without authorization',
        'Max altitude 120m',
      ],
      'alcohol': [
        'Legal drinking age: 18',
        'Public drinking is common and generally accepted',
        'Drink-driving limit: 0.0% BAC (zero tolerance)',
        'Drunk driving penalties are severe',
      ],
      'lgbtq': {
        'safety': 'Moderate (varies by region)',
        'note':
            'Same-sex marriage legal since 2013. Strong legal protections but violence against LGBTQ+ community remains an issue.',
        'color': 'warning',
      },
    },
    'sim': {
      'esimAvailable': true,
      'providers': [
        {'name': 'Claro', 'data': '15GB / 30 days', 'price': 'R\$50'},
        {'name': 'TIM', 'data': '10GB / 30 days', 'price': 'R\$40'},
        {'name': 'Airalo', 'data': '5GB / 30 days', 'price': '\$9'},
      ],
      'localSim':
          'Available at airports and phone stores. CPF (tax ID) used to be required but tourists can now register with passport.',
      'tip':
          'Claro has the best nationwide coverage. eSIM via Airalo is simplest for short visits.',
    },
    'driving': {
      'side': 'Right',
      'idpRequired': true,
      'idpNote':
          'IDP required alongside your original license. Inter-American Driving Permit also accepted.',
      'speedLimits': {
        'urban': '60 km/h',
        'rural': '80-100 km/h',
        'expressway': '110 km/h',
      },
      'rules': [
        'Headlights must be on at all times on highways',
        'Zero tolerance for alcohol while driving',
        'Toll roads (pedagios) are common on major highways',
        'Avoid driving at night in rural areas',
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

class TravelKitScreen extends ConsumerStatefulWidget {
  const TravelKitScreen({super.key});

  @override
  ConsumerState<TravelKitScreen> createState() => _TravelKitScreenState();
}

class _TravelKitScreenState extends ConsumerState<TravelKitScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final _tabs = const [
    Tab(icon: Icon(Icons.card_travel, size: 20), text: 'Visa'),
    Tab(icon: Icon(Icons.electrical_services, size: 20), text: 'Plugs'),
    Tab(icon: Icon(Icons.schedule, size: 20), text: 'Time'),
    Tab(icon: Icon(Icons.gavel, size: 20), text: 'Laws'),
    Tab(icon: Icon(Icons.sim_card, size: 20), text: 'SIM'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedCountry = ref.watch(selectedCountryProvider);
    final data = ref.watch(travelKitDataProvider(selectedCountry));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Kit'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(100),
          child: Column(
            children: [
              // Country selector chips
              SizedBox(
                height: 44,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _countries.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final country = _countries[index];
                    final isSelected = selectedCountry == country;
                    final flag =
                        _travelKitDatabase[country]?['flag'] as String? ?? '';
                    return ChoiceChip(
                      selected: isSelected,
                      onSelected: (_) => ref
                          .read(selectedCountryProvider.notifier)
                          .state = country,
                      label: Text('$flag $country'),
                      selectedColor:
                          AppColors.primary.withValues(alpha: 0.12),
                      labelStyle: TextStyle(
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.textSecondary,
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 4),
              // Tabs
              TabBar(
                controller: _tabController,
                tabs: _tabs,
                isScrollable: true,
                labelColor: AppColors.primary,
                unselectedLabelColor: AppColors.textTertiary,
                indicatorColor: AppColors.accent,
                indicatorWeight: 3,
                tabAlignment: TabAlignment.start,
              ),
            ],
          ),
        ),
      ),
      body: data == null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(48),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.luggage, size: 64, color: AppColors.textTertiary),
                    const SizedBox(height: 16),
                    Text(
                      'Travel kit for $selectedCountry coming soon!',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
            )
          : TabBarView(
              controller: _tabController,
              children: [
                _VisaTab(data: data),
                _PlugsTab(data: data),
                _TimeTab(data: data),
                _LawsTab(data: data),
                _SimTab(data: data),
              ],
            ),
    );
  }
}

// ===========================================================================
// TAB 1: Visa & Entry Requirements
// ===========================================================================

class _VisaTab extends StatelessWidget {
  final Map<String, dynamic> data;
  const _VisaTab({required this.data});

  @override
  Widget build(BuildContext context) {
    final visa = data['visa'] as Map<String, dynamic>;
    final restrictions = (visa['entryRestrictions'] as List<dynamic>?) ?? [];
    final documents = (visa['documents'] as List<dynamic>?) ?? [];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Visa summary card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.primary, AppColors.primaryLight],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(Icons.card_travel, color: AppColors.white, size: 32),
                const SizedBox(height: 8),
                Text(
                  visa['type'] as String,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _VisaInfoPill(
                      icon: Icons.timer,
                      label: 'Processing',
                      value: visa['processingTime'] as String,
                    ),
                    const SizedBox(width: 8),
                    _VisaInfoPill(
                      icon: Icons.calendar_today,
                      label: 'Max Stay',
                      value: visa['maxStay'] as String,
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Passport validity check
          _InfoBanner(
            icon: Icons.menu_book,
            color: AppColors.info,
            title: 'Passport Validity Requirement',
            subtitle: visa['passportValidity'] as String,
          ),
          const SizedBox(height: 20),

          // Required documents
          _SectionHeader(title: 'Required Documents'),
          const SizedBox(height: 12),
          ...documents.asMap().entries.map((entry) => _ChecklistItem(
                index: entry.key + 1,
                text: entry.value as String,
                color: AppColors.success,
              )),
          const SizedBox(height: 20),

          // Entry restrictions
          _SectionHeader(title: 'Entry Restrictions & Notes'),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.warning.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border:
                  Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.warning_amber_rounded,
                        color: AppColors.warning, size: 20),
                    SizedBox(width: 8),
                    Text('Important',
                        style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: AppColors.warning)),
                  ],
                ),
                const SizedBox(height: 10),
                ...restrictions.map(
                  (r) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('  \u2022  ',
                            style: TextStyle(
                                color: AppColors.warning,
                                fontWeight: FontWeight.w700)),
                        Expanded(
                          child: Text(
                            r as String,
                            style: const TextStyle(
                                fontSize: 13, height: 1.4),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _VisaInfoPill extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _VisaInfoPill(
      {required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppColors.white.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.white, size: 16),
            const SizedBox(height: 4),
            Text(label,
                style: TextStyle(
                    color: AppColors.white.withValues(alpha: 0.8),
                    fontSize: 10)),
            const SizedBox(height: 2),
            Text(
              value,
              style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// ===========================================================================
// TAB 2: Plugs & Voltage
// ===========================================================================

class _PlugsTab extends StatelessWidget {
  final Map<String, dynamic> data;
  const _PlugsTab({required this.data});

  @override
  Widget build(BuildContext context) {
    final plugs = data['plugs'] as Map<String, dynamic>;
    final driving = data['driving'] as Map<String, dynamic>;
    final speedLimits =
        (driving['speedLimits'] as Map<String, dynamic>?) ?? {};

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Plug type hero card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.badgeExplorer,
                  AppColors.badgeExplorer.withValues(alpha: 0.7),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(Icons.electrical_services,
                    color: AppColors.white, size: 40),
                const SizedBox(height: 8),
                Text(
                  plugs['type'] as String,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  plugs['plugVisual'] as String,
                  style: TextStyle(
                    color: AppColors.white.withValues(alpha: 0.85),
                    fontSize: 13,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Voltage & frequency
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  icon: Icons.bolt,
                  label: 'Voltage',
                  value: plugs['voltage'] as String,
                  color: AppColors.warning,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  icon: Icons.waves,
                  label: 'Frequency',
                  value: plugs['frequency'] as String,
                  color: AppColors.info,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Adapter recommendation
          _InfoBanner(
            icon: (plugs['adapterNeeded'] as bool)
                ? Icons.power
                : Icons.check_circle,
            color: (plugs['adapterNeeded'] as bool)
                ? AppColors.accent
                : AppColors.success,
            title: (plugs['adapterNeeded'] as bool)
                ? 'Adapter Required'
                : 'No Adapter Needed',
            subtitle: plugs['adapterNote'] as String,
          ),
          const SizedBox(height: 24),

          // Driving section
          _SectionHeader(title: 'Driving Requirements'),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  icon: Icons.swap_horiz,
                  label: 'Traffic Side',
                  value: driving['side'] as String,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  icon: Icons.badge,
                  label: 'IDP Required',
                  value: (driving['idpRequired'] as bool) ? 'Yes' : 'No',
                  color: (driving['idpRequired'] as bool)
                      ? AppColors.warning
                      : AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // IDP note
          Card(
            margin: EdgeInsets.zero,
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.info_outline,
                      color: AppColors.info, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      driving['idpNote'] as String,
                      style: const TextStyle(fontSize: 13, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Speed limits
          _SectionHeader(title: 'Speed Limits'),
          const SizedBox(height: 12),
          Row(
            children: [
              _SpeedLimitChip(
                  label: 'Urban', value: speedLimits['urban'] as String? ?? ''),
              const SizedBox(width: 8),
              _SpeedLimitChip(
                  label: 'Rural', value: speedLimits['rural'] as String? ?? ''),
              const SizedBox(width: 8),
              _SpeedLimitChip(
                  label: 'Highway',
                  value: speedLimits['expressway'] as String? ?? ''),
            ],
          ),
          const SizedBox(height: 16),

          // Driving rules
          _SectionHeader(title: 'Road Rules'),
          const SizedBox(height: 12),
          ...(driving['rules'] as List<dynamic>).map(
            (rule) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 2),
                    width: 20,
                    height: 20,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(Icons.directions_car,
                        size: 12, color: AppColors.primary),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      rule as String,
                      style: const TextStyle(fontSize: 13, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _SpeedLimitChip extends StatelessWidget {
  final String label;
  final String value;
  const _SpeedLimitChip({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Text(label,
                style: const TextStyle(
                    fontSize: 11, color: AppColors.textSecondary)),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// ===========================================================================
// TAB 3: Time Zone Dashboard
// ===========================================================================

class _TimeTab extends StatelessWidget {
  final Map<String, dynamic> data;
  const _TimeTab({required this.data});

  @override
  Widget build(BuildContext context) {
    final time = data['time'] as Map<String, dynamic>;
    final utcOffset = time['utcOffset'];
    final double offsetHours =
        (utcOffset is int) ? utcOffset.toDouble() : utcOffset as double;

    // Compute destination time from UTC
    final now = DateTime.now().toUtc();
    final destTime = now.add(Duration(
      hours: offsetHours.truncate(),
      minutes: ((offsetHours - offsetHours.truncate()) * 60).round(),
    ));

    // Estimate jet lag (simplistic: 1 day per hour of offset from local)
    final localOffset = DateTime.now().timeZoneOffset.inHours;
    final diff = (offsetHours - localOffset).abs().round();
    final jetLagDays = diff; // rough: 1 day recovery per hour

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timezone hero
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.primaryDark,
                  AppColors.primary.withValues(alpha: 0.8),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(Icons.public, color: AppColors.white, size: 32),
                const SizedBox(height: 8),
                Text(
                  time['timezone'] as String,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  time['jetLagFromUTC'] as String,
                  style: TextStyle(
                    color: AppColors.white.withValues(alpha: 0.8),
                    fontSize: 13,
                  ),
                ),
                if (time['dstObserved'] == true) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.warning.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'Daylight Saving Time Observed',
                      style: TextStyle(
                        color: AppColors.warning,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Home vs Destination clocks
          Row(
            children: [
              Expanded(
                child: _ClockCard(
                  label: 'Your Time',
                  time: _formatTime(DateTime.now()),
                  icon: Icons.home,
                  color: AppColors.info,
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 8),
                child: Icon(Icons.arrow_forward,
                    color: AppColors.textTertiary, size: 20),
              ),
              Expanded(
                child: _ClockCard(
                  label: 'Destination',
                  time: _formatTime(destTime),
                  icon: Icons.flight_land,
                  color: AppColors.accent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Time difference
          _StatCard(
            icon: Icons.compare_arrows,
            label: 'Time Difference',
            value: '${diff > 0 ? "+" : ""}$diff hours',
            color: AppColors.badgeExplorer,
          ),
          const SizedBox(height: 16),

          // Jet lag estimator
          _SectionHeader(title: 'Jet Lag Estimator'),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _jetLagColor(jetLagDays).withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: _jetLagColor(jetLagDays).withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      jetLagDays <= 3
                          ? Icons.sentiment_satisfied
                          : jetLagDays <= 6
                              ? Icons.sentiment_neutral
                              : Icons.sentiment_dissatisfied,
                      color: _jetLagColor(jetLagDays),
                      size: 28,
                    ),
                    const SizedBox(width: 10),
                    Text(
                      jetLagDays == 0
                          ? 'No Jet Lag!'
                          : 'Est. Recovery: ~$jetLagDays days',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                        color: _jetLagColor(jetLagDays),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                // Severity bar
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: (jetLagDays / 12).clamp(0.0, 1.0),
                    minHeight: 8,
                    backgroundColor: AppColors.border,
                    valueColor: AlwaysStoppedAnimation(
                        _jetLagColor(jetLagDays)),
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Mild',
                        style: TextStyle(
                            fontSize: 10, color: AppColors.textTertiary)),
                    Text('Moderate',
                        style: TextStyle(
                            fontSize: 10, color: AppColors.textTertiary)),
                    Text('Severe',
                        style: TextStyle(
                            fontSize: 10, color: AppColors.textTertiary)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Sunrise/Sunset
          _SectionHeader(title: 'Sunrise & Sunset'),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  icon: Icons.wb_sunny,
                  label: 'Sunrise',
                  value: time['sunrise'] as String,
                  color: AppColors.warning,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  icon: Icons.nightlight_round,
                  label: 'Sunset',
                  value: time['sunset'] as String,
                  color: AppColors.badgeExplorer,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Tips
          _InfoBanner(
            icon: Icons.tips_and_updates,
            color: AppColors.info,
            title: 'Jet Lag Tips',
            subtitle:
                'Adjust your sleep schedule 2-3 days before departure. Stay hydrated, avoid caffeine on the flight, and get sunlight at your destination to reset your circadian rhythm.',
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  static Color _jetLagColor(int hours) {
    if (hours <= 3) return AppColors.success;
    if (hours <= 6) return AppColors.warning;
    return AppColors.error;
  }

  static String _formatTime(DateTime dt) {
    final h = dt.hour;
    final m = dt.minute.toString().padLeft(2, '0');
    final period = h >= 12 ? 'PM' : 'AM';
    final hour12 = h == 0 ? 12 : (h > 12 ? h - 12 : h);
    return '$hour12:$m $period';
  }
}

class _ClockCard extends StatelessWidget {
  final String label;
  final String time;
  final IconData icon;
  final Color color;
  const _ClockCard(
      {required this.label,
      required this.time,
      required this.icon,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 6),
          Text(label,
              style: TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500)),
          const SizedBox(height: 4),
          Text(
            time,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 4: Local Laws
// ===========================================================================

class _LawsTab extends StatelessWidget {
  final Map<String, dynamic> data;
  const _LawsTab({required this.data});

  @override
  Widget build(BuildContext context) {
    final laws = data['laws'] as Map<String, dynamic>;
    final photography = (laws['photography'] as List<dynamic>?) ?? [];
    final drone = (laws['drone'] as List<dynamic>?) ?? [];
    final alcohol = (laws['alcohol'] as List<dynamic>?) ?? [];
    final lgbtq = laws['lgbtq'] as Map<String, dynamic>?;

    Color lgbtqColor() {
      switch (lgbtq?['color']) {
        case 'success':
          return AppColors.success;
        case 'warning':
          return AppColors.warning;
        case 'error':
          return AppColors.error;
        default:
          return AppColors.info;
      }
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // LGBTQ+ Safety banner
          if (lgbtq != null) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: lgbtqColor().withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14),
                border:
                    Border.all(color: lgbtqColor().withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: lgbtqColor().withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(Icons.shield, color: lgbtqColor(), size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              'LGBTQ+ Safety: ',
                              style: TextStyle(
                                  fontWeight: FontWeight.w700, fontSize: 14),
                            ),
                            Text(
                              lgbtq['safety'] as String,
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                                color: lgbtqColor(),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          lgbtq['note'] as String,
                          style: const TextStyle(
                              fontSize: 12, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],

          // Photography restrictions
          _LawSection(
            icon: Icons.camera_alt,
            title: 'Photography Restrictions',
            color: AppColors.badgeCulture,
            items: photography.cast<String>(),
          ),
          const SizedBox(height: 16),

          // Drone laws
          _LawSection(
            icon: Icons.flight,
            title: 'Drone Laws',
            color: AppColors.badgeAdventure,
            items: drone.cast<String>(),
          ),
          const SizedBox(height: 16),

          // Alcohol laws
          _LawSection(
            icon: Icons.local_bar,
            title: 'Alcohol Laws',
            color: AppColors.accent,
            items: alcohol.cast<String>(),
          ),
          const SizedBox(height: 20),

          // Disclaimer
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline,
                    size: 16, color: AppColors.textTertiary),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Laws and regulations may change. Always verify current rules with official government sources before traveling.',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _LawSection extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final List<String> items;
  const _LawSection(
      {required this.icon,
      required this.title,
      required this.color,
      required this.items});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 12),
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700, fontSize: 15)),
              ],
            ),
            const SizedBox(height: 12),
            ...items.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        item,
                        style:
                            const TextStyle(fontSize: 13, height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ===========================================================================
// TAB 5: SIM / eSIM Guide
// ===========================================================================

class _SimTab extends StatelessWidget {
  final Map<String, dynamic> data;
  const _SimTab({required this.data});

  @override
  Widget build(BuildContext context) {
    final sim = data['sim'] as Map<String, dynamic>;
    final providers = (sim['providers'] as List<dynamic>?) ?? [];
    final esimAvailable = sim['esimAvailable'] as bool? ?? false;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // eSIM compatibility
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: esimAvailable
                    ? [AppColors.success, AppColors.badgeAdventure]
                    : [AppColors.textSecondary, AppColors.textTertiary],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                Icon(
                  esimAvailable ? Icons.sim_card : Icons.sim_card_alert,
                  color: AppColors.white,
                  size: 36,
                ),
                const SizedBox(height: 8),
                Text(
                  esimAvailable
                      ? 'eSIM Available'
                      : 'eSIM Not Available',
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  esimAvailable
                      ? 'Download an eSIM before you travel -- no physical SIM needed!'
                      : 'You will need a physical SIM card for this destination.',
                  style: TextStyle(
                    color: AppColors.white.withValues(alpha: 0.85),
                    fontSize: 13,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Providers
          _SectionHeader(title: 'Recommended Providers'),
          const SizedBox(height: 12),
          ...providers.map((p) {
            final provider = p as Map<String, dynamic>;
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.accent.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.cell_tower,
                          color: AppColors.accent, size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            provider['name'] as String,
                            style: const TextStyle(
                                fontWeight: FontWeight.w700, fontSize: 15),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            provider['data'] as String,
                            style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.success.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        provider['price'] as String,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColors.success,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 16),

          // Local SIM info
          _SectionHeader(title: 'Local SIM Card'),
          const SizedBox(height: 12),
          Card(
            margin: EdgeInsets.zero,
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: AppColors.info.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.store,
                        color: AppColors.info, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      sim['localSim'] as String,
                      style: const TextStyle(fontSize: 13, height: 1.5),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Tip
          _InfoBanner(
            icon: Icons.lightbulb_outline,
            color: AppColors.badgeFoodie,
            title: 'Pro Tip',
            subtitle: sim['tip'] as String,
          ),

          const SizedBox(height: 20),

          // Device compatibility note
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.phone_android,
                        size: 18, color: AppColors.textSecondary),
                    SizedBox(width: 8),
                    Text(
                      'eSIM Compatibility',
                      style: TextStyle(
                          fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Most iPhones (XS+), Samsung Galaxy S20+, Google Pixel 3+ support eSIM. Check your device settings before purchasing.',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

// ===========================================================================
// Shared Widgets
// ===========================================================================

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context)
          .textTheme
          .titleMedium
          ?.copyWith(fontWeight: FontWeight.w700),
    );
  }
}

class _InfoBanner extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  const _InfoBanner(
      {required this.icon,
      required this.color,
      required this.title,
      required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style:
                      TextStyle(fontWeight: FontWeight.w700, color: color),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 13, height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  const _StatCard(
      {required this.icon,
      required this.label,
      required this.value,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 6),
          Text(label,
              style: const TextStyle(
                  fontSize: 11, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: color,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _ChecklistItem extends StatelessWidget {
  final int index;
  final String text;
  final Color color;
  const _ChecklistItem(
      {required this.index, required this.text, required this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(7),
            ),
            child: Center(
              child: Text(
                '$index',
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 13, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
