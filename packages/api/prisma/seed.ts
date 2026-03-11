// ─────────────────────────────────────────────────────────────
// Partner Travel App – Database Seed Script
// Run: pnpm prisma:seed  or  npx prisma db seed
// ─────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ═══════════════════════════════════════════════════════════════
//  1. USERS
// ═══════════════════════════════════════════════════════════════

async function seedUsers() {
  console.log('🌱 Seeding users...');
  const pw = await hashPassword('password123');

  const usersData = [
    {
      email: 'demo@partner.app',
      password: pw,
      name: 'Demo User',
      phone: '+91-9876543210',
      bio: 'Passionate traveler exploring every corner of India. Love road trips and mountain trails.',
      level: 'VOYAGER' as const,
      xp: 2500,
      totalKm: 1500,
      placesVisited: 25,
      tripsCompleted: 12,
      travelStreak: 5,
      verificationTier: 'COMMUNITY' as const,
    },
    {
      email: 'arjun@partner.app',
      password: pw,
      name: 'Arjun Kumar',
      phone: '+91-9876543211',
      bio: 'Solo traveler and digital nomad. Working remotely from the mountains.',
      level: 'NAVIGATOR' as const,
      xp: 4200,
      totalKm: 5000,
      placesVisited: 50,
      tripsCompleted: 30,
      travelStreak: 12,
      verificationTier: 'COMMUNITY' as const,
    },
    {
      email: 'priya@partner.app',
      password: pw,
      name: 'Priya Sharma',
      phone: '+91-9876543212',
      bio: 'Duo explorer who loves traveling with her partner. Weekend getaway enthusiast.',
      level: 'EXPLORER' as const,
      xp: 1200,
      totalKm: 800,
      placesVisited: 15,
      tripsCompleted: 8,
      travelStreak: 3,
      verificationTier: 'PHONE' as const,
    },
    {
      email: 'rohan@partner.app',
      password: pw,
      name: 'Rohan Mehta',
      phone: '+91-9876543213',
      bio: "Priya's travel partner. Loves capturing duo travel moments on camera.",
      level: 'EXPLORER' as const,
      xp: 1100,
      totalKm: 780,
      placesVisited: 14,
      tripsCompleted: 7,
      travelStreak: 3,
      verificationTier: 'PHONE' as const,
    },
    {
      email: 'anil@partner.app',
      password: pw,
      name: 'Anil Patel',
      phone: '+91-9876543214',
      bio: 'Squad adventurer. The more, the merrier! Always up for a group road trip.',
      level: 'VOYAGER' as const,
      xp: 2000,
      totalKm: 2200,
      placesVisited: 30,
      tripsCompleted: 15,
      travelStreak: 7,
      verificationTier: 'ID' as const,
    },
    {
      email: 'meena@partner.app',
      password: pw,
      name: 'Meena Iyer',
      phone: '+91-9876543215',
      bio: 'Group organizer extraordinaire. Plans trips for friends and family.',
      level: 'VOYAGER' as const,
      xp: 2800,
      totalKm: 3000,
      placesVisited: 35,
      tripsCompleted: 18,
      travelStreak: 4,
      verificationTier: 'COMMUNITY' as const,
    },
    {
      email: 'karthik@partner.app',
      password: pw,
      name: 'Karthik Nair',
      phone: '+91-9876543216',
      bio: 'Born to ride. Biker soul with 50,000+ km on two wheels across India.',
      level: 'NAVIGATOR' as const,
      xp: 3800,
      totalKm: 4500,
      placesVisited: 45,
      tripsCompleted: 25,
      travelStreak: 10,
      verificationTier: 'COMMUNITY' as const,
    },
    {
      email: 'deepa@partner.app',
      password: pw,
      name: 'Deepa Rajan',
      phone: '+91-9876543217',
      bio: 'Culture enthusiast. Exploring temples, art galleries, and heritage sites.',
      level: 'EXPLORER' as const,
      xp: 900,
      totalKm: 600,
      placesVisited: 12,
      tripsCompleted: 5,
      travelStreak: 2,
      verificationTier: 'PHONE' as const,
    },
    {
      email: 'vikram@partner.app',
      password: pw,
      name: 'Vikram Singh',
      phone: '+91-9876543218',
      bio: 'Mountain trekker. Summited peaks across the Himalayas and Western Ghats.',
      level: 'LEGEND' as const,
      xp: 6000,
      totalKm: 3500,
      placesVisited: 40,
      tripsCompleted: 22,
      travelStreak: 15,
      verificationTier: 'COMMUNITY' as const,
    },
    {
      email: 'sara@partner.app',
      password: pw,
      name: 'Sara Ahmed',
      phone: '+91-9876543219',
      bio: 'Food explorer. Traveling the country one dish at a time.',
      level: 'WANDERER' as const,
      xp: 400,
      totalKm: 200,
      placesVisited: 5,
      tripsCompleted: 2,
      travelStreak: 1,
      verificationTier: 'PHONE' as const,
    },
  ];

  const users: Record<string, any> = {};
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        level: u.level,
        xp: u.xp,
        totalKm: u.totalKm,
        placesVisited: u.placesVisited,
        tripsCompleted: u.tripsCompleted,
        travelStreak: u.travelStreak,
      },
      create: u,
    });
    users[u.email] = user;
    console.log(`  ✓ ${user.name} (${user.email})`);
  }

  return users;
}

// ═══════════════════════════════════════════════════════════════
//  2. BADGES
// ═══════════════════════════════════════════════════════════════

async function seedBadges() {
  console.log('🌱 Seeding badges...');

  const badgesData = [
    // Distance family
    { name: '100km Rookie', description: 'Traveled your first 100 kilometers', family: 'DISTANCE' as const, xpValue: 10, tier: 1, unlockCriteria: { type: 'distance_km', threshold: 100 } },
    { name: '500km Explorer', description: 'Covered 500 kilometers of adventure', family: 'DISTANCE' as const, xpValue: 25, tier: 2, unlockCriteria: { type: 'distance_km', threshold: 500 } },
    { name: '1000km Pathfinder', description: 'A thousand kilometers of discovery', family: 'DISTANCE' as const, xpValue: 50, tier: 3, unlockCriteria: { type: 'distance_km', threshold: 1000 } },
    { name: '5000km Legend', description: 'Five thousand kilometers — a true legend', family: 'DISTANCE' as const, xpValue: 200, tier: 4, unlockCriteria: { type: 'distance_km', threshold: 5000 } },
    { name: '10000km Odyssey', description: 'Ten thousand kilometers of epic journey', family: 'DISTANCE' as const, xpValue: 500, tier: 5, unlockCriteria: { type: 'distance_km', threshold: 10000 } },

    // Place family
    { name: '5 Cities Starter', description: 'Visited your first 5 cities', family: 'PLACE' as const, xpValue: 15, tier: 1, unlockCriteria: { type: 'places_visited', threshold: 5 } },
    { name: '10 Cities Hopper', description: 'City-hopped across 10 destinations', family: 'PLACE' as const, xpValue: 30, tier: 2, unlockCriteria: { type: 'places_visited', threshold: 10 } },
    { name: 'Beach Hopper', description: 'Visited 5 beach destinations', family: 'PLACE' as const, xpValue: 20, tier: 2, unlockCriteria: { type: 'beach_visits', threshold: 5 } },
    { name: 'Hill Station Hero', description: 'Conquered 5 hill stations', family: 'PLACE' as const, xpValue: 25, tier: 2, unlockCriteria: { type: 'hill_station_visits', threshold: 5 } },
    { name: '50 Places Master', description: 'Visited 50 unique places — master explorer', family: 'PLACE' as const, xpValue: 150, tier: 5, unlockCriteria: { type: 'places_visited', threshold: 50 } },

    // Vehicle family
    { name: 'Biker Soul', description: 'Completed a trip on two wheels', family: 'VEHICLE' as const, xpValue: 20, tier: 1, unlockCriteria: { type: 'vehicle_trip', vehicle: 'BIKE', threshold: 1 } },
    { name: 'Train Traveler', description: 'Took the scenic rail route', family: 'VEHICLE' as const, xpValue: 20, tier: 1, unlockCriteria: { type: 'vehicle_trip', vehicle: 'TRAIN', threshold: 1 } },
    { name: 'Sky Nomad', description: 'Traveled by flight to a destination', family: 'VEHICLE' as const, xpValue: 30, tier: 2, unlockCriteria: { type: 'vehicle_trip', vehicle: 'FLIGHT', threshold: 1 } },
    { name: 'Road Tripper', description: 'Completed a car road trip over 500km', family: 'VEHICLE' as const, xpValue: 25, tier: 2, unlockCriteria: { type: 'vehicle_distance', vehicle: 'CAR', threshold: 500 } },
    { name: 'Multi-Modal Master', description: 'Used 4 different vehicle types', family: 'VEHICLE' as const, xpValue: 50, tier: 3, unlockCriteria: { type: 'vehicle_types_used', threshold: 4 } },

    // Social family
    { name: 'First Partner', description: 'Completed your first duo trip', family: 'SOCIAL' as const, xpValue: 10, tier: 1, unlockCriteria: { type: 'duo_trips', threshold: 1 } },
    { name: 'Squad Leader', description: 'Led a squad trip successfully', family: 'SOCIAL' as const, xpValue: 25, tier: 2, unlockCriteria: { type: 'squad_trips_led', threshold: 1 } },
    { name: 'Group Pioneer', description: 'Organized a group trip with 5+ people', family: 'SOCIAL' as const, xpValue: 30, tier: 2, unlockCriteria: { type: 'group_trips', threshold: 1 } },
    { name: '10 Connections', description: 'Traveled with 10 different partners', family: 'SOCIAL' as const, xpValue: 40, tier: 3, unlockCriteria: { type: 'unique_partners', threshold: 10 } },
    { name: 'Community Star', description: 'A beloved member of the travel community', family: 'SOCIAL' as const, xpValue: 100, tier: 5, unlockCriteria: { type: 'community_score', threshold: 100 } },

    // Nature family
    { name: 'Midnight Rider', description: 'Traveled during midnight hours', family: 'NATURE' as const, xpValue: 15, tier: 1, unlockCriteria: { type: 'night_travel', threshold: 1 } },
    { name: 'Monsoon Maverick', description: 'Braved the monsoon rains on a trip', family: 'NATURE' as const, xpValue: 20, tier: 2, unlockCriteria: { type: 'monsoon_trip', threshold: 1 } },
    { name: 'Sunrise Chaser', description: 'Started a trip before sunrise', family: 'NATURE' as const, xpValue: 15, tier: 1, unlockCriteria: { type: 'sunrise_start', threshold: 1 } },
    { name: 'Weekend Warrior', description: 'Completed 5 weekend trips', family: 'NATURE' as const, xpValue: 10, tier: 1, unlockCriteria: { type: 'weekend_trips', threshold: 5 } },
    { name: '30 Day Streak', description: 'Maintained a 30-day travel streak', family: 'NATURE' as const, xpValue: 50, tier: 3, unlockCriteria: { type: 'travel_streak', threshold: 30 } },
  ];

  const badges: Record<string, any> = {};
  for (const b of badgesData) {
    const badge = await prisma.badge.upsert({
      where: { name: b.name },
      update: { description: b.description, family: b.family, xpValue: b.xpValue, tier: b.tier, unlockCriteria: b.unlockCriteria },
      create: b,
    });
    badges[b.name] = badge;
  }
  console.log(`  ✓ ${Object.keys(badges).length} badges seeded`);
  return badges;
}

