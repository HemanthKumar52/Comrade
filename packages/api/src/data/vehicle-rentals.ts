export interface VehicleRentalProvider {
  name: string;
  country: string;
  types: VehicleType[];
  priceRange: { min: number; max: number; currency: string; perDay: boolean };
  rating: number;
  international: boolean;
  website?: string;
  notes?: string;
}

export type VehicleType = 'car' | 'motorcycle' | 'scooter' | 'bicycle' | 'suv' | 'van' | 'luxury' | 'campervan' | 'tuk-tuk';

export const VEHICLE_RENTAL_PROVIDERS: VehicleRentalProvider[] = [
  // Global providers
  { name: 'Hertz', country: 'GLOBAL', types: ['car', 'suv', 'van', 'luxury'], priceRange: { min: 40, max: 200, currency: 'USD', perDay: true }, rating: 4.0, international: true, website: 'https://www.hertz.com' },
  { name: 'Avis', country: 'GLOBAL', types: ['car', 'suv', 'van', 'luxury'], priceRange: { min: 35, max: 180, currency: 'USD', perDay: true }, rating: 4.0, international: true, website: 'https://www.avis.com' },
  { name: 'Enterprise', country: 'GLOBAL', types: ['car', 'suv', 'van'], priceRange: { min: 30, max: 150, currency: 'USD', perDay: true }, rating: 4.2, international: true, website: 'https://www.enterprise.com' },
  { name: 'Sixt', country: 'GLOBAL', types: ['car', 'suv', 'luxury'], priceRange: { min: 35, max: 250, currency: 'USD', perDay: true }, rating: 4.1, international: true, website: 'https://www.sixt.com' },

  // India
  { name: 'Zoomcar', country: 'IN', types: ['car', 'suv'], priceRange: { min: 800, max: 5000, currency: 'INR', perDay: true }, rating: 3.8, international: false, website: 'https://www.zoomcar.com', notes: 'Self-drive only. Available in 45+ cities.' },
  { name: 'Drivezy', country: 'IN', types: ['car', 'motorcycle', 'scooter'], priceRange: { min: 300, max: 4000, currency: 'INR', perDay: true }, rating: 3.5, international: false, notes: 'Bikes starting from INR 300/day.' },
  { name: 'Royal Brothers', country: 'IN', types: ['motorcycle', 'scooter'], priceRange: { min: 400, max: 2000, currency: 'INR', perDay: true }, rating: 4.0, international: false, notes: 'Royal Enfield bikes available.' },
  { name: 'Savaari', country: 'IN', types: ['car', 'suv'], priceRange: { min: 1500, max: 8000, currency: 'INR', perDay: true }, rating: 4.2, international: false, notes: 'Chauffeur-driven only.' },

  // Thailand
  { name: 'Thai Rent A Car', country: 'TH', types: ['car', 'suv', 'van'], priceRange: { min: 800, max: 5000, currency: 'THB', perDay: true }, rating: 4.0, international: false },
  { name: 'Scooter rental (local)', country: 'TH', types: ['scooter', 'motorcycle'], priceRange: { min: 200, max: 800, currency: 'THB', perDay: true }, rating: 3.5, international: false, notes: 'Available everywhere in tourist areas. Check insurance.' },
  { name: 'Tuk-tuk (local)', country: 'TH', types: ['tuk-tuk'], priceRange: { min: 100, max: 500, currency: 'THB', perDay: false }, rating: 3.0, international: false, notes: 'Per ride pricing. Always negotiate before riding.' },

  // Japan
  { name: 'Toyota Rent a Car', country: 'JP', types: ['car', 'suv', 'van'], priceRange: { min: 5000, max: 20000, currency: 'JPY', perDay: true }, rating: 4.5, international: false, website: 'https://rent.toyota.co.jp/en/' },
  { name: 'Nippon Rent-A-Car', country: 'JP', types: ['car', 'suv'], priceRange: { min: 5500, max: 18000, currency: 'JPY', perDay: true }, rating: 4.3, international: false },
  { name: 'Times Car Rental', country: 'JP', types: ['car', 'suv', 'van'], priceRange: { min: 4000, max: 15000, currency: 'JPY', perDay: true }, rating: 4.2, international: false },

  // Australia
  { name: 'Jucy', country: 'AU', types: ['car', 'campervan'], priceRange: { min: 40, max: 150, currency: 'AUD', perDay: true }, rating: 4.0, international: false, notes: 'Budget campervans popular for road trips.' },
  { name: 'Britz', country: 'AU', types: ['campervan', 'van'], priceRange: { min: 80, max: 300, currency: 'AUD', perDay: true }, rating: 4.2, international: false, notes: 'Motorhomes and campervans.' },
  { name: 'Wicked Campers', country: 'AU', types: ['campervan', 'van'], priceRange: { min: 35, max: 100, currency: 'AUD', perDay: true }, rating: 3.5, international: false },

  // USA
  { name: 'Turo', country: 'US', types: ['car', 'suv', 'luxury'], priceRange: { min: 30, max: 500, currency: 'USD', perDay: true }, rating: 4.3, international: false, website: 'https://turo.com', notes: 'Peer-to-peer car sharing.' },
  { name: 'Cruise America', country: 'US', types: ['campervan'], priceRange: { min: 100, max: 300, currency: 'USD', perDay: true }, rating: 3.8, international: false, notes: 'RV rentals for road trips.' },

  // Vietnam
  { name: 'Tigit Motorbikes', country: 'VN', types: ['motorcycle', 'scooter'], priceRange: { min: 200000, max: 800000, currency: 'VND', perDay: true }, rating: 4.5, international: false, notes: 'Best for motorbike tours. One-way rentals available.' },
  { name: 'Local scooter rental', country: 'VN', types: ['scooter'], priceRange: { min: 100000, max: 200000, currency: 'VND', perDay: true }, rating: 3.0, international: false, notes: 'Available at most hotels. Verify insurance.' },

  // Indonesia (Bali)
  { name: 'Bali Bike Rental', country: 'ID', types: ['scooter', 'motorcycle'], priceRange: { min: 50000, max: 150000, currency: 'IDR', perDay: true }, rating: 3.8, international: false, notes: 'Scooters are the primary transport in Bali.' },
  { name: 'GoRentCar Bali', country: 'ID', types: ['car', 'suv'], priceRange: { min: 200000, max: 800000, currency: 'IDR', perDay: true }, rating: 3.5, international: false },

  // New Zealand
  { name: 'Jucy NZ', country: 'NZ', types: ['car', 'campervan'], priceRange: { min: 40, max: 200, currency: 'NZD', perDay: true }, rating: 4.0, international: false },
  { name: 'Escape Campervans', country: 'NZ', types: ['campervan'], priceRange: { min: 60, max: 180, currency: 'NZD', perDay: true }, rating: 4.1, international: false, notes: 'Uniquely painted campervans.' },

  // South Korea
  { name: 'Lotte Rent-A-Car', country: 'KR', types: ['car', 'suv'], priceRange: { min: 50000, max: 200000, currency: 'KRW', perDay: true }, rating: 4.2, international: false },
  { name: 'SK Rent-A-Car', country: 'KR', types: ['car', 'suv', 'van'], priceRange: { min: 40000, max: 180000, currency: 'KRW', perDay: true }, rating: 4.0, international: false },

  // UAE
  { name: 'Dollar Rent A Car', country: 'AE', types: ['car', 'suv', 'luxury'], priceRange: { min: 80, max: 500, currency: 'AED', perDay: true }, rating: 4.0, international: true },
  { name: 'Ezhire', country: 'AE', types: ['car', 'suv', 'luxury'], priceRange: { min: 100, max: 2000, currency: 'AED', perDay: true }, rating: 4.1, international: false, notes: 'Luxury and supercar rentals available.' },

  // Nepal
  { name: 'Local motorcycle rental', country: 'NP', types: ['motorcycle', 'scooter'], priceRange: { min: 800, max: 3000, currency: 'NPR', perDay: true }, rating: 3.0, international: false, notes: 'Available in Kathmandu and Pokhara. Check condition carefully.' },
  { name: 'Safari jeep rental', country: 'NP', types: ['suv'], priceRange: { min: 5000, max: 15000, currency: 'NPR', perDay: true }, rating: 3.5, international: false, notes: 'For Chitwan/Bardia national parks.' },
];

