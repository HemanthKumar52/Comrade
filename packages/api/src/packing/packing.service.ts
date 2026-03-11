import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratePackingListDto, CreateItineraryDto } from './dto/packing.dto';

@Injectable()
export class PackingService {
  constructor(private prisma: PrismaService) {}

  generatePackingList(dto: GeneratePackingListDto) {
    const items: Array<{ category: string; items: string[] }> = [];

    // Essentials always needed
    const essentials = [
      'Passport/ID',
      'Phone charger',
      'Power bank',
      'Travel wallet',
      'Copies of documents',
      'Travel insurance card',
    ];
    items.push({ category: 'Essentials', items: essentials });

    // Clothing based on duration
    const clothingCount = Math.min(dto.duration, 7);
    const clothing = [
      `${clothingCount} t-shirts/tops`,
      `${clothingCount} underwear`,
      `${clothingCount} pairs of socks`,
      `${Math.ceil(clothingCount / 2)} pants/shorts`,
      '1 jacket/sweater',
      '1 pair of comfortable walking shoes',
    ];

    if (dto.gender === 'female') {
      clothing.push(`${Math.ceil(clothingCount / 2)} dresses/skirts (optional)`);
    }

    items.push({ category: 'Clothing', items: clothing });

    // Toiletries
    items.push({
      category: 'Toiletries',
      items: [
        'Toothbrush & toothpaste',
        'Shampoo (travel size)',
        'Soap/body wash',
        'Deodorant',
        'Sunscreen',
        'Medications',
      ],
    });

    // Trip type specific
    if (dto.tripType === 'adventure' || dto.tripType === 'trekking') {
      items.push({
        category: 'Adventure Gear',
        items: [
          'Hiking boots',
          'Rain jacket',
          'Water bottle',
          'Headlamp/flashlight',
          'First aid kit',
          'Insect repellent',
          'Quick-dry towel',
        ],
      });
    }

    if (dto.tripType === 'business') {
      items.push({
        category: 'Business',
        items: [
          'Formal shirts',
          'Blazer/suit',
          'Dress shoes',
          'Laptop + charger',
          'Business cards',
          'Notebook & pen',
        ],
      });
    }

    if (dto.tripType === 'beach') {
      items.push({
        category: 'Beach',
        items: [
          'Swimsuit',
          'Beach towel',
          'Sunglasses',
          'Flip flops',
          'Hat/cap',
          'Waterproof phone case',
        ],
      });
    }

    // Activity specific
    if (dto.activities) {
      const activityItems: string[] = [];
      for (const activity of dto.activities) {
        switch (activity.toLowerCase()) {
          case 'hiking':
            activityItems.push('Trekking poles', 'Trail snacks', 'Map/GPS');
            break;
          case 'swimming':
            activityItems.push('Swimsuit', 'Goggles', 'Swim cap');
            break;
          case 'photography':
            activityItems.push('Camera', 'Extra batteries', 'Memory cards', 'Tripod');
            break;
          case 'camping':
            activityItems.push('Tent', 'Sleeping bag', 'Camping stove', 'Lighter');
            break;
          case 'snorkeling':
            activityItems.push('Snorkel set', 'Reef-safe sunscreen', 'Rash guard');
            break;
        }
      }
      if (activityItems.length > 0) {
        items.push({ category: 'Activity Gear', items: [...new Set(activityItems)] });
      }
    }

    // Tech
    items.push({
      category: 'Tech',
      items: [
        'Universal adapter',
        'Earphones/headphones',
        'E-reader/book',
      ],
    });

    return {
      destination: dto.destination,
      duration: dto.duration,
      tripType: dto.tripType,
      totalItems: items.reduce((sum, cat) => sum + cat.items.length, 0),
      categories: items,
    };
  }

  getTemplates() {
    return PACKING_TEMPLATES;
  }

  async createItinerary(userId: string, dto: CreateItineraryDto) {
    // Store itinerary as a note with type PLAN
    const note = await this.prisma.note.create({
      data: {
        userId,
        tripId: dto.tripId,
        type: 'PLAN',
        title: 'Trip Itinerary',
        content: JSON.stringify(dto.days),
        tags: ['itinerary'],
      },
    });

    return { id: note.id, tripId: dto.tripId, days: dto.days };
  }

  async getItinerary(tripId: string) {
    const note = await this.prisma.note.findFirst({
      where: {
        tripId,
        type: 'PLAN',
        tags: { has: 'itinerary' },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!note) {
      throw new NotFoundException('No itinerary found for this trip');
    }

    let days;
    try {
      days = JSON.parse(note.content || '[]');
    } catch {
      days = [];
    }

    return { id: note.id, tripId, days };
  }
}

const PACKING_TEMPLATES = [
  {
    name: 'Weekend Getaway',
    tripType: 'leisure',
    duration: 2,
    items: ['3 outfits', 'Toiletries', 'Phone charger', 'Book', 'Snacks'],
  },
  {
    name: 'Week-long Adventure',
    tripType: 'adventure',
    duration: 7,
    items: [
      'Hiking boots', 'Rain gear', '7 outfits', 'First aid kit',
      'Water bottle', 'Headlamp', 'Sunscreen', 'Insect repellent',
    ],
  },
  {
    name: 'Business Trip',
    tripType: 'business',
    duration: 3,
    items: [
      '3 formal outfits', 'Laptop', 'Business cards', 'Dress shoes',
      'Chargers', 'Notebook', 'Blazer',
    ],
  },
  {
    name: 'Beach Vacation',
    tripType: 'beach',
    duration: 5,
    items: [
      'Swimsuits', 'Sunscreen SPF50', 'Beach towel', 'Sunglasses',
      'Hat', 'Flip flops', 'Light clothing', 'Waterproof bag',
    ],
  },
  {
    name: 'Backpacking',
    tripType: 'backpacking',
    duration: 14,
    items: [
      'Backpack (40-60L)', 'Quick-dry clothing', 'Travel towel',
      'Padlock', 'Universal adapter', 'First aid kit', 'Water purifier',
      'Sleeping bag liner', 'Headlamp',
    ],
  },
];