// ═══════════════════════════════════════════════════════════════
//  3. USER BADGES
// ═══════════════════════════════════════════════════════════════

async function seedUserBadges(users: Record<string, any>, badges: Record<string, any>) {
  console.log('🌱 Seeding user badges...');

  const assignments: Array<{ userEmail: string; badgeName: string }> = [
    // Demo User (1500km, 25 places, 12 trips)
    { userEmail: 'demo@partner.app', badgeName: '100km Rookie' },
    { userEmail: 'demo@partner.app', badgeName: '500km Explorer' },
    { userEmail: 'demo@partner.app', badgeName: '1000km Pathfinder' },
    { userEmail: 'demo@partner.app', badgeName: '5 Cities Starter' },
    { userEmail: 'demo@partner.app', badgeName: '10 Cities Hopper' },
    { userEmail: 'demo@partner.app', badgeName: 'Road Tripper' },
    { userEmail: 'demo@partner.app', badgeName: 'First Partner' },
    { userEmail: 'demo@partner.app', badgeName: 'Weekend Warrior' },
    { userEmail: 'demo@partner.app', badgeName: 'Sunrise Chaser' },

    // Arjun (5000km, 50 places, 30 trips - digital nomad)
    { userEmail: 'arjun@partner.app', badgeName: '100km Rookie' },
    { userEmail: 'arjun@partner.app', badgeName: '500km Explorer' },
    { userEmail: 'arjun@partner.app', badgeName: '1000km Pathfinder' },
    { userEmail: 'arjun@partner.app', badgeName: '5000km Legend' },
    { userEmail: 'arjun@partner.app', badgeName: '5 Cities Starter' },
    { userEmail: 'arjun@partner.app', badgeName: '10 Cities Hopper' },
    { userEmail: 'arjun@partner.app', badgeName: '50 Places Master' },
    { userEmail: 'arjun@partner.app', badgeName: 'Multi-Modal Master' },
    { userEmail: 'arjun@partner.app', badgeName: '30 Day Streak' },

    // Karthik (4500km, 45 places - biker)
    { userEmail: 'karthik@partner.app', badgeName: '100km Rookie' },
    { userEmail: 'karthik@partner.app', badgeName: '500km Explorer' },
    { userEmail: 'karthik@partner.app', badgeName: '1000km Pathfinder' },
    { userEmail: 'karthik@partner.app', badgeName: 'Biker Soul' },
    { userEmail: 'karthik@partner.app', badgeName: 'Midnight Rider' },
    { userEmail: 'karthik@partner.app', badgeName: 'Monsoon Maverick' },
    { userEmail: 'karthik@partner.app', badgeName: '5 Cities Starter' },
    { userEmail: 'karthik@partner.app', badgeName: '10 Cities Hopper' },

    // Vikram (3500km, 40 places - trekker)
    { userEmail: 'vikram@partner.app', badgeName: '100km Rookie' },
    { userEmail: 'vikram@partner.app', badgeName: '500km Explorer' },
    { userEmail: 'vikram@partner.app', badgeName: '1000km Pathfinder' },
    { userEmail: 'vikram@partner.app', badgeName: 'Hill Station Hero' },
    { userEmail: 'vikram@partner.app', badgeName: 'Sunrise Chaser' },
    { userEmail: 'vikram@partner.app', badgeName: '5 Cities Starter' },
    { userEmail: 'vikram@partner.app', badgeName: '10 Cities Hopper' },

    // Meena (3000km, 35 places - group organizer)
    { userEmail: 'meena@partner.app', badgeName: '100km Rookie' },
    { userEmail: 'meena@partner.app', badgeName: '500km Explorer' },
    { userEmail: 'meena@partner.app', badgeName: '1000km Pathfinder' },
    { userEmail: 'meena@partner.app', badgeName: 'Group Pioneer' },
    { userEmail: 'meena@partner.app', badgeName: 'Squad Leader' },
    { userEmail: 'meena@partner.app', badgeName: '10 Connections' },

    // Priya (800km - duo)
    { userEmail: 'priya@partner.app', badgeName: '100km Rookie' },
    { userEmail: 'priya@partner.app', badgeName: '500km Explorer' },
    { userEmail: 'priya@partner.app', badgeName: 'First Partner' },
    { userEmail: 'priya@partner.app', badgeName: '5 Cities Starter' },

    // Sara (200km - food explorer, beginner)
    { userEmail: 'sara@partner.app', badgeName: '100km Rookie' },
    { userEmail: 'sara@partner.app', badgeName: '5 Cities Starter' },
  ];

  let count = 0;
  for (const a of assignments) {
    const user = users[a.userEmail];
    const badge = badges[a.badgeName];
    if (!user || !badge) continue;

    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
      update: {},
      create: {
        userId: user.id,
        badgeId: badge.id,
        unlockedAt: daysAgo(Math.floor(Math.random() * 180)),
      },
    });
    count++;
  }
  console.log(`  ✓ ${count} user-badge assignments`);
}

// ═══════════════════════════════════════════════════════════════
//  4. TRIPS
// ═══════════════════════════════════════════════════════════════