export const WATER_SAFETY: Record<string, { tapSafe: boolean; notes: string }> = {
  IN: { tapSafe: false, notes: 'Always drink bottled or purified water. Avoid ice from unknown sources.' },
  US: { tapSafe: true, notes: 'Tap water is safe in most areas.' },
  GB: { tapSafe: true, notes: 'Tap water is safe throughout the UK.' },
  JP: { tapSafe: true, notes: 'Tap water is safe and high quality.' },
  FR: { tapSafe: true, notes: 'Tap water is safe. Restaurants may serve carafes of tap water.' },
  DE: { tapSafe: true, notes: 'Tap water is safe and well-regulated.' },
  AU: { tapSafe: true, notes: 'Tap water is safe in cities. Be cautious in remote areas.' },
  CN: { tapSafe: false, notes: 'Do not drink tap water. Boiled water is usually available.' },
  SG: { tapSafe: true, notes: 'Singapore tap water meets WHO standards.' },
  TH: { tapSafe: false, notes: 'Drink bottled water. Ice in restaurants is usually made from purified water.' },
  KR: { tapSafe: true, notes: 'Tap water is safe but many locals prefer bottled.' },
  VN: { tapSafe: false, notes: 'Drink bottled water only.' },
  ID: { tapSafe: false, notes: 'Drink bottled water only. Avoid ice from street vendors.' },
  NP: { tapSafe: false, notes: 'Never drink tap water. Use purification tablets or bottled water.' },
  EG: { tapSafe: false, notes: 'Drink bottled water only.' },
  MX: { tapSafe: false, notes: 'Drink bottled water. Be cautious with ice.' },
  BR: { tapSafe: false, notes: 'Tap water quality varies. Bottled water recommended.' },
  TR: { tapSafe: false, notes: 'Drink bottled water in most areas.' },
  NZ: { tapSafe: true, notes: 'Tap water is safe and excellent quality.' },
  CA: { tapSafe: true, notes: 'Tap water is safe throughout Canada.' },
};
