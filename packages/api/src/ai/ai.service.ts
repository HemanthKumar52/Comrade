import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly prisma: PrismaService) {}

  async narrateTrip(tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        routeLogs: true,
        notes: true,
        members: { include: { user: { select: { id: true, name: true } } } },
        passportStamps: true,
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip ${tripId} not found`);
    }

    const totalKm = trip.distanceKm || trip.routeLogs.reduce((s, r) => s + (r.distanceKm || 0), 0);
    const memberNames = trip.members.map((m) => m.user.name).filter(Boolean);
    const noteCount = trip.notes?.length || 0;
    const stampCount = trip.passportStamps?.length || 0;

    const templates = [
      `It all started with a plan to travel from ${trip.source} to ${trip.destination}.`,
      memberNames.length > 1
        ? `${memberNames.join(', ')} set out together on this ${trip.type?.toLowerCase() || ''} adventure.`
        : `A solo journey, filled with discovery and wonder.`,
      totalKm > 0
        ? `Over the course of the trip, ${Math.round(totalKm)} kilometers were covered${trip.vehicleType ? ` by ${trip.vehicleType.toLowerCase()}` : ''}.`
        : '',
      trip.startedAt
        ? `The journey began on ${new Date(trip.startedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`
        : '',
      trip.completedAt
        ? `And it came to a close on ${new Date(trip.completedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`
        : '',
      noteCount > 0
        ? `Along the way, ${noteCount} ${noteCount === 1 ? 'memory was' : 'memories were'} captured in notes.`
        : '',
      stampCount > 0
        ? `${stampCount} passport ${stampCount === 1 ? 'stamp was' : 'stamps were'} collected, each marking a place that left its mark in return.`
        : '',
      `The road from ${trip.source} to ${trip.destination} was more than just a route on a map. It was a story waiting to be told.`,
    ];

    const narrative = templates.filter(Boolean).join(' ');

    return {
      tripId,
      title: trip.title,
      narrative,
      stats: {
        totalKm: Math.round(totalKm),
        source: trip.source,
        destination: trip.destination,
        memberCount: trip.members.length,
        noteCount,
        stampCount,
        vehicleType: trip.vehicleType,
      },
    };
  }

  suggestRoute(from: string, mood: string, duration: number) {
    const moodLower = mood.toLowerCase();
    const routes = MOOD_ROUTES[moodLower] || MOOD_ROUTES['cultural'];

    const filtered = routes.filter(
      (r) => r.durationDays <= duration + 2 && r.durationDays >= Math.max(1, duration - 2),
    );

    const results = filtered.length > 0 ? filtered : routes.slice(0, 3);

    return {
      mood: moodLower,
      from,
      suggestedDuration: duration,
      routes: results.map((r) => ({
        ...r,
        personalNote: `Starting from ${from}, this ${moodLower} route takes you through ${r.highlights.slice(0, 2).join(' and ')}.`,
      })),
    };
  }

  getMoodRoutes(mood: string, from: string) {
    const moodLower = mood.toLowerCase();
    const allRoutes = INDIAN_CITY_ROUTES[from.toLowerCase()] || [];

    const filtered = allRoutes.filter((r) => r.mood === moodLower);
    return {
      mood: moodLower,
      from,
      routes: filtered.length > 0 ? filtered : allRoutes.slice(0, 5),
      availableMoods: ['peaceful', 'adventurous', 'foodie', 'cultural', 'budget', 'luxury'],
    };
  }

  getTravelTips(country: string) {
    const code = country.toUpperCase();
    const tips = TRAVEL_TIPS[code];
    if (!tips) {
      return { country: code, tips: TRAVEL_TIPS['GENERAL'] };
    }
    return { country: code, tips };
  }

  getRecommendations(country: string) {
    const code = country.toUpperCase();
    const recs = RECOMMENDATIONS[code];
    if (!recs) {
      return { country: code, message: `No specific recommendations for ${code}. Try popular destinations like IN, JP, TH, FR.` };
    }
    return { country: code, ...recs };
  }
}

const MOOD_ROUTES: Record<string, any[]> = {
  peaceful: [
    { name: 'Kerala Backwaters Retreat', destination: 'Alleppey, Kerala', durationDays: 5, highlights: ['houseboat cruise', 'ayurvedic spa', 'paddy fields', 'sunset at Vembanad Lake'], estimatedBudget: 'INR 25,000', transport: 'train + houseboat' },
    { name: 'Udaipur Lake Serenity', destination: 'Udaipur, Rajasthan', durationDays: 4, highlights: ['Lake Pichola boat ride', 'City Palace', 'Saheliyon ki Bari', 'sunset at Monsoon Palace'], estimatedBudget: 'INR 20,000', transport: 'flight + auto' },
    { name: 'Coorg Coffee Trail', destination: 'Coorg, Karnataka', durationDays: 3, highlights: ['coffee plantations', 'Abbey Falls', 'Raja Seat sunset', 'Dubare elephant camp'], estimatedBudget: 'INR 12,000', transport: 'car' },
    { name: 'Pondicherry French Quarter', destination: 'Pondicherry', durationDays: 3, highlights: ['Promenade Beach', 'Auroville', 'French Quarter cafes', 'Sri Aurobindo Ashram'], estimatedBudget: 'INR 10,000', transport: 'bus/car' },
    { name: 'Hampi Ruins Meditation', destination: 'Hampi, Karnataka', durationDays: 3, highlights: ['Virupaksha Temple', 'sunset at Hemakuta Hill', 'coracle ride', 'boulder meditation'], estimatedBudget: 'INR 8,000', transport: 'train + auto' },
  ],
  adventurous: [
    { name: 'Ladakh Highway Expedition', destination: 'Leh-Ladakh', durationDays: 10, highlights: ['Khardung La pass', 'Pangong Lake', 'Nubra Valley', 'Magnetic Hill', 'Tso Moriri'], estimatedBudget: 'INR 40,000', transport: 'bike/car' },
    { name: 'Rishikesh Adrenaline Rush', destination: 'Rishikesh, Uttarakhand', durationDays: 4, highlights: ['river rafting', 'bungee jumping', 'cliff jumping', 'camping by Ganges'], estimatedBudget: 'INR 15,000', transport: 'bus/car' },
    { name: 'Spiti Valley Circuit', destination: 'Spiti, Himachal Pradesh', durationDays: 8, highlights: ['Key Monastery', 'Chandratal Lake', 'Kunzum Pass', 'Pin Valley'], estimatedBudget: 'INR 30,000', transport: 'car/bike' },
    { name: 'Meghalaya Living Root Bridges', destination: 'Cherrapunji, Meghalaya', durationDays: 5, highlights: ['Double Decker Root Bridge', 'Dawki River', 'Mawsmai Caves', 'wettest place on earth'], estimatedBudget: 'INR 20,000', transport: 'flight + car' },
    { name: 'Andaman Scuba Trail', destination: 'Andaman Islands', durationDays: 7, highlights: ['Havelock Island', 'scuba diving', 'Radhanagar Beach', 'sea kayaking', 'bioluminescence'], estimatedBudget: 'INR 35,000', transport: 'flight + ferry' },
  ],
  foodie: [
    { name: 'Old Delhi Food Walk', destination: 'Delhi', durationDays: 3, highlights: ['Chandni Chowk street food', 'Paranthe Wali Gali', 'Jama Masjid kebabs', 'Karim\'s'], estimatedBudget: 'INR 8,000', transport: 'metro + walk' },
    { name: 'Lucknow Nawabi Feast', destination: 'Lucknow, UP', durationDays: 3, highlights: ['Tunday Kababi', 'Chowk biryani', 'Prakash ki Kulfi', 'Idris ki Biryani'], estimatedBudget: 'INR 8,000', transport: 'train' },
    { name: 'Kolkata Sweet Trail', destination: 'Kolkata', durationDays: 4, highlights: ['Park Street restaurants', 'Flurys', 'College Street coffee', 'Arsalan biryani', 'Rosogolla trail'], estimatedBudget: 'INR 10,000', transport: 'flight + metro' },
    { name: 'Chennai to Chettinad', destination: 'Chettinad, Tamil Nadu', durationDays: 4, highlights: ['Marina Beach snacks', 'Chettinad mansions', 'spice cooking class', 'filter coffee tour'], estimatedBudget: 'INR 12,000', transport: 'car' },
    { name: 'Amritsar Golden Feast', destination: 'Amritsar, Punjab', durationDays: 3, highlights: ['Langar at Golden Temple', 'Kesar da Dhaba', 'Beera Chicken', 'Lassi at Ahuja'], estimatedBudget: 'INR 8,000', transport: 'train' },
  ],
  cultural: [
    { name: 'Rajasthan Heritage Circuit', destination: 'Jaipur-Jodhpur-Jaisalmer', durationDays: 8, highlights: ['Amber Fort', 'Mehrangarh Fort', 'Jaisalmer Fort', 'desert safari', 'puppet shows'], estimatedBudget: 'INR 30,000', transport: 'train + car' },
    { name: 'Varanasi Spiritual Journey', destination: 'Varanasi, UP', durationDays: 4, highlights: ['Ganga Aarti', 'boat ride at dawn', 'Sarnath', 'silk weaving workshops'], estimatedBudget: 'INR 12,000', transport: 'train/flight' },
    { name: 'Mysore Royal Trail', destination: 'Mysore, Karnataka', durationDays: 3, highlights: ['Mysore Palace', 'Chamundi Hills', 'Brindavan Gardens', 'silk saree shopping'], estimatedBudget: 'INR 10,000', transport: 'train/car' },
    { name: 'Madurai Temple Trail', destination: 'Madurai, Tamil Nadu', durationDays: 3, highlights: ['Meenakshi Temple', 'Thirumalai Nayakkar Palace', 'banana leaf meals', 'Jigarthanda'], estimatedBudget: 'INR 8,000', transport: 'train/flight' },
    { name: 'Khajuraho & Orchha Heritage', destination: 'Khajuraho-Orchha, MP', durationDays: 4, highlights: ['UNESCO temples', 'light & sound show', 'Orchha Fort', 'Betwa River'], estimatedBudget: 'INR 12,000', transport: 'train + car' },
  ],
  budget: [
    { name: 'McLeod Ganj Backpacker', destination: 'McLeod Ganj, HP', durationDays: 4, highlights: ['Triund trek', 'Dalai Lama temple', 'Bhagsu waterfall', 'Tibetan food'], estimatedBudget: 'INR 5,000', transport: 'bus' },
    { name: 'Goa Off-Season', destination: 'Goa', durationDays: 5, highlights: ['Anjuna flea market', 'Old Goa churches', 'beach hopping', 'seafood shacks'], estimatedBudget: 'INR 8,000', transport: 'train' },
    { name: 'Pushkar Chill', destination: 'Pushkar, Rajasthan', durationDays: 3, highlights: ['Pushkar Lake', 'Brahma Temple', 'sunset point', 'rooftop cafes'], estimatedBudget: 'INR 4,000', transport: 'bus' },
    { name: 'Hampi on a Shoestring', destination: 'Hampi, Karnataka', durationDays: 3, highlights: ['temple ruins', 'coracle rides', 'Hippie Island', 'sunset bouldering'], estimatedBudget: 'INR 4,000', transport: 'train' },
    { name: 'Bir Billing Paraglide', destination: 'Bir, Himachal Pradesh', durationDays: 3, highlights: ['paragliding', 'Tibetan colony', 'tea gardens', 'monastery visits'], estimatedBudget: 'INR 6,000', transport: 'bus' },
  ],
  luxury: [
    { name: 'Udaipur Palace Experience', destination: 'Udaipur, Rajasthan', durationDays: 4, highlights: ['Taj Lake Palace stay', 'private boat dinner', 'vintage car tour', 'royal spa'], estimatedBudget: 'INR 1,50,000', transport: 'flight + chauffeur' },
    { name: 'Kerala Luxury Houseboat', destination: 'Alleppey, Kerala', durationDays: 5, highlights: ['premium houseboat', 'Ayurvedic retreat', 'spice plantation tour', 'Kathakali show'], estimatedBudget: 'INR 1,00,000', transport: 'flight + private car' },
    { name: 'Maldives from India', destination: 'Maldives', durationDays: 5, highlights: ['overwater villa', 'private snorkeling', 'dolphin cruise', 'underwater restaurant'], estimatedBudget: 'INR 3,00,000', transport: 'flight' },
    { name: 'Goa Luxury Retreat', destination: 'South Goa', durationDays: 4, highlights: ['five-star beach resort', 'private beach', 'yacht cruise', 'Michelin-style dining'], estimatedBudget: 'INR 80,000', transport: 'flight + cab' },
    { name: 'Ranthambore Safari Royale', destination: 'Ranthambore, Rajasthan', durationDays: 3, highlights: ['luxury jungle lodge', 'private safari', 'tiger spotting', 'heritage fort dinner'], estimatedBudget: 'INR 70,000', transport: 'train + private car' },
  ],
};

const INDIAN_CITY_ROUTES: Record<string, any[]> = {
  mumbai: [
    { destination: 'Lonavala', mood: 'peaceful', distance: '83 km', duration: '2 hrs', highlights: ['Bhushi Dam', 'Tiger Point', 'Karla Caves'] },
    { destination: 'Alibaug', mood: 'peaceful', distance: '95 km', duration: '3 hrs', highlights: ['Alibaug Beach', 'Kolaba Fort', 'water sports'] },
    { destination: 'Rajmachi Fort', mood: 'adventurous', distance: '70 km', duration: '3 hrs', highlights: ['night trek', 'Shrivardhan Fort', 'fireflies'] },
    { destination: 'Nashik', mood: 'foodie', distance: '166 km', duration: '3.5 hrs', highlights: ['Sula Vineyards', 'wine tasting', 'Panchavati'] },
    { destination: 'Ajanta-Ellora', mood: 'cultural', distance: '350 km', duration: '6 hrs', highlights: ['UNESCO caves', 'Bibi Ka Maqbara', 'Daulatabad Fort'] },
    { destination: 'Goa', mood: 'budget', distance: '590 km', duration: '10 hrs', highlights: ['beach parties', 'Old Goa', 'seafood'] },
    { destination: 'Mahabaleshwar', mood: 'luxury', distance: '263 km', duration: '5 hrs', highlights: ['strawberry farms', 'valley views', 'heritage hotels'] },
  ],
  delhi: [
    { destination: 'Agra', mood: 'cultural', distance: '233 km', duration: '3.5 hrs', highlights: ['Taj Mahal', 'Agra Fort', 'petha sweets'] },
    { destination: 'Rishikesh', mood: 'adventurous', distance: '243 km', duration: '5.5 hrs', highlights: ['rafting', 'bungee', 'camping'] },
    { destination: 'Jaipur', mood: 'cultural', distance: '281 km', duration: '5 hrs', highlights: ['Amber Fort', 'Hawa Mahal', 'dal bati churma'] },
    { destination: 'Mussoorie', mood: 'peaceful', distance: '288 km', duration: '6 hrs', highlights: ['Kempty Falls', 'Mall Road', 'cloud end'] },
    { destination: 'Amritsar', mood: 'foodie', distance: '450 km', duration: '7.5 hrs', highlights: ['Golden Temple', 'Wagah Border', 'street food'] },
    { destination: 'McLeod Ganj', mood: 'budget', distance: '481 km', duration: '9 hrs', highlights: ['Triund trek', 'Dalai Lama complex', 'momos'] },
    { destination: 'Neemrana Fort Palace', mood: 'luxury', distance: '122 km', duration: '2.5 hrs', highlights: ['heritage hotel', 'zip-lining', 'Rajput dining'] },
  ],
  bangalore: [
    { destination: 'Coorg', mood: 'peaceful', distance: '265 km', duration: '5.5 hrs', highlights: ['coffee estates', 'Abbey Falls', 'Raja Seat'] },
    { destination: 'Nandi Hills', mood: 'adventurous', distance: '60 km', duration: '1.5 hrs', highlights: ['sunrise point', 'cycling', 'paragliding'] },
    { destination: 'Mysore', mood: 'cultural', distance: '143 km', duration: '3 hrs', highlights: ['Mysore Palace', 'Chamundi Hills', 'silk shopping'] },
    { destination: 'Pondicherry', mood: 'foodie', distance: '310 km', duration: '6 hrs', highlights: ['French cuisine', 'beach cafes', 'Auroville'] },
    { destination: 'Hampi', mood: 'budget', distance: '340 km', duration: '6.5 hrs', highlights: ['ruins', 'coracle ride', 'boulder climbing'] },
    { destination: 'Kabini', mood: 'luxury', distance: '220 km', duration: '4.5 hrs', highlights: ['jungle lodge', 'safari', 'river resort'] },
    { destination: 'BR Hills', mood: 'adventurous', distance: '185 km', duration: '4 hrs', highlights: ['wildlife sanctuary', 'tribal village', 'trekking'] },
  ],
  chennai: [
    { destination: 'Mahabalipuram', mood: 'cultural', distance: '58 km', duration: '1.5 hrs', highlights: ['Shore Temple', 'Five Rathas', 'beach'] },
    { destination: 'Pondicherry', mood: 'peaceful', distance: '150 km', duration: '3 hrs', highlights: ['French Quarter', 'Auroville', 'Promenade'] },
    { destination: 'Yelagiri', mood: 'adventurous', distance: '228 km', duration: '4.5 hrs', highlights: ['trekking', 'boating', 'paragliding'] },
    { destination: 'Chettinad', mood: 'foodie', distance: '400 km', duration: '7 hrs', highlights: ['Chettinad cuisine', 'mansions', 'Karaikudi'] },
    { destination: 'Kodaikanal', mood: 'peaceful', distance: '466 km', duration: '8 hrs', highlights: ['Coaker Walk', 'Pillar Rocks', 'lake'] },
    { destination: 'Rameshwaram', mood: 'cultural', distance: '572 km', duration: '9 hrs', highlights: ['Ramanathaswamy Temple', 'Pamban Bridge', 'Dhanushkodi'] },
    { destination: 'Tranquebar', mood: 'budget', distance: '275 km', duration: '5 hrs', highlights: ['Danish fort', 'beach', 'heritage town'] },
  ],
  kolkata: [
    { destination: 'Sundarbans', mood: 'adventurous', distance: '109 km', duration: '4 hrs', highlights: ['Royal Bengal Tiger', 'mangrove forest', 'boat safari'] },
    { destination: 'Shantiniketan', mood: 'cultural', distance: '165 km', duration: '3.5 hrs', highlights: ['Tagore university', 'Baul music', 'art festivals'] },
    { destination: 'Darjeeling', mood: 'peaceful', distance: '615 km', duration: '11 hrs', highlights: ['tea gardens', 'toy train', 'Kanchenjunga view'] },
    { destination: 'Murshidabad', mood: 'cultural', distance: '220 km', duration: '5 hrs', highlights: ['Hazarduari Palace', 'Katra Mosque', 'silk'] },
    { destination: 'Diamond Harbour', mood: 'budget', distance: '50 km', duration: '1.5 hrs', highlights: ['riverside', 'fort ruins', 'sunset'] },
  ],
};

const TRAVEL_TIPS: Record<string, any> = {
  GENERAL: {
    beforeTravel: ['Make copies of important documents', 'Inform your bank about travel plans', 'Buy travel insurance', 'Download offline maps', 'Learn basic local phrases'],
    packing: ['Pack light - you can buy most things locally', 'Carry a universal power adapter', 'Bring a reusable water bottle with filter', 'Pack a basic first-aid kit'],
    safety: ['Keep emergency numbers saved', 'Share your itinerary with someone', 'Trust your instincts', 'Avoid displaying expensive items'],
    money: ['Carry some local currency for small purchases', 'Use ATMs at banks, not standalone ones', 'Notify your credit card company', 'Keep emergency cash hidden separately'],
  },
  IN: {
    essentials: ['Carry hand sanitizer and tissues everywhere', 'Download UPI payment apps (PhonePe, Google Pay)', 'Bargain at markets - start at 50% of asking price', 'Carry a photocopy of your ID at all times'],
    transport: ['Use Ola/Uber for taxis - safer than random autos', 'Book trains on IRCTC well in advance', 'Try local buses for authentic experience', 'Rent a Royal Enfield for road trips in the hills'],
    food: ['Street food is incredible but start with busy stalls', 'Drink only bottled or filtered water', 'South Indian breakfast (idli-dosa) is safe and delicious', 'Try local thali meals for best value'],
    culture: ['Remove shoes before entering temples', 'Dress modestly at religious sites', 'Use right hand for giving/receiving', 'Head wobble means yes/agreement'],
    avoid: ['Avoid tap water and ice from unknown sources', 'Skip overly touristy restaurants near monuments', 'Ignore touts at train stations and monuments', 'Avoid traveling during peak monsoon in flood-prone areas'],
  },
  JP: {
    essentials: ['Get a Suica/Pasmo IC card for transit', 'Cash is still widely used - carry yen', 'Convenience stores (konbini) are lifesavers', '7-Eleven ATMs accept international cards'],
    transport: ['Get a Japan Rail Pass for multi-city travel', 'Trains are extremely punctual - be early', 'Last trains run around midnight', 'Rent a pocket WiFi or get a data SIM'],
    food: ['Try conveyor belt sushi for budget meals', 'Standing ramen bars offer quick, cheap meals', 'Slurping noodles is polite - do it loud', 'Tipping is considered rude'],
    culture: ['Bow when greeting people', 'Remove shoes indoors', 'Keep quiet on public transport', 'Tattoos may restrict onsen (hot spring) access'],
    avoid: ['Never tip at restaurants', 'Do not eat while walking', 'Avoid talking on phone in trains', 'Never stick chopsticks upright in rice'],
  },
  TH: {
    essentials: ['Respect the monarchy - it is law', 'Carry a rain jacket during monsoon season', 'Negotiate tuk-tuk prices before riding', 'Get a local SIM at the airport - very cheap'],
    transport: ['Use BTS/MRT in Bangkok to avoid traffic', 'Grab app works like Uber', 'Long-tail boats are fun but bumpy', 'Night buses are budget-friendly for long distances'],
    food: ['Street food is often better than restaurants', 'Ask for "mai pet" (not spicy) if you cannot handle heat', 'Try pad thai from street vendors', 'Fresh fruit shakes are everywhere and cheap'],
    culture: ['Never touch anyone on the head', 'Remove shoes before entering homes/temples', 'Point feet away from Buddha images', 'Wai (prayer-hands bow) is the polite greeting'],
    avoid: ['Avoid jet ski scams on islands', 'Skip gem store tours offered by strangers', 'Avoid disrespecting Buddhist symbols', 'Never climb on Buddha statues for photos'],
  },
  FR: {
    essentials: ['Learn "Bonjour" and "Merci" - politeness matters', 'Museum Pass saves money for frequent visitors', 'Pharmacies have green cross signs and are very helpful', 'Tap water in restaurants is free (carafe d\'eau)'],
    transport: ['TGV high-speed trains connect major cities', 'Metro in Paris is efficient - get a Navigo card', 'Rent a Velib bike in Paris', 'Avoid driving in Paris - parking is a nightmare'],
    food: ['Lunch menu (menu du jour) is best value', 'Boulangeries for fresh bread and pastries', 'Wine is often cheaper than soft drinks', 'Fromage course comes before dessert'],
    culture: ['Greet with "Bonjour" before any interaction', 'Kiss on cheeks (la bise) varies by region', 'Dress smartly - French people notice', 'Sunday most shops are closed'],
    avoid: ['Do not speak loudly in restaurants', 'Skip tourist trap restaurants near major sights', 'Avoid the Eiffel Tower street sellers', 'Never order "cafe" expecting filter coffee - it is espresso'],
  },
  DE: {
    essentials: ['Cash is king - many places do not accept cards', 'Pfand (bottle deposit) - return bottles for refund', 'Sunday everything is closed except restaurants', 'Download DB Navigator for train schedules'],
    transport: ['Deutschland-Ticket for unlimited regional trains', 'Autobahn has no speed limit on many sections', 'Cycling infrastructure is excellent', 'ICE trains are fast but expensive - book early'],
    food: ['Bakeries (Backerei) for breakfast - cheaper than cafes', 'Beer gardens are a must - you can bring your own food', 'Currywurst is the iconic street food', 'Water costs money in restaurants - ask for Leitungswasser'],
    culture: ['Punctuality is extremely important', 'Recycling is taken very seriously', 'Quiet hours (Ruhezeit) - no noise after 10pm', 'Jaywalking can get you dirty looks or fines'],
    avoid: ['Do not bring up WWII casually', 'Avoid walking in bike lanes - cyclists will yell', 'Skip the overpriced tourist area Bratwurst', 'Never give Nazi salutes even as a joke - it is illegal'],
  },
  AU: {
    essentials: ['Wear sunscreen - UV is extreme', 'Check bushfire warnings in summer', 'Driving distances are huge - plan accordingly', 'Medicare does not cover tourists - get insurance'],
    transport: ['Domestic flights are often cheaper than trains', 'Opal card in Sydney, Myki in Melbourne', 'Road trips are the best way to explore', 'Watch for kangaroos on roads at dawn/dusk'],
    food: ['Brunch culture is huge - try smashed avo', 'BYO restaurants let you bring your own wine', 'Tim Tams are the must-try snack', 'Meat pies are the national fast food'],
    culture: ['Australians are laid-back - casual is fine', 'Tipping is not expected but appreciated', 'Mate = friend, used for everyone', 'Slip Slop Slap - sun protection campaign'],
    avoid: ['Never underestimate distances', 'Avoid swimming in unfamiliar waters without checking', 'Skip Bondi Beach on weekends if you dislike crowds', 'Never touch wild animals - many are dangerous'],
  },
  KR: {
    essentials: ['T-money card for all public transport', 'Free WiFi is everywhere', 'Download Naver Maps - better than Google Maps here', 'KakaoTalk is the messaging app everyone uses'],
    transport: ['KTX bullet trains connect major cities', 'Seoul metro is clean and efficient', 'Intercity buses are comfortable and cheap', 'Rent a car for countryside exploring'],
    food: ['Korean BBQ is a group activity - go with friends', 'Convenience store food is surprisingly good', 'Banchan (side dishes) are free refills', 'Soju with chicken (chimaek) is the national pastime'],
    culture: ['Use two hands when giving/receiving', 'Age hierarchy matters - let elders eat first', 'Bowing is the common greeting', 'Remove shoes indoors'],
    avoid: ['Avoid writing names in red ink', 'Do not pour your own drink - let others pour for you', 'Skip Myeongdong if you dislike crowds', 'Never blow your nose at the table'],
  },
  IT: {
    essentials: ['Validate train tickets before boarding', 'Museums often close on Mondays', 'Learn to order coffee properly - no cappuccino after 11am', 'Shops close 1-4pm for riposo'],
    transport: ['Trenitalia and Italo for intercity trains', 'Walking is the best way in historic centers', 'Vaporetto in Venice - get a pass', 'Avoid driving in ZTL zones - huge fines'],
    food: ['Aperitivo hour (6-8pm) often includes free snacks', 'Pizza is different in every region', 'Pasta course comes before meat course', 'Cover charge (coperto) on restaurant bills is normal'],
    culture: ['Italians dress well - smart casual minimum', 'Greet with a handshake or cheek kisses', 'Learn basic Italian - it is appreciated', 'Art and history are everywhere - respect them'],
    avoid: ['Never put parmesan on seafood pasta', 'Avoid sitting down at cafes near tourist sites - huge markup', 'Skip restaurants with photo menus near monuments', 'Never order fettuccine alfredo - it does not exist in Italy'],
  },
  ES: {
    essentials: ['Siesta is real - 2-5pm many shops close', 'Dinner starts at 9-10pm', 'Spanish people eat late - adapt your schedule', 'Tapas are best hopped - one or two per bar'],
    transport: ['AVE high-speed trains are excellent', 'Madrid and Barcelona have great metros', 'Rent a car for Andalusia road trips', 'Blablacar for budget intercity travel'],
    food: ['Tapas are often free with drinks in Granada', 'Menu del dia (lunch menu) is incredible value', 'Try churros con chocolate for breakfast', 'Wine is cheaper than water in many places'],
    culture: ['Two kisses on cheeks for greetings', 'Siesta culture means late nights are normal', 'Flamenco is best experienced in Seville', 'Festivals (fiestas) happen constantly - join in'],
    avoid: ['Do not call it Spanish omelette - it is tortilla', 'Avoid beaches in August - extremely crowded', 'Skip sangria at tourist traps - ask for tinto de verano', 'Never compare regions - Catalonia is not Castile'],
  },
  NP: {
    essentials: ['Altitude sickness is real - acclimatize properly', 'Carry cash - ATMs are scarce outside Kathmandu', 'Get trekking permits in advance', 'Hire a local guide for treks'],
    transport: ['Domestic flights are scenic but weather-dependent', 'Local buses are an adventure in themselves', 'Tourist buses are more comfortable', 'Walking is the main transport in mountains'],
    food: ['Dal bhat (lentils and rice) is the staple - filling and cheap', 'Momos are everywhere and delicious', 'Drink only bottled or purified water', 'Teahouse food on treks is basic but hearty'],
    culture: ['Namaste with folded hands is the greeting', 'Walk clockwise around Buddhist stupas', 'Ask permission before photographing people', 'Remove shoes before entering temples'],
    avoid: ['Never touch anything with your left hand', 'Avoid trekking alone in remote areas', 'Skip meat in remote teahouses - hygiene concerns', 'Never step over someone or their belongings'],
  },
};

const RECOMMENDATIONS: Record<string, any> = {
  IN: { see: ['Taj Mahal at sunrise', 'Kerala backwaters', 'Varanasi Ganga Aarti', 'Rajasthan forts', 'Ladakh landscapes'], do: ['Yoga in Rishikesh', 'Cooking class in Jaipur', 'Tea plantation visit in Darjeeling', 'Houseboat stay in Alleppey', 'Camel safari in Jaisalmer'], eat: ['Street food in Delhi', 'Hyderabadi biryani', 'South Indian thali', 'Bengali sweets in Kolkata', 'Goan seafood curry'], avoid: ['Tourist touts at monuments', 'Unmarked taxis at airports', 'Drinking tap water', 'Underestimating distances', 'Traveling without insurance'] },
  JP: { see: ['Fushimi Inari shrine at dawn', 'Cherry blossoms in spring', 'Mt. Fuji from Kawaguchiko', 'Shibuya Crossing at night', 'Bamboo Grove Arashiyama'], do: ['Stay in a ryokan', 'Soak in an onsen', 'Attend a tea ceremony', 'Watch sumo wrestling', 'Ride the bullet train'], eat: ['Tsukiji outer market sushi', 'Ramen in a tiny alley shop', 'Wagyu beef', 'Takoyaki in Osaka', 'Matcha everything in Kyoto'], avoid: ['Tipping', 'Eating while walking', 'Being loud on trains', 'Visiting only Tokyo', 'Skipping Kyoto'] },
  TH: { see: ['Grand Palace in Bangkok', 'Phi Phi Islands', 'Chiang Mai temples', 'Floating markets', 'White Temple Chiang Rai'], do: ['Thai cooking class', 'Full moon party (once)', 'Elephant sanctuary visit', 'Muay Thai class', 'Island hopping'], eat: ['Pad Thai from street vendors', 'Tom Yum Goong', 'Mango sticky rice', 'Som Tam (papaya salad)', 'Night market grilled seafood'], avoid: ['Jet ski rental scams', 'Tiger selfie temples', 'Gem shop tours', 'Walking on tuk-tuk driver recommendations', 'Disrespecting the monarchy'] },
  FR: { see: ['Eiffel Tower at sunset', 'Mont Saint-Michel', 'Versailles gardens', 'Provence lavender fields', 'Loire Valley chateaux'], do: ['Wine tasting in Bordeaux', 'Cooking class in Paris', 'Cycling in Provence', 'D-Day beaches in Normandy', 'Perfume making in Grasse'], eat: ['Croissants from local boulangerie', 'Croque Monsieur', 'Bouillabaisse in Marseille', 'Crepes in Brittany', 'Cheese at a fromagerie'], avoid: ['Only visiting Paris', 'Tourist trap restaurants near sights', 'Not saying Bonjour', 'Visiting in August (everything closes)', 'Expecting fast service at restaurants'] },
  DE: { see: ['Brandenburg Gate', 'Neuschwanstein Castle', 'Black Forest', 'Rhine Valley', 'Berlin Wall Memorial'], do: ['Oktoberfest in Munich', 'Christmas markets in December', 'Cycling along the Rhine', 'Beer garden evening', 'Concentration camp memorial visit'], eat: ['Currywurst in Berlin', 'Pretzels in Bavaria', 'Black Forest cake', 'Spatzle in Stuttgart', 'Doner kebab (seriously - invented here)'], avoid: ['Jaywalking', 'Being late', 'Nazi references', 'Expecting shops open on Sunday', 'Walking in bike lanes'] },
  AU: { see: ['Great Barrier Reef', 'Sydney Opera House', 'Uluru at sunset', 'Great Ocean Road', 'Blue Mountains'], do: ['Surf at Bondi Beach', 'Dive the reef', 'Outback road trip', 'Wildlife sanctuary visit', 'Aboriginal cultural tour'], eat: ['Meat pie', 'Fish and chips at the beach', 'Tim Tam slam', 'Barramundi', 'Flat white coffee'], avoid: ['Underestimating distances', 'Ignoring sun protection', 'Swimming where not marked safe', 'Touching wildlife', 'Forgetting to check visa'] },
  KR: { see: ['Gyeongbokgung Palace', 'Jeju Island', 'Bukchon Hanok Village', 'DMZ tour', 'Gamcheon Culture Village'], do: ['Korean BBQ with soju', 'K-pop experience in Gangnam', 'Temple stay overnight', 'Jjimjilbang (spa) visit', 'Hanbok rental and photoshoot'], eat: ['Bibimbap in Jeonju', 'Fried chicken and beer', 'Tteokbokki from street vendors', 'Samgyeopsal (pork belly)', 'Gwangjang Market bindaetteok'], avoid: ['Writing names in red ink', 'Pouring your own drink', 'Skipping Busan', 'Only eating at chains', 'Visiting without T-money card'] },
  IT: { see: ['Colosseum in Rome', 'Cinque Terre', 'Amalfi Coast', 'Florence Duomo', 'Venice canals'], do: ['Pasta making class in Tuscany', 'Gondola ride in Venice', 'Vespa ride in Rome', 'Wine tasting in Chianti', 'Pompeii and Herculaneum tour'], eat: ['Pizza in Naples', 'Gelato from artisan shops', 'Aperol Spritz at sunset', 'Truffle pasta in Umbria', 'Cannoli in Sicily'], avoid: ['Sitting at cafes without checking prices', 'Restaurants with tourist menus', 'Cappuccino after 11am', 'Putting parmesan on fish pasta', 'Skipping the south'] },
  ES: { see: ['Sagrada Familia', 'Alhambra in Granada', 'Plaza de Espana Seville', 'Park Guell', 'Santiago de Compostela'], do: ['Flamenco show in Seville', 'Tapas crawl in San Sebastian', 'Running with bulls (watch only)', 'Beach day in Barcelona', 'Camino de Santiago hike'], eat: ['Tapas in Granada (free with drinks)', 'Paella in Valencia', 'Pintxos in Basque Country', 'Churros con chocolate', 'Iberian ham'], avoid: ['Eating paella outside Valencia', 'Beach in August', 'Las Ramblas tourist traps', 'Only visiting Barcelona', 'Expecting early dinner'] },
  NP: { see: ['Everest Base Camp', 'Boudhanath Stupa', 'Annapurna range', 'Phewa Lake Pokhara', 'Patan Durbar Square'], do: ['Trekking in the Himalayas', 'Paragliding in Pokhara', 'Jungle safari in Chitwan', 'Mountain flight', 'Monastery stay'], eat: ['Dal bhat', 'Momos', 'Thukpa (noodle soup)', 'Chatamari (Newari crepe)', 'Yak cheese'], avoid: ['Altitude sickness - acclimatize', 'Trekking without permits', 'Drinking tap water', 'Trekking alone in remote areas', 'Underestimating weather changes'] },
  EG: { see: ['Pyramids of Giza', 'Valley of the Kings', 'Abu Simbel', 'Karnak Temple', 'Egyptian Museum'], do: ['Nile cruise', 'Hot air balloon over Luxor', 'Desert safari', 'Snorkeling in Red Sea', 'Felucca ride at sunset'], eat: ['Koshari', 'Ful medames', 'Fresh juice from street vendors', 'Shawarma', 'Um Ali dessert'], avoid: ['Touching ancient artifacts', 'Drinking tap water', 'Aggressive touts - politely decline', 'Visiting in July-August', 'Taking photos without asking'] },
  MX: { see: ['Chichen Itza', 'Tulum ruins', 'Mexico City Zocalo', 'Cenotes', 'Oaxaca city'], do: ['Scuba in Cozumel', 'Lucha libre wrestling', 'Mezcal tasting in Oaxaca', 'Day of the Dead celebrations', 'Cooking class'], eat: ['Tacos al pastor', 'Mole in Oaxaca', 'Ceviche on the coast', 'Churros', 'Tamales'], avoid: ['Drinking tap water', 'Walking alone at night in unfamiliar areas', 'Overpriced tourist zone restaurants', 'Cancun only - explore beyond', 'Forgetting sunscreen at altitude'] },
  TR: { see: ['Hagia Sophia', 'Cappadocia fairy chimneys', 'Pamukkale travertines', 'Blue Mosque', 'Ephesus ruins'], do: ['Hot air balloon in Cappadocia', 'Turkish bath (hammam)', 'Bosphorus cruise', 'Whirling dervish show', 'Carpet shopping at Grand Bazaar'], eat: ['Kebabs in Gaziantep', 'Baklava', 'Turkish breakfast spread', 'Fresh fish at Galata Bridge', 'Kunefe dessert'], avoid: ['Overpriced carpet shops', 'Shoe shiners who drop their brush', 'Taxi meters not being turned on', 'Visiting only Istanbul', 'Haggling aggressively at small shops'] },
};