async function seedTrips(users: Record<string, any>) {
  console.log('🌱 Seeding trips...');

  const demo = users['demo@partner.app'];
  const arjun = users['arjun@partner.app'];
  const priya = users['priya@partner.app'];
  const rohan = users['rohan@partner.app'];
  const anil = users['anil@partner.app'];
  const meena = users['meena@partner.app'];
  const karthik = users['karthik@partner.app'];
  const deepa = users['deepa@partner.app'];
  const vikram = users['vikram@partner.app'];
  const sara = users['sara@partner.app'];

  const tripsData = [
    {
      title: 'Mumbai to Goa',
      userId: demo.id,
      type: 'SOLO' as const,
      source: 'Mumbai',
      destination: 'Goa',
      sourceCoords: { lat: 19.076, lng: 72.8777 },
      destCoords: { lat: 15.2993, lng: 74.124 },
      status: 'COMPLETED' as const,
      vehicleType: 'CAR' as const,
      distanceKm: 590,
      durationMin: 600,
      startedAt: daysAgo(90),
      endedAt: daysAgo(88),
    },
    {
      title: 'Delhi to Jaipur',
      userId: priya.id,
      type: 'DUO' as const,
      source: 'Delhi',
      destination: 'Jaipur',
      sourceCoords: { lat: 28.7041, lng: 77.1025 },
      destCoords: { lat: 26.9124, lng: 75.7873 },
      status: 'COMPLETED' as const,
      vehicleType: 'CAR' as const,
      distanceKm: 280,
      durationMin: 300,
      startedAt: daysAgo(60),
      endedAt: daysAgo(58),
    },
    {
      title: 'Bangalore to Mysore',
      userId: anil.id,
      type: 'SQUAD' as const,
      source: 'Bangalore',
      destination: 'Mysore',
      sourceCoords: { lat: 12.9716, lng: 77.5946 },
      destCoords: { lat: 12.2958, lng: 76.6394 },
      status: 'COMPLETED' as const,
      vehicleType: 'CAR' as const,
      distanceKm: 150,
      durationMin: 180,
      startedAt: daysAgo(45),
      endedAt: daysAgo(43),
    },
    {
      title: 'Chennai to Pondicherry',
      userId: demo.id,
      type: 'SOLO' as const,
      source: 'Chennai',
      destination: 'Pondicherry',
      sourceCoords: { lat: 13.0827, lng: 80.2707 },
      destCoords: { lat: 11.9416, lng: 79.8083 },
      status: 'PLANNING' as const,
      vehicleType: 'BIKE' as const,
      distanceKm: 170,
      durationMin: 210,
    },
    {
      title: 'Kochi to Munnar',
      userId: priya.id,
      type: 'DUO' as const,
      source: 'Kochi',
      destination: 'Munnar',
      sourceCoords: { lat: 9.9312, lng: 76.2673 },
      destCoords: { lat: 10.0889, lng: 77.0595 },
      status: 'COMPLETED' as const,
      vehicleType: 'CAR' as const,
      distanceKm: 130,
      durationMin: 240,
      startedAt: daysAgo(30),
      endedAt: daysAgo(28),
    },
    {
      title: 'Leh-Ladakh Road Trip',
      userId: karthik.id,
      type: 'SQUAD' as const,
      source: 'Manali',
      destination: 'Leh',
      sourceCoords: { lat: 32.2432, lng: 77.1892 },
      destCoords: { lat: 34.1526, lng: 77.5771 },
      status: 'COMPLETED' as const,
      vehicleType: 'BIKE' as const,
      distanceKm: 1200,
      durationMin: 4320,
      startedAt: daysAgo(120),
      endedAt: daysAgo(114),
    },
    {
      title: 'Darjeeling Trek',
      userId: vikram.id,
      type: 'SOLO' as const,
      source: 'Darjeeling',
      destination: 'Sandakphu',
      sourceCoords: { lat: 27.0361, lng: 88.2627 },
      destCoords: { lat: 27.1025, lng: 88.0003 },
      status: 'ACTIVE' as const,
      vehicleType: 'TREK' as const,
      distanceKm: 45,
      durationMin: 2880,
      startedAt: daysAgo(2),
    },
    {
      title: 'Hyderabad to Hampi',
      userId: meena.id,
      type: 'GROUP' as const,
      source: 'Hyderabad',
      destination: 'Hampi',
      sourceCoords: { lat: 17.385, lng: 78.4867 },
      destCoords: { lat: 15.335, lng: 76.46 },
      status: 'COMPLETED' as const,
      vehicleType: 'BUS' as const,
      distanceKm: 370,
      durationMin: 420,
      startedAt: daysAgo(75),
      endedAt: daysAgo(72),
    },
    {
      title: 'Manali to Rohtang',
      userId: rohan.id,
      type: 'DUO' as const,
      source: 'Manali',
      destination: 'Rohtang Pass',
      sourceCoords: { lat: 32.2432, lng: 77.1892 },
      destCoords: { lat: 32.3722, lng: 77.2478 },
      status: 'COMPLETED' as const,
      vehicleType: 'CAR' as const,
      distanceKm: 52,
      durationMin: 120,
      startedAt: daysAgo(50),
      endedAt: daysAgo(49),
    },
    {
      title: 'Kerala Backwaters',
      userId: anil.id,
      type: 'SQUAD' as const,
      source: 'Alleppey',
      destination: 'Kumarakom',
      sourceCoords: { lat: 9.4981, lng: 76.3388 },
      destCoords: { lat: 9.5922, lng: 76.4308 },
      status: 'COMPLETED' as const,
      vehicleType: 'CAR' as const,
      distanceKm: 80,
      durationMin: 360,
      startedAt: daysAgo(100),
      endedAt: daysAgo(98),
    },
    {
      title: 'Rajasthan Circuit',
      userId: meena.id,
      type: 'GROUP' as const,
      source: 'Jaipur',
      destination: 'Udaipur',
      sourceCoords: { lat: 26.9124, lng: 75.7873 },
      destCoords: { lat: 24.5854, lng: 73.7125 },
      status: 'PLANNING' as const,
      vehicleType: 'BUS' as const,
      distanceKm: 1500,
      durationMin: 7200,
    },
    {
      title: 'Goa Beach Hopping',
      userId: arjun.id,
      type: 'SOLO' as const,
      source: 'North Goa',
      destination: 'South Goa',
      sourceCoords: { lat: 15.5479, lng: 73.7562 },
      destCoords: { lat: 15.1909, lng: 73.9783 },
      status: 'COMPLETED' as const,
      vehicleType: 'BIKE' as const,
      distanceKm: 60,
      durationMin: 480,
      startedAt: daysAgo(20),
      endedAt: daysAgo(18),
    },
    {
      title: 'Varanasi to Bodh Gaya',
      userId: deepa.id,
      type: 'SOLO' as const,
      source: 'Varanasi',
      destination: 'Bodh Gaya',
      sourceCoords: { lat: 25.3176, lng: 82.9739 },
      destCoords: { lat: 24.6961, lng: 84.9911 },
      status: 'COMPLETED' as const,
      vehicleType: 'TRAIN' as const,
      distanceKm: 250,
      durationMin: 300,
      startedAt: daysAgo(40),
      endedAt: daysAgo(38),
    },
    {
      title: 'Ooty to Coonoor',
      userId: sara.id,
      type: 'DUO' as const,
      source: 'Ooty',
      destination: 'Coonoor',
      sourceCoords: { lat: 11.4102, lng: 76.695 },
      destCoords: { lat: 11.3531, lng: 76.7959 },
      status: 'COMPLETED' as const,
      vehicleType: 'CAR' as const,
      distanceKm: 20,
      durationMin: 45,
      startedAt: daysAgo(15),
      endedAt: daysAgo(14),
    },
    {
      title: 'Rishikesh Adventure',
      userId: anil.id,
      type: 'SQUAD' as const,
      source: 'Rishikesh',
      destination: 'Neelkanth',
      sourceCoords: { lat: 30.0869, lng: 78.2676 },
      destCoords: { lat: 30.1427, lng: 78.3816 },
      status: 'ACTIVE' as const,
      vehicleType: 'TREK' as const,
      distanceKm: 35,
      durationMin: 1440,
      startedAt: daysAgo(1),
    },
  ];

  const trips: any[] = [];
  for (const t of tripsData) {
    // Use a combination of title + userId for idempotent-ish creation
    const existing = await prisma.trip.findFirst({
      where: { title: t.title, userId: t.userId },
    });
    if (existing) {
      trips.push(existing);
      continue;
    }
    const trip = await prisma.trip.create({ data: t });
    trips.push(trip);
    console.log(`  ✓ ${trip.title}`);
  }

  return trips;
}

// ═══════════════════════════════════════════════════════════════
//  5. TRIP MEMBERS
// ═══════════════════════════════════════════════════════════════

async function seedTripMembers(users: Record<string, any>, trips: any[]) {
  console.log('🌱 Seeding trip members...');

  const priya = users['priya@partner.app'];
  const rohan = users['rohan@partner.app'];
  const anil = users['anil@partner.app'];
  const meena = users['meena@partner.app'];
  const karthik = users['karthik@partner.app'];
  const deepa = users['deepa@partner.app'];
  const vikram = users['vikram@partner.app'];
  const demo = users['demo@partner.app'];
  const arjun = users['arjun@partner.app'];
  const sara = users['sara@partner.app'];

  // trip index -> title mapping from seedTrips order
  const tripByTitle = (title: string) => trips.find((t: any) => t.title === title);

  const memberships: Array<{ tripTitle: string; userId: string; role: 'LEAD' | 'MEMBER' }> = [
    // Delhi to Jaipur (duo - Priya + Rohan)
    { tripTitle: 'Delhi to Jaipur', userId: priya.id, role: 'LEAD' },
    { tripTitle: 'Delhi to Jaipur', userId: rohan.id, role: 'MEMBER' },

    // Bangalore to Mysore (squad - Anil lead + demo + karthik)
    { tripTitle: 'Bangalore to Mysore', userId: anil.id, role: 'LEAD' },
    { tripTitle: 'Bangalore to Mysore', userId: demo.id, role: 'MEMBER' },
    { tripTitle: 'Bangalore to Mysore', userId: karthik.id, role: 'MEMBER' },

    // Kochi to Munnar (duo - Priya + Rohan)
    { tripTitle: 'Kochi to Munnar', userId: priya.id, role: 'LEAD' },
    { tripTitle: 'Kochi to Munnar', userId: rohan.id, role: 'MEMBER' },

    // Leh-Ladakh (squad - Karthik lead + Vikram + Anil)
    { tripTitle: 'Leh-Ladakh Road Trip', userId: karthik.id, role: 'LEAD' },
    { tripTitle: 'Leh-Ladakh Road Trip', userId: vikram.id, role: 'MEMBER' },
    { tripTitle: 'Leh-Ladakh Road Trip', userId: anil.id, role: 'MEMBER' },

    // Hyderabad to Hampi (group - Meena lead + Deepa + Arjun + Sara + Demo)
    { tripTitle: 'Hyderabad to Hampi', userId: meena.id, role: 'LEAD' },
    { tripTitle: 'Hyderabad to Hampi', userId: deepa.id, role: 'MEMBER' },
    { tripTitle: 'Hyderabad to Hampi', userId: arjun.id, role: 'MEMBER' },
    { tripTitle: 'Hyderabad to Hampi', userId: sara.id, role: 'MEMBER' },
    { tripTitle: 'Hyderabad to Hampi', userId: demo.id, role: 'MEMBER' },

    // Manali to Rohtang (duo - Rohan + Priya)
    { tripTitle: 'Manali to Rohtang', userId: rohan.id, role: 'LEAD' },
    { tripTitle: 'Manali to Rohtang', userId: priya.id, role: 'MEMBER' },

    // Kerala Backwaters (squad - Anil + Demo + Sara)
    { tripTitle: 'Kerala Backwaters', userId: anil.id, role: 'LEAD' },
    { tripTitle: 'Kerala Backwaters', userId: demo.id, role: 'MEMBER' },
    { tripTitle: 'Kerala Backwaters', userId: sara.id, role: 'MEMBER' },

    // Rajasthan Circuit (group - Meena lead + many)
    { tripTitle: 'Rajasthan Circuit', userId: meena.id, role: 'LEAD' },
    { tripTitle: 'Rajasthan Circuit', userId: demo.id, role: 'MEMBER' },
    { tripTitle: 'Rajasthan Circuit', userId: priya.id, role: 'MEMBER' },
    { tripTitle: 'Rajasthan Circuit', userId: rohan.id, role: 'MEMBER' },
    { tripTitle: 'Rajasthan Circuit', userId: deepa.id, role: 'MEMBER' },

    // Ooty to Coonoor (duo - Sara + Demo)
    { tripTitle: 'Ooty to Coonoor', userId: sara.id, role: 'LEAD' },
    { tripTitle: 'Ooty to Coonoor', userId: demo.id, role: 'MEMBER' },

    // Rishikesh Adventure (squad - Anil + Vikram + Karthik)
    { tripTitle: 'Rishikesh Adventure', userId: anil.id, role: 'LEAD' },
    { tripTitle: 'Rishikesh Adventure', userId: vikram.id, role: 'MEMBER' },
    { tripTitle: 'Rishikesh Adventure', userId: karthik.id, role: 'MEMBER' },
  ];

  let count = 0;
  for (const m of memberships) {
    const trip = tripByTitle(m.tripTitle);
    if (!trip) continue;

    await prisma.tripMember.upsert({
      where: { tripId_userId: { tripId: trip.id, userId: m.userId } },
      update: { role: m.role },
      create: { tripId: trip.id, userId: m.userId, role: m.role },
    });
    count++;
  }
  console.log(`  ✓ ${count} trip memberships`);
}

// ═══════════════════════════════════════════════════════════════
//  6. NOTES
// ═══════════════════════════════════════════════════════════════

async function seedNotes(users: Record<string, any>, trips: any[]) {
  console.log('🌱 Seeding notes...');

  const demo = users['demo@partner.app'];
  const arjun = users['arjun@partner.app'];
  const priya = users['priya@partner.app'];
  const karthik = users['karthik@partner.app'];
  const vikram = users['vikram@partner.app'];
  const meena = users['meena@partner.app'];
  const deepa = users['deepa@partner.app'];
  const sara = users['sara@partner.app'];

  const tripByTitle = (title: string) => trips.find((t: any) => t.title === title);

  const notesData = [
    { userId: demo.id, tripId: tripByTitle('Mumbai to Goa')?.id, type: 'TEXT' as const, title: 'Best stops on NH66', content: 'Stopped at Kamat restaurant near Ratnagiri for amazing Konkani thali. The coastal road after Chiplun is breathtaking. Must stop at Ganpatipule temple.', tags: ['food', 'stops', 'coastal'] },
    { userId: demo.id, tripId: tripByTitle('Mumbai to Goa')?.id, type: 'PHOTO' as const, title: 'Sunset at Vagator', content: 'Caught the most incredible sunset at Vagator cliff. The sky turned deep orange.', photoUrls: ['/photos/vagator-sunset-1.jpg', '/photos/vagator-sunset-2.jpg'], tags: ['sunset', 'goa', 'beach'] },
    { userId: demo.id, tripId: tripByTitle('Mumbai to Goa')?.id, type: 'VOICE' as const, title: 'Travel thoughts', content: 'Voice note recorded near Amboli Ghat', audioUrl: '/audio/goa-trip-thoughts.mp3', tags: ['personal'] },
    { userId: priya.id, tripId: tripByTitle('Delhi to Jaipur')?.id, type: 'TEXT' as const, title: 'Jaipur itinerary notes', content: 'Day 1: Amber Fort + Nahargarh. Day 2: City Palace + Hawa Mahal. Day 3: Shopping at Johari Bazaar. Book guide at Amber Fort — totally worth it.', tags: ['itinerary', 'jaipur'] },
    { userId: priya.id, tripId: tripByTitle('Delhi to Jaipur')?.id, type: 'PLAN' as const, title: 'Budget breakdown', content: 'Hotel: Rs 3500/night. Food: Rs 1500/day. Sightseeing: Rs 2000 total. Shopping: Rs 5000. Total estimated: Rs 18,000 for 3 days.', tags: ['budget', 'planning'] },
    { userId: karthik.id, tripId: tripByTitle('Leh-Ladakh Road Trip')?.id, type: 'TEXT' as const, title: 'Bike maintenance checklist', content: 'Pre-trip: Chain tension, brake pads, tire pressure 28psi, engine oil level, toolkit, spare clutch cable. Altitude tip: Re-jet carb above 12000ft.', tags: ['bike', 'maintenance', 'checklist'] },
    { userId: karthik.id, tripId: tripByTitle('Leh-Ladakh Road Trip')?.id, type: 'PHOTO' as const, title: 'Khardung La summit', content: 'Made it to the top! 17,582 ft — one of the highest motorable passes in the world.', photoUrls: ['/photos/khardungla-1.jpg', '/photos/khardungla-flag.jpg'], tags: ['ladakh', 'pass', 'achievement'] },
    { userId: vikram.id, tripId: tripByTitle('Darjeeling Trek')?.id, type: 'TEXT' as const, title: 'Sandakphu route notes', content: 'Day 1: Manebhanjang to Tumling (11km). Day 2: Tumling to Kalapokhri (14km). Day 3: Kalapokhri to Sandakphu (6km). Carry enough water, no shops after Tumling.', tags: ['trek', 'route', 'himalayas'] },
    { userId: meena.id, tripId: tripByTitle('Hyderabad to Hampi')?.id, type: 'PLAN' as const, title: 'Group coordination', content: 'Bus departs 6 AM from Majestic. Everyone to carry ID proof. Booking ref: HAMPI2025. Accommodation at Hampi Heritage Resort — 3 rooms booked.', tags: ['group', 'logistics'] },
    { userId: meena.id, tripId: tripByTitle('Hyderabad to Hampi')?.id, type: 'TEXT' as const, title: 'Hampi must-see list', content: 'Virupaksha Temple, Vittala Temple (stone chariot), Elephant Stables, Queen\'s Bath, Matanga Hill for sunrise, Hippie Island for sunset.', tags: ['sightseeing', 'hampi', 'heritage'] },
    { userId: deepa.id, tripId: tripByTitle('Varanasi to Bodh Gaya')?.id, type: 'TEXT' as const, title: 'Varanasi temple guide', content: 'Kashi Vishwanath darshan best before 6 AM. Ganga Aarti at Dashashwamedh Ghat starts 6:45 PM. Boat ride Rs 200/person for 1 hour.', tags: ['temple', 'guide', 'varanasi'] },
    { userId: deepa.id, tripId: tripByTitle('Varanasi to Bodh Gaya')?.id, type: 'PHOTO' as const, title: 'Ganga Aarti ceremony', content: 'The evening aarti ceremony at Dashashwamedh Ghat was a spiritual experience.', photoUrls: ['/photos/ganga-aarti-1.jpg'], tags: ['spiritual', 'ceremony'] },
    { userId: arjun.id, tripId: tripByTitle('Goa Beach Hopping')?.id, type: 'TEXT' as const, title: 'Hidden beach gems', content: 'Butterfly Beach — accessible only by boat from Palolem. Cola Beach — freshwater lagoon meets sea. Kakolem Beach — secluded, no tourist crowd.', tags: ['beach', 'hidden-gems', 'goa'] },
    { userId: sara.id, tripId: tripByTitle('Ooty to Coonoor')?.id, type: 'TEXT' as const, title: 'Food diary - Nilgiris', content: 'Tried the famous Ooty varkey (puff pastry). Coonoor has amazing homemade chocolates at King Star. Must try: Filter coffee at Shree Annapoorna.', tags: ['food', 'nilgiris', 'diary'] },
    { userId: demo.id, tripId: null, type: 'TEXT' as const, title: 'Packing essentials', content: 'Universal charger, first aid kit, rain jacket, dry bags for electronics, physical map backup, local SIM card, portable WiFi.', tags: ['packing', 'essentials'] },
    { userId: demo.id, tripId: null, type: 'PLAN' as const, title: '2026 travel bucket list', content: '1. Northeast India circuit (Meghalaya + Assam). 2. Spiti Valley. 3. Andaman Islands. 4. Rann of Kutch during Rann Utsav. 5. Hampi ruins.', tags: ['bucketlist', '2026'] },
    { userId: arjun.id, tripId: null, type: 'TEXT' as const, title: 'Remote work cafes', content: 'Best WiFi cafes for digital nomads: Workbay Manali, Cafe 1947 Old Manali, The Lazy Dog Bir, Satori Rishikesh, Alt Life Goa.', tags: ['remote-work', 'cafes', 'wifi'] },
    { userId: karthik.id, tripId: null, type: 'TEXT' as const, title: 'Bike trip gear list', content: 'Riding jacket with armor, knee guards, waterproof gloves, balaclava, tank bag, saddlebags, bungee net, tyre puncture kit, USB charger mount.', tags: ['gear', 'bike', 'equipment'] },
    { userId: vikram.id, tripId: null, type: 'TEXT' as const, title: 'High altitude tips', content: 'Acclimatize for 24hrs at 10,000ft. Drink 4L water/day. Diamox 125mg twice daily if needed. Avoid alcohol first 2 days. Descend if severe headache.', tags: ['altitude', 'health', 'tips'] },
    { userId: sara.id, tripId: null, type: 'TEXT' as const, title: 'Street food safety tips', content: 'Look for high-turnover stalls. Avoid cut fruits. Carry ORS packets. Eat where locals eat. Peel your own fruits. Stick to hot/freshly cooked items.', tags: ['food', 'safety', 'street-food'] },
  ];

  let count = 0;
  for (const n of notesData) {
    const existing = await prisma.note.findFirst({
      where: { userId: n.userId, title: n.title },
    });
    if (existing) { count++; continue; }

    await prisma.note.create({ data: n });
    count++;
  }
  console.log(`  ✓ ${count} notes`);
}

// ═══════════════════════════════════════════════════════════════
//  7. POIs
// ═══════════════════════════════════════════════════════════════

async function seedPOIs(users: Record<string, any>) {
  console.log('🌱 Seeding POIs...');

  const demo = users['demo@partner.app'];

  const poisData = [
    // Hotels
    { name: 'Taj Lake Palace', category: 'HOTEL' as const, description: 'Iconic luxury hotel floating on Lake Pichola, Udaipur. A former royal palace turned heritage hotel.', latitude: 24.5727, longitude: 73.6804, rating: 4.8, totalRatings: 2500, verified: true, city: 'Udaipur', country: 'India', address: 'Pichola Lake, Udaipur 313001', priceRange: '$$$$', amenities: ['pool', 'spa', 'restaurant', 'lake-view', 'heritage'], submittedById: demo.id },
    { name: 'The Leela Goa', category: 'HOTEL' as const, description: 'Luxury beach resort in South Goa with lagoon-style pools and pristine private beach.', latitude: 15.1809, longitude: 73.9427, rating: 4.6, totalRatings: 1800, verified: true, city: 'Goa', country: 'India', address: 'Mobor, Cavelossim, Goa 403731', priceRange: '$$$$', amenities: ['beach', 'pool', 'spa', 'golf', 'restaurant'], submittedById: demo.id },
    { name: 'Zostel Manali', category: 'HOSTEL' as const, description: 'Popular backpacker hostel in Old Manali with mountain views and vibrant common area.', latitude: 32.2550, longitude: 77.1810, rating: 4.3, totalRatings: 950, verified: true, city: 'Manali', country: 'India', address: 'Old Manali Road, Manali 175131', priceRange: '$', amenities: ['wifi', 'common-room', 'kitchen', 'mountain-view'], submittedById: demo.id },
    { name: 'ITC Grand Chola', category: 'HOTEL' as const, description: 'Magnificent luxury hotel in Chennai inspired by Chola dynasty architecture.', latitude: 13.0112, longitude: 80.2207, rating: 4.7, totalRatings: 3200, verified: true, city: 'Chennai', country: 'India', address: '63 Mount Road, Guindy, Chennai 600032', priceRange: '$$$$', amenities: ['pool', 'spa', 'restaurants', 'business-center'], submittedById: demo.id },

    // Tea Shops
    { name: 'Chai Point - Koramangala', category: 'TEA_SHOP' as const, description: 'Popular chai chain with authentic Indian tea. The ginger chai is legendary.', latitude: 12.9352, longitude: 77.6245, rating: 4.2, totalRatings: 800, verified: true, city: 'Bangalore', country: 'India', address: '80 Feet Road, Koramangala', priceRange: '$', amenities: ['wifi', 'snacks'] },
    { name: 'Sharma Tea Stall', category: 'TEA_SHOP' as const, description: 'Iconic roadside chai stall on the Delhi-Jaipur highway. Serving travelers since 1972.', latitude: 27.5530, longitude: 76.6346, rating: 4.5, totalRatings: 450, verified: true, city: 'Neemrana', country: 'India', address: 'NH48, near Neemrana Fort', priceRange: '$', amenities: ['parking', 'snacks'] },
    { name: 'Chai Walli - Leh', category: 'TEA_SHOP' as const, description: 'Charming tea house in Leh serving butter tea and masala chai with mountain views.', latitude: 34.1526, longitude: 77.5771, rating: 4.4, totalRatings: 320, verified: true, city: 'Leh', country: 'India', address: 'Main Bazaar, Leh', priceRange: '$', amenities: ['seating', 'view'] },

    // Restaurants
    { name: 'Karavalli', category: 'RESTAURANT' as const, description: 'Award-winning coastal Karnataka cuisine at The Gateway Hotel, Bangalore.', latitude: 12.9611, longitude: 77.5993, rating: 4.7, totalRatings: 2100, verified: true, city: 'Bangalore', country: 'India', address: 'The Gateway Hotel, 66 Residency Road', priceRange: '$$$', amenities: ['fine-dining', 'parking', 'bar'], dietaryOptions: ['vegetarian', 'seafood'] },
    { name: 'Bukhara', category: 'RESTAURANT' as const, description: 'Legendary North Indian restaurant at ITC Maurya, famous for Dal Bukhara.', latitude: 28.5977, longitude: 77.1731, rating: 4.8, totalRatings: 4500, verified: true, city: 'Delhi', country: 'India', address: 'ITC Maurya, Sardar Patel Marg', priceRange: '$$$$', amenities: ['fine-dining', 'valet-parking'], dietaryOptions: ['non-vegetarian', 'vegetarian'] },
    { name: 'Bademiya', category: 'RESTAURANT' as const, description: 'Iconic late-night kebab stall in Mumbai. Open-air street food institution since 1946.', latitude: 18.9265, longitude: 72.8314, rating: 4.3, totalRatings: 3800, verified: true, city: 'Mumbai', country: 'India', address: 'Tulloch Road, behind Taj Mahal Palace', priceRange: '$', amenities: ['takeaway', 'late-night'] },
    { name: 'Mavalli Tiffin Rooms (MTR)', category: 'RESTAURANT' as const, description: 'Heritage South Indian restaurant famous for masala dosa and filter coffee since 1924.', latitude: 12.9553, longitude: 77.5734, rating: 4.6, totalRatings: 5200, verified: true, city: 'Bangalore', country: 'India', address: '14 Lalbagh Road, Bangalore', priceRange: '$', amenities: ['traditional', 'breakfast'], dietaryOptions: ['vegetarian'] },

    // Scenic
    { name: 'Pangong Lake', category: 'SCENIC' as const, description: 'Breathtaking high-altitude lake at 14,270 ft spanning India and China. Crystal blue waters with changing colors.', latitude: 33.7595, longitude: 78.6615, rating: 4.9, totalRatings: 6000, verified: true, city: 'Leh', country: 'India', priceRange: 'Free', amenities: ['photography', 'camping-nearby'] },
    { name: 'Valley of Flowers', category: 'SCENIC' as const, description: 'UNESCO World Heritage Site in Uttarakhand. Over 600 species of flowering plants bloom July-September.', latitude: 30.7280, longitude: 79.6050, rating: 4.8, totalRatings: 2800, verified: true, city: 'Chamoli', country: 'India', priceRange: '$', amenities: ['trekking', 'photography', 'nature'] },
    { name: 'Dudhsagar Falls', category: 'SCENIC' as const, description: 'Majestic four-tiered waterfall on the Goa-Karnataka border, 310m high.', latitude: 15.3144, longitude: 74.3143, rating: 4.6, totalRatings: 3500, verified: true, city: 'Goa', country: 'India', amenities: ['trekking', 'photography', 'swimming'] },

    // Historic
    { name: 'Hampi Ruins', category: 'HISTORIC' as const, description: 'UNESCO World Heritage Site. Ruins of Vijayanagara Empire with stunning boulder-strewn landscape.', latitude: 15.3350, longitude: 76.4600, rating: 4.8, totalRatings: 7000, verified: true, city: 'Hampi', country: 'India', address: 'Hampi, Ballari District, Karnataka', priceRange: '$', amenities: ['guided-tours', 'photography', 'heritage'] },
    { name: 'Red Fort', category: 'HISTORIC' as const, description: 'Iconic Mughal-era fort in Old Delhi. Red sandstone walls and Diwan-i-Aam are spectacular.', latitude: 28.6562, longitude: 77.2410, rating: 4.5, totalRatings: 12000, verified: true, city: 'Delhi', country: 'India', address: 'Netaji Subhash Marg, Chandni Chowk', priceRange: '$', amenities: ['guided-tours', 'light-show', 'museum'] },
    { name: 'Mysore Palace', category: 'HISTORIC' as const, description: 'Grand royal palace with Indo-Saracenic architecture. The Sunday evening illumination with 97,000 bulbs is magical.', latitude: 12.3051, longitude: 76.6551, rating: 4.7, totalRatings: 9500, verified: true, city: 'Mysore', country: 'India', address: 'Sayyaji Rao Road, Mysore', priceRange: '$', amenities: ['guided-tours', 'light-show', 'museum', 'garden'] },

    // Religious
    { name: 'Golden Temple', category: 'RELIGIOUS' as const, description: 'Harmandir Sahib — holiest Gurdwara of Sikhism. The gold-plated sanctum reflected in the Amrit Sarovar is divine.', latitude: 31.6200, longitude: 74.8765, rating: 4.9, totalRatings: 15000, verified: true, city: 'Amritsar', country: 'India', address: 'Golden Temple Road, Amritsar', priceRange: 'Free', amenities: ['langar', 'museum', 'sarovar', 'night-visit'] },
    { name: 'Meenakshi Amman Temple', category: 'RELIGIOUS' as const, description: 'Magnificent Dravidian temple with 14 gopurams covered in colorful sculptures. A 2,500-year-old marvel.', latitude: 9.9195, longitude: 78.1193, rating: 4.8, totalRatings: 8000, verified: true, city: 'Madurai', country: 'India', address: 'Madurai Main Road, Madurai', priceRange: 'Free', amenities: ['guided-tours', 'museum', 'evening-ceremony'] },
    { name: 'Kedarnath Temple', category: 'RELIGIOUS' as const, description: 'Ancient Shiva temple at 11,755 ft in the Himalayas. One of the 12 Jyotirlingas.', latitude: 30.7346, longitude: 79.0669, rating: 4.9, totalRatings: 5500, verified: true, city: 'Rudraprayag', country: 'India', priceRange: 'Free', amenities: ['trekking', 'helicopter-service', 'dharamshala'] },

    // Trailheads
    { name: 'Triund Trek Start', category: 'TRAILHEAD' as const, description: 'Popular weekend trek from McLeodganj. 9km trail through oak and rhododendron forests to stunning 360° views.', latitude: 32.2469, longitude: 76.3188, rating: 4.5, totalRatings: 4200, verified: true, city: 'Dharamshala', country: 'India', address: 'Galu Devi Temple, McLeodganj', priceRange: 'Free', amenities: ['camping', 'views', 'tea-shops-enroute'] },
    { name: 'Roopkund Trek Base', category: 'TRAILHEAD' as const, description: 'Base camp for the mysterious Roopkund skeleton lake trek at 16,500 ft. Moderate-difficult, 8-day trek.', latitude: 30.2625, longitude: 79.7314, rating: 4.7, totalRatings: 1800, verified: true, city: 'Chamoli', country: 'India', address: 'Lohajung Village, Chamoli', priceRange: '$', amenities: ['camping', 'guide-required', 'permit-required'] },

    // Petrol/ATM
    { name: 'HP Petrol - Tandi', category: 'PETROL' as const, description: 'Last petrol pump before Keylong on the Manali-Leh highway. Fill up here!', latitude: 32.5505, longitude: 76.9606, rating: 4.0, totalRatings: 800, verified: true, city: 'Lahaul', country: 'India', address: 'NH3, Tandi, Lahaul', amenities: ['air', 'water', 'restroom'] },
    { name: 'SBI ATM - Leh Main Bazaar', category: 'ATM' as const, description: 'One of the few reliable ATMs in Leh. Can have long queues in peak season.', latitude: 34.1538, longitude: 77.5770, rating: 3.8, totalRatings: 450, verified: true, city: 'Leh', country: 'India', address: 'Main Bazaar, Leh', amenities: ['24-hour'] },
  ];

  let count = 0;
  for (const p of poisData) {
    const existing = await prisma.pOI.findFirst({
      where: { name: p.name, city: p.city },
    });
    if (existing) { count++; continue; }

    await prisma.pOI.create({ data: p });
    count++;
  }
  console.log(`  ✓ ${count} POIs`);
}

// ═══════════════════════════════════════════════════════════════
//  8. EMERGENCY CONTACTS
// ═══════════════════════════════════════════════════════════════

async function seedEmergencyContacts(users: Record<string, any>) {
  console.log('🌱 Seeding emergency contacts...');

  const demo = users['demo@partner.app'];

  const contacts = [
    { userId: demo.id, name: 'Ramesh Kumar', phone: '+91-9876500001', relationship: 'Father', isPrimary: true },
    { userId: demo.id, name: 'Sunita Kumar', phone: '+91-9876500002', relationship: 'Mother', isPrimary: false },
    { userId: demo.id, name: 'Anjali Kumar', phone: '+91-9876500003', relationship: 'Sister', isPrimary: false },
  ];

  for (const c of contacts) {
    const existing = await prisma.emergencyContact.findFirst({
      where: { userId: c.userId, phone: c.phone },
    });
    if (!existing) {
      await prisma.emergencyContact.create({ data: c });
    }
  }
  console.log('  ✓ 3 emergency contacts for demo user');
}

// ═══════════════════════════════════════════════════════════════
//  9. CULTURE CARDS
// ═══════════════════════════════════════════════════════════════

async function seedCultureCards() {
  console.log('🌱 Seeding culture cards...');

  const cards = [
    {
      country: 'India',
      greetings: 'Namaste with folded hands is the universal greeting. In South India, "Vanakkam" is used. Touching the feet of elders is a sign of respect.',
      tippingCulture: 'Tipping is appreciated but not mandatory. 10% at restaurants is standard. Round up for auto/taxi drivers. Rs 20-50 for hotel bellboys.',
      dressCode: 'Modest clothing recommended, especially at religious sites. Remove shoes before entering temples. Cover shoulders and knees at places of worship.',
      punctuality: 'IST (Indian Stretchable Time) is real. Social events may start 30-60 min late. Business meetings tend to be more punctual.',
      giftGiving: 'Sweets (mithai) are common gifts when visiting homes. Avoid leather gifts for Hindu families. Use right hand to give/receive.',
      photographyRules: 'Ask permission before photographing people. Photography prohibited inside many temples and mosques. Tripods need special permits at monuments.',
      pdaNorms: 'Public display of affection is generally frowned upon. Holding hands is acceptable in urban areas. Same-sex PDA attracts attention.',
      bargainingCulture: 'Bargaining is expected at street markets and auto rickshaws. Start at 50% of quoted price. Fixed prices at malls and branded stores.',
    },
    {
      country: 'Japan',
      greetings: 'Bow when greeting — deeper bow shows more respect. Business cards (meishi) exchanged with both hands. Say "Hajimemashite" when meeting someone new.',
      tippingCulture: 'Tipping is NOT customary and can be considered rude. Service charge is included. Exceptional service is simply expected.',
      dressCode: 'Conservative, neat attire valued. Remove shoes indoors (look for shoe racks). Tattoos may restrict access to onsens and public baths.',
      punctuality: 'Extremely punctual culture. Trains run to the second. Being even 1 minute late is considered disrespectful.',
      giftGiving: 'Omiyage (souvenir gifts) are essential. Wrap gifts elegantly. Avoid sets of 4 (shi = death). Present with both hands.',
      photographyRules: 'Generally photo-friendly. Some temples prohibit photography inside. Always ask before photographing geisha in Kyoto.',
      pdaNorms: 'Very reserved. Minimal physical contact in public. Bowing instead of handshakes. Couples rarely show affection publicly.',
      bargainingCulture: 'Bargaining is not practiced anywhere. Prices are fixed. Attempting to bargain is considered rude.',
    },
    {
      country: 'France',
      greetings: 'La bise (cheek kisses) — typically 2 kisses, varies by region. Say "Bonjour" before any interaction. "Monsieur/Madame" is important.',
      tippingCulture: 'Service charge (service compris) is included by law. Rounding up or leaving small change is appreciated but not expected.',
      dressCode: 'French dress stylishly but understated. Avoid athletic wear outside of sports. Smart casual is the norm. Cover shoulders in churches.',
      punctuality: 'Generally punctual for business. Social gatherings, arriving 15 min late (quart d\'heure de politesse) is normal.',
      giftGiving: 'Bring wine or flowers when invited to dinner. Avoid chrysanthemums (funeral flowers) and red roses (romantic). Quality over quantity.',
      photographyRules: 'Photography is restricted in some museums (no flash). The Eiffel Tower at night is copyrighted — commercial use restricted.',
      pdaNorms: 'Openly affectionate culture. Kissing and holding hands in public is completely normal and expected.',
      bargainingCulture: 'Fixed prices in shops and restaurants. Flea markets and antique markets may allow light negotiation.',
    },
    {
      country: 'Thailand',
      greetings: 'Wai greeting — press palms together at chest level with slight bow. Higher wai for monks and royalty. "Sawadee khrap/ka" (male/female).',
      tippingCulture: 'Not traditionally expected but appreciated. 20-50 baht for good restaurant service. Round up taxi fares. Tip massage therapists 50-100 baht.',
      dressCode: 'Dress modestly at temples — cover knees and shoulders. Remove shoes before entering temples and homes. No stepping on door thresholds.',
      punctuality: 'Relaxed attitude to time. "Thai time" means things happen when they happen. Don\'t stress about minor delays.',
      giftGiving: 'Avoid wrapping gifts in black. Present gifts with right hand or both hands. Fruit and sweets are appropriate gifts.',
      photographyRules: 'Never photograph yourself with Buddha statues disrespectfully. It\'s illegal to step on Thai currency (has king\'s image). Drone restrictions in many areas.',
      pdaNorms: 'Conservative culture. Avoid touching anyone\'s head (sacred). Feet are considered lowest — don\'t point feet at people or Buddha images.',
      bargainingCulture: 'Bargaining is expected at markets and street stalls. Start at 60% of asking price. Always smile and be polite while negotiating.',
    },
    {
      country: 'UAE',
      greetings: '"As-salamu alaykum" (peace be upon you) is the standard greeting. Handshakes are common between same gender. Wait for a woman to extend her hand first.',
      tippingCulture: '10-15% at restaurants if service charge not included. Tip taxi drivers by rounding up. Hotel staff: AED 5-10.',
      dressCode: 'Modest clothing required. Cover shoulders and knees in public. Swimwear only at beaches/pools. Abaya not required for tourists but respectful.',
      punctuality: 'Business meetings are punctual. Social events may have flexible timing. During Ramadan, schedules shift significantly.',
      giftGiving: 'Avoid alcohol and pork products as gifts. Perfume, dates, and Arabic sweets are excellent choices. Use right hand to give/receive.',
      photographyRules: 'Do not photograph people (especially women) without permission. No photography of government buildings or military installations. Drones require permits.',
      pdaNorms: 'Very conservative. PDA can result in fines or arrest. Holding hands for married couples is tolerated. Same-sex affection is illegal.',
      bargainingCulture: 'Bargaining expected in souks and traditional markets. Fixed prices in malls. Start at 50% and settle around 70% of asking price.',
    },
  ];

  for (const c of cards) {
    await prisma.cultureCard.upsert({
      where: { country: c.country },
      update: c,
      create: c,
    });
  }
  console.log('  ✓ 5 culture cards');
}

// ═══════════════════════════════════════════════════════════════
//  10. LOCAL DISHES
// ═══════════════════════════════════════════════════════════════

async function seedLocalDishes() {
  console.log('🌱 Seeding local dishes...');

  const dishes = [
    { name: 'Hyderabadi Biryani', country: 'India', region: 'Telangana', description: 'Fragrant basmati rice layered with marinated meat, slow-cooked in a sealed pot (dum). The Hyderabadi version uses kachchi (raw) method with saffron and fried onions.', flavorProfile: ['spicy', 'aromatic', 'savory'], mustTryScore: 10, averagePrice: 300, currency: 'INR' },
    { name: 'Masala Dosa', country: 'India', region: 'Karnataka', description: 'Crispy fermented rice-lentil crepe filled with spiced potato filling, served with coconut chutney and sambar. Best eaten with hands.', flavorProfile: ['savory', 'crispy', 'tangy'], mustTryScore: 9, averagePrice: 80, currency: 'INR' },
    { name: 'Butter Chicken', country: 'India', region: 'Delhi', description: 'Tandoori chicken in a creamy tomato-butter gravy. Invented at Moti Mahal, Delhi in the 1950s. Best with butter naan.', flavorProfile: ['creamy', 'mildly-spicy', 'rich'], mustTryScore: 9, averagePrice: 350, currency: 'INR' },
    { name: 'Vada Pav', country: 'India', region: 'Maharashtra', description: 'Mumbai\'s iconic street food — spiced potato fritter in a bread bun with green and tamarind chutneys. The city\'s answer to the burger.', flavorProfile: ['spicy', 'savory', 'tangy'], mustTryScore: 8, averagePrice: 20, currency: 'INR' },
    { name: 'Chole Bhature', country: 'India', region: 'Punjab', description: 'Spicy chickpea curry served with deep-fried fluffy bread. A hearty North Indian breakfast that will keep you full for hours.', flavorProfile: ['spicy', 'savory', 'rich'], mustTryScore: 8, averagePrice: 100, currency: 'INR' },
    { name: 'Rogan Josh', country: 'India', region: 'Kashmir', description: 'Aromatic lamb curry with Kashmiri chilies and yogurt. Deep red color from ratanjot (alkanet root). A Wazwan staple.', flavorProfile: ['aromatic', 'rich', 'moderately-spicy'], mustTryScore: 9, averagePrice: 400, currency: 'INR' },
    { name: 'Fish Curry (Meen Curry)', country: 'India', region: 'Kerala', description: 'Tangy coconut-based fish curry with kokum and raw mango. Best made with pearl spot (karimeen) fish and served with red rice.', flavorProfile: ['tangy', 'coconutty', 'spicy'], mustTryScore: 8, averagePrice: 200, currency: 'INR' },
    { name: 'Litti Chokha', country: 'India', region: 'Bihar', description: 'Baked wheat balls stuffed with sattu (roasted gram flour) served with mashed vegetable mix. Rustic and incredibly flavorful.', flavorProfile: ['smoky', 'earthy', 'savory'], mustTryScore: 7, averagePrice: 60, currency: 'INR' },
    { name: 'Pav Bhaji', country: 'India', region: 'Maharashtra', description: 'Mashed mixed vegetables in a spicy tomato gravy served with buttered pav bread. Best enjoyed at Juhu Beach, Mumbai.', flavorProfile: ['spicy', 'buttery', 'savory'], mustTryScore: 8, averagePrice: 80, currency: 'INR' },
    { name: 'Momos', country: 'India', region: 'Northeast/Tibetan', description: 'Steamed or fried dumplings filled with minced meat or vegetables. Served with fiery red chili chutney. Street food staple in Delhi and NE India.', flavorProfile: ['savory', 'umami', 'spicy-chutney'], mustTryScore: 8, averagePrice: 60, currency: 'INR' },
    { name: 'Appam with Stew', country: 'India', region: 'Kerala', description: 'Lacy fermented rice pancake with crispy edges and soft center, paired with coconut milk vegetable or chicken stew.', flavorProfile: ['mild', 'coconutty', 'comforting'], mustTryScore: 8, averagePrice: 120, currency: 'INR' },
    { name: 'Dal Baati Churma', country: 'India', region: 'Rajasthan', description: 'Hard wheat balls (baati) baked over cow-dung fire, crushed and drenched in ghee, served with spicy lentil dal and sweet churma.', flavorProfile: ['rich', 'ghee-laden', 'sweet-savory'], mustTryScore: 9, averagePrice: 150, currency: 'INR' },
    { name: 'Poha', country: 'India', region: 'Madhya Pradesh', description: 'Flattened rice flakes tempered with mustard seeds, turmeric, onions, and peanuts. The go-to breakfast in Indore with jalebi on the side.', flavorProfile: ['mild', 'savory', 'light'], mustTryScore: 7, averagePrice: 30, currency: 'INR' },
    { name: 'Bamboo Shoot Curry', country: 'India', region: 'Nagaland', description: 'Fermented bamboo shoot cooked with pork and king chili (Bhut Jolokia). One of the spiciest dishes in Indian cuisine.', flavorProfile: ['extremely-spicy', 'fermented', 'earthy'], mustTryScore: 7, averagePrice: 180, currency: 'INR' },
    { name: 'Mysore Pak', country: 'India', region: 'Karnataka', description: 'Rich, melt-in-mouth sweet made from gram flour, ghee, and sugar. Invented in the kitchens of Mysore Palace.', flavorProfile: ['sweet', 'buttery', 'crumbly'], mustTryScore: 8, averagePrice: 40, currency: 'INR' },
  ];

  let count = 0;
  for (const d of dishes) {
    const existing = await prisma.localDish.findFirst({
      where: { name: d.name, country: d.country },
    });
    if (!existing) {
      await prisma.localDish.create({ data: d });
    }
    count++;
  }
  console.log(`  ✓ ${count} local dishes`);
}

// ═══════════════════════════════════════════════════════════════
//  11. TRAVEL ADVISORIES
// ═══════════════════════════════════════════════════════════════

async function seedTravelAdvisories() {
  console.log('🌱 Seeding travel advisories...');

  const advisories = [
    { country: 'India', level: 'CAUTION' as const, description: 'Exercise normal safety precautions. Avoid border areas with Pakistan and China. Be cautious in J&K outside tourist zones. Petty theft in crowded areas.', source: 'Ministry of External Affairs' },
    { country: 'Thailand', level: 'SAFE' as const, description: 'Generally safe for tourists. Exercise caution in southern provinces (Yala, Pattani, Narathiwat). Be wary of scams in tourist areas.', source: 'Ministry of External Affairs' },
    { country: 'Japan', level: 'SAFE' as const, description: 'Very safe country for travelers. Low crime rate. Be aware of natural disaster protocols (earthquakes, typhoons). Follow local emergency instructions.', source: 'Ministry of External Affairs' },
    { country: 'Afghanistan', level: 'DO_NOT_TRAVEL' as const, description: 'Do not travel. Extremely dangerous security situation. No consular services available. All Indian nationals advised to leave.', source: 'Ministry of External Affairs' },
    { country: 'Ukraine', level: 'AVOID_NON_ESSENTIAL' as const, description: 'Avoid non-essential travel due to ongoing conflict. Indian embassy operations limited. Commercial flights suspended.', source: 'Ministry of External Affairs' },
  ];

  for (const a of advisories) {
    await prisma.travelAdvisory.upsert({
      where: { country: a.country },
      update: { level: a.level, description: a.description, source: a.source },
      create: a,
    });
  }
  console.log('  ✓ 5 travel advisories');
}

// ═══════════════════════════════════════════════════════════════
//  12. EMBASSIES
// ═══════════════════════════════════════════════════════════════

async function seedEmbassies() {
  console.log('🌱 Seeding embassies...');

  const embassies = [
    { country: 'United States', city: 'Washington D.C.', homeCountry: 'India', address: '2107 Massachusetts Avenue NW, Washington DC 20008', phone: '+1-202-939-7000', email: 'hoc@indiagov.org', latitude: 38.9126, longitude: -77.0477, operatingHours: { weekdays: '9:00 AM - 5:30 PM', weekends: 'Closed', timezone: 'EST' } },
    { country: 'United Kingdom', city: 'London', homeCountry: 'India', address: 'India House, Aldwych, London WC2B 4NA', phone: '+44-20-7836-8484', email: 'info@hcilondon.in', latitude: 51.5130, longitude: -0.1170, operatingHours: { weekdays: '9:00 AM - 5:30 PM', weekends: 'Closed', timezone: 'GMT' } },
    { country: 'Japan', city: 'Tokyo', homeCountry: 'India', address: '2-2-11 Kudan Minami, Chiyoda-ku, Tokyo 102-0074', phone: '+81-3-3262-2391', email: 'info@indianembassy.jp', latitude: 35.6938, longitude: 139.7450, operatingHours: { weekdays: '9:00 AM - 5:30 PM', weekends: 'Closed', timezone: 'JST' } },
    { country: 'UAE', city: 'Abu Dhabi', homeCountry: 'India', address: 'Plot No. 10, Sector W-59/02, Abu Dhabi', phone: '+971-2-449-2700', email: 'cons.abudhabi@mea.gov.in', latitude: 24.4539, longitude: 54.3773, operatingHours: { weekdays: '9:00 AM - 5:00 PM', weekends: 'Fri-Sat Closed', timezone: 'GST' } },
    { country: 'Thailand', city: 'Bangkok', homeCountry: 'India', address: '46 Soi Prasarnmit, Sukhumvit 23, Bangkok 10110', phone: '+66-2-258-0300', email: 'cons.bangkok@mea.gov.in', latitude: 13.7367, longitude: 100.5670, operatingHours: { weekdays: '9:00 AM - 5:00 PM', weekends: 'Sat-Sun Closed', timezone: 'ICT' } },
  ];

  for (const e of embassies) {
    const existing = await prisma.embassy.findFirst({
      where: { country: e.country, homeCountry: e.homeCountry, city: e.city },
    });
    if (!existing) {
      await prisma.embassy.create({ data: e });
    }
  }
  console.log('  ✓ 5 embassies');
}

// ═══════════════════════════════════════════════════════════════
//  13. LIVE EVENTS
// ═══════════════════════════════════════════════════════════════

async function seedLiveEvents() {
  console.log('🌱 Seeding live events...');

  const events = [
    { name: 'Holi - Festival of Colors', type: 'FESTIVAL' as const, description: 'India\'s vibrant spring festival celebrating the triumph of good over evil. People throw colored powder (gulal) and water at each other. Mathura and Vrindavan have the most famous celebrations.', location: 'Pan India (best in Mathura, Vrindavan)', latitude: 27.4924, longitude: 77.6737, startDate: new Date('2026-03-14'), endDate: new Date('2026-03-15'), country: 'India', city: 'Mathura' },
    { name: 'Diwali - Festival of Lights', type: 'FESTIVAL' as const, description: 'The biggest Indian festival celebrating the return of Lord Rama. Homes decorated with diyas (oil lamps) and rangoli. Fireworks, sweets, and family gatherings.', location: 'Pan India (best in Jaipur, Varanasi)', latitude: 26.9124, longitude: 75.7873, startDate: new Date('2026-10-20'), endDate: new Date('2026-10-24'), country: 'India', city: 'Jaipur' },
    { name: 'Pongal', type: 'FESTIVAL' as const, description: 'Tamil harvest festival spanning 4 days. Includes Bhogi (discarding old items), Thai Pongal (cooking sweet rice), Mattu Pongal (honoring cattle), and Kaanum Pongal (family outings).', location: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, startDate: new Date('2027-01-14'), endDate: new Date('2027-01-17'), country: 'India', city: 'Chennai' },
    { name: 'Durga Puja', type: 'FESTIVAL' as const, description: 'Grand 5-day celebration of Goddess Durga in Bengal. Elaborate pandals (temporary structures), dhunuchi dance, sindoor khela, and immersion processions. UNESCO Intangible Heritage.', location: 'West Bengal (best in Kolkata)', latitude: 22.5726, longitude: 88.3639, startDate: new Date('2026-09-29'), endDate: new Date('2026-10-03'), country: 'India', city: 'Kolkata' },
    { name: 'Onam', type: 'FESTIVAL' as const, description: 'Kerala\'s harvest festival celebrating King Mahabali\'s return. Features Onasadya (26-course meal on banana leaf), Vallam Kali (snake boat races), Pulikali (tiger dance), and Athapookalam (flower rangoli).', location: 'Kerala (best in Kochi, Thrissur)', latitude: 9.9312, longitude: 76.2673, startDate: new Date('2026-09-05'), endDate: new Date('2026-09-15'), country: 'India', city: 'Kochi' },
  ];

  for (const e of events) {
    const existing = await prisma.liveEvent.findFirst({
      where: { name: e.name, country: e.country },
    });
    if (!existing) {
      await prisma.liveEvent.create({ data: e });
    }
  }
  console.log('  ✓ 5 live events');
}

// ═══════════════════════════════════════════════════════════════
//  14. WIFI HOTSPOTS
// ═══════════════════════════════════════════════════════════════

async function seedWifiHotspots(users: Record<string, any>) {
  console.log('🌱 Seeding WiFi hotspots...');

  const demo = users['demo@partner.app'];

  const hotspots = [
    { name: 'Third Wave Coffee - Indiranagar', location: 'Indiranagar, Bangalore', latitude: 12.9784, longitude: 77.6408, speedRating: 4, reliabilityRating: 5, indoor: true, verified: true, submittedById: demo.id },
    { name: 'Starbucks - Connaught Place', location: 'Block A, CP, New Delhi', latitude: 28.6315, longitude: 77.2167, speedRating: 3, reliabilityRating: 4, indoor: true, verified: true, submittedById: demo.id },
    { name: 'Bangalore Airport - Free WiFi', location: 'Kempegowda International Airport, Bangalore', latitude: 13.1989, longitude: 77.7068, speedRating: 3, reliabilityRating: 3, indoor: true, verified: true, submittedById: demo.id },
    { name: 'Blue Tokai Coffee - Bandra', location: 'Bandra West, Mumbai', latitude: 19.0596, longitude: 72.8295, speedRating: 4, reliabilityRating: 4, indoor: true, verified: true, submittedById: demo.id },
    { name: 'Indian Coffee House - Shimla', location: 'The Mall, Shimla', latitude: 31.1048, longitude: 77.1734, speedRating: 2, reliabilityRating: 2, indoor: true, verified: false, submittedById: demo.id },
  ];

  for (const h of hotspots) {
    const existing = await prisma.wifiHotspot.findFirst({
      where: { name: h.name },
    });
    if (!existing) {
      await prisma.wifiHotspot.create({ data: h });
    }
  }
  console.log('  ✓ 5 WiFi hotspots');
}

// ═══════════════════════════════════════════════════════════════
//  15. SIM OPTIONS
// ═══════════════════════════════════════════════════════════════

async function seedSIMOptions() {
  console.log('🌱 Seeding SIM options...');

  const sims = [
    { carrier: 'Jio', country: 'India', dataGB: 2, validityDays: 28, price: 239, currency: 'INR', esim: true, purchaseUrl: 'https://www.jio.com/selfcare/plans/mobility/prepaid-plans-background' },
    { carrier: 'Jio', country: 'India', dataGB: 1.5, validityDays: 84, price: 666, currency: 'INR', esim: true, purchaseUrl: 'https://www.jio.com/selfcare/plans/mobility/prepaid-plans-background' },
    { carrier: 'Airtel', country: 'India', dataGB: 2, validityDays: 28, price: 299, currency: 'INR', esim: true, purchaseUrl: 'https://www.airtel.in/prepaid/recharge' },
    { carrier: 'Vi (Vodafone Idea)', country: 'India', dataGB: 1.5, validityDays: 28, price: 269, currency: 'INR', esim: false, purchaseUrl: 'https://www.myvi.in/prepaid/best-prepaid-plans' },
    { carrier: 'BSNL', country: 'India', dataGB: 2, validityDays: 54, price: 447, currency: 'INR', esim: false, purchaseUrl: 'https://portal.bsnl.in/' },
  ];

  for (const s of sims) {
    const existing = await prisma.sIMOption.findFirst({
      where: { carrier: s.carrier, dataGB: s.dataGB, validityDays: s.validityDays },
    });
    if (!existing) {
      await prisma.sIMOption.create({ data: s });
    }
  }
  console.log('  ✓ 5 SIM options');
}

// ═══════════════════════════════════════════════════════════════
//  16. TRIP PASSPORT STAMPS
// ═══════════════════════════════════════════════════════════════

async function seedPassportStamps(users: Record<string, any>, trips: any[]) {
  console.log('🌱 Seeding passport stamps...');

  const demo = users['demo@partner.app'];
  const tripByTitle = (title: string) => trips.find((t: any) => t.title === title);

  const stamps = [
    { userId: demo.id, destination: 'Goa', country: 'India', tripId: tripByTitle('Mumbai to Goa')?.id, stampedAt: daysAgo(88) },
    { userId: demo.id, destination: 'Mysore', country: 'India', tripId: tripByTitle('Bangalore to Mysore')?.id, stampedAt: daysAgo(43) },
    { userId: demo.id, destination: 'Hampi', country: 'India', tripId: tripByTitle('Hyderabad to Hampi')?.id, stampedAt: daysAgo(72) },
    { userId: demo.id, destination: 'Kumarakom', country: 'India', tripId: tripByTitle('Kerala Backwaters')?.id, stampedAt: daysAgo(98) },
    { userId: demo.id, destination: 'Coonoor', country: 'India', tripId: tripByTitle('Ooty to Coonoor')?.id, stampedAt: daysAgo(14) },
    { userId: demo.id, destination: 'Mumbai', country: 'India', stampedAt: daysAgo(200) },
    { userId: demo.id, destination: 'Jaipur', country: 'India', stampedAt: daysAgo(150) },
    { userId: demo.id, destination: 'Udaipur', country: 'India', stampedAt: daysAgo(130) },
    { userId: demo.id, destination: 'Varanasi', country: 'India', stampedAt: daysAgo(110) },
    { userId: demo.id, destination: 'Rishikesh', country: 'India', stampedAt: daysAgo(95) },
  ];

  for (const s of stamps) {
    await prisma.tripPassportStamp.upsert({
      where: { userId_destination: { userId: s.userId, destination: s.destination } },
      update: {},
      create: s,
    });
  }
  console.log('  ✓ 10 passport stamps for demo user');
}

// ═══════════════════════════════════════════════════════════════
//  17. DIETARY PROFILE
// ═══════════════════════════════════════════════════════════════

async function seedDietaryProfile(users: Record<string, any>) {
  console.log('🌱 Seeding dietary profile...');

  const demo = users['demo@partner.app'];

  await prisma.dietaryProfile.upsert({
    where: { userId: demo.id },
    update: { vegetarian: true },
    create: {
      userId: demo.id,
      vegetarian: true,
      vegan: false,
      halal: false,
      kosher: false,
      glutenFree: false,
      dairyFree: false,
      nutAllergy: false,
      shellfishAllergy: false,
    },
  });
  console.log('  ✓ Dietary profile for demo user (vegetarian)');
}

// ═══════════════════════════════════════════════════════════════
//  18. LANGUAGE PACKS
// ═══════════════════════════════════════════════════════════════

async function seedLanguagePacks() {
  console.log('🌱 Seeding language packs...');

  const packs = [
    { langCode: 'hi', name: 'Hindi', sizeBytes: BigInt(5242880), downloadUrl: '/offline/lang/hi.pack', version: '2.1.0' },
    { langCode: 'ta', name: 'Tamil', sizeBytes: BigInt(4718592), downloadUrl: '/offline/lang/ta.pack', version: '1.8.0' },
    { langCode: 'te', name: 'Telugu', sizeBytes: BigInt(4456448), downloadUrl: '/offline/lang/te.pack', version: '1.6.0' },
    { langCode: 'kn', name: 'Kannada', sizeBytes: BigInt(4194304), downloadUrl: '/offline/lang/kn.pack', version: '1.5.0' },
    { langCode: 'fr', name: 'French', sizeBytes: BigInt(6291456), downloadUrl: '/offline/lang/fr.pack', version: '2.3.0' },
  ];

  for (const p of packs) {
    await prisma.languagePack.upsert({
      where: { langCode: p.langCode },
      update: { name: p.name, sizeBytes: p.sizeBytes, downloadUrl: p.downloadUrl, version: p.version },
      create: p,
    });
  }
  console.log('  ✓ 5 language packs');
}

// ═══════════════════════════════════════════════════════════════
//  19. PHRASES
// ═══════════════════════════════════════════════════════════════

async function seedPhrases() {
  console.log('🌱 Seeding phrases...');

  const phrases = [
    { langCode: 'hi', text: 'Namaste', translation: 'Hello / Greetings', transliteration: 'nuh-muh-stay', category: 'greetings' },
    { langCode: 'hi', text: 'Dhanyavaad', translation: 'Thank you', transliteration: 'dhun-yuh-vaad', category: 'greetings' },
    { langCode: 'hi', text: 'Haan', translation: 'Yes', transliteration: 'haan', category: 'basics' },
    { langCode: 'hi', text: 'Nahin', translation: 'No', transliteration: 'nuh-heen', category: 'basics' },
    { langCode: 'hi', text: 'Maaf kijiye', translation: 'Excuse me / Sorry', transliteration: 'maaf kee-jee-yay', category: 'basics' },
    { langCode: 'hi', text: 'Kripya', translation: 'Please', transliteration: 'krip-yaa', category: 'basics' },
    { langCode: 'hi', text: 'Yeh kitne ka hai?', translation: 'How much does this cost?', transliteration: 'yeh kit-nay kaa hai', category: 'shopping' },
    { langCode: 'hi', text: 'Kya aap English bolte hain?', translation: 'Do you speak English?', transliteration: 'kyaa aap ing-lish bol-tay hain', category: 'communication' },
    { langCode: 'hi', text: 'Mujhe madad chahiye', translation: 'I need help', transliteration: 'moo-jhay muh-dud chaa-hee-yay', category: 'emergency' },
    { langCode: 'hi', text: 'Hospital kahan hai?', translation: 'Where is the hospital?', transliteration: 'hos-pi-tul kuh-haan hai', category: 'emergency' },
    { langCode: 'hi', text: 'Station kahan hai?', translation: 'Where is the station?', transliteration: 'stay-shun kuh-haan hai', category: 'transport' },
    { langCode: 'hi', text: 'Yeh jagah kahan hai?', translation: 'Where is this place?', transliteration: 'yeh juh-gah kuh-haan hai', category: 'directions' },
    { langCode: 'hi', text: 'Daayein mudiye', translation: 'Turn right', transliteration: 'daa-yein moo-dee-yay', category: 'directions' },
    { langCode: 'hi', text: 'Baayein mudiye', translation: 'Turn left', transliteration: 'baa-yein moo-dee-yay', category: 'directions' },
    { langCode: 'hi', text: 'Seedha jaiye', translation: 'Go straight', transliteration: 'see-dhaa jaa-ee-yay', category: 'directions' },
    { langCode: 'hi', text: 'Ek chai dena', translation: 'Give me one tea', transliteration: 'ek chai day-naa', category: 'food' },
    { langCode: 'hi', text: 'Khana bahut accha tha', translation: 'The food was very good', transliteration: 'khaa-naa buh-hut uch-chaa thaa', category: 'food' },
    { langCode: 'hi', text: 'Bill de dijiye', translation: 'Please give the bill', transliteration: 'bill day dee-jee-yay', category: 'food' },
    { langCode: 'hi', text: 'Mera naam ... hai', translation: 'My name is ...', transliteration: 'may-raa naam ... hai', category: 'introduction' },
    { langCode: 'hi', text: 'Main tourist hoon', translation: 'I am a tourist', transliteration: 'main too-rist hoon', category: 'introduction' },
  ];

  let count = 0;
  for (const p of phrases) {
    const existing = await prisma.phrase.findFirst({
      where: { langCode: p.langCode, text: p.text },
    });
    if (!existing) {
      await prisma.phrase.create({ data: p });
    }
    count++;
  }
  console.log(`  ✓ ${count} phrases`);
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Partner Travel App - Database Seeder    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  // Core entities
  const users = await seedUsers();
  const badges = await seedBadges();
  await seedUserBadges(users, badges);
  const trips = await seedTrips(users);
  await seedTripMembers(users, trips);
  await seedNotes(users, trips);
  await seedPOIs(users);

  // User-specific
  await seedEmergencyContacts(users);
  await seedDietaryProfile(users);
  await seedPassportStamps(users, trips);

  // Reference data
  await seedCultureCards();
  await seedLocalDishes();
  await seedTravelAdvisories();
  await seedEmbassies();
  await seedLiveEvents();
  await seedWifiHotspots(users);
  await seedSIMOptions();
  await seedLanguagePacks();
  await seedPhrases();

  console.log('');
  console.log('✅ Database seeding complete!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
