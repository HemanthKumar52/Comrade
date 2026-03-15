import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

@Injectable()
export class PlacesDiscoveryService {
  private readonly logger = new Logger(PlacesDiscoveryService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private readonly OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

  // ── Nearby Places ──────────────────────────────────────────

  async findNearby(lat: number, lng: number, radius: number, category?: string) {
    const osmFilter = category
      ? this.categoryToOsmFilter(category)
      : '"tourism"~"attraction|museum|artwork|viewpoint"';

    const query = this.buildOverpassQuery(osmFilter, lat, lng, radius);
    const cacheKey = `nearby:${lat}:${lng}:${radius}:${category || 'all'}`;

    return this.executeOverpassQuery(query, cacheKey);
  }

  // ── Landmarks ──────────────────────────────────────────────

  async findLandmarks(lat: number, lng: number, radius: number) {
    const osmFilter = '"tourism"~"attraction|museum"';
    const query = `
[out:json][timeout:25];
(
  node[${osmFilter}](around:${radius},${lat},${lng});
  way[${osmFilter}](around:${radius},${lat},${lng});
  node["historic"~"castle|monument|memorial|ruins"](around:${radius},${lat},${lng});
  way["historic"~"castle|monument|memorial|ruins"](around:${radius},${lat},${lng});
);
out center body;
`;
    const cacheKey = `landmarks:${lat}:${lng}:${radius}`;
    return this.executeOverpassQuery(query, cacheKey);
  }

  // ── Hidden Gems ────────────────────────────────────────────

  async findHiddenGems(lat: number, lng: number, radius: number) {
    const query = `
[out:json][timeout:25];
(
  node["tourism"="artwork"](around:${radius},${lat},${lng});
  node["tourism"="viewpoint"](around:${radius},${lat},${lng});
  node["historic"~"archaeological_site|wayside_shrine|ruins"](around:${radius},${lat},${lng});
  way["historic"~"archaeological_site|ruins"](around:${radius},${lat},${lng});
  node["natural"~"cave_entrance|spring|peak"](around:${radius},${lat},${lng});
);
out center body;
`;
    const cacheKey = `hidden-gems:${lat}:${lng}:${radius}`;
    return this.executeOverpassQuery(query, cacheKey);
  }

  // ── Photo Spots ────────────────────────────────────────────

  async findPhotoSpots(lat: number, lng: number, radius: number) {
    const query = `
[out:json][timeout:25];
(
  node["tourism"="viewpoint"](around:${radius},${lat},${lng});
  node["natural"~"peak|cliff|beach"](around:${radius},${lat},${lng});
  node["tourism"="artwork"](around:${radius},${lat},${lng});
  way["natural"="beach"](around:${radius},${lat},${lng});
  node["man_made"="lighthouse"](around:${radius},${lat},${lng});
  way["bridge"="yes"]["name"](around:${radius},${lat},${lng});
);
out center body;
`;
    const cacheKey = `photo-spots:${lat}:${lng}:${radius}`;
    return this.executeOverpassQuery(query, cacheKey);
  }

  // ── Free Activities ────────────────────────────────────────

  async findFreeActivities(lat: number, lng: number, radius: number) {
    const query = `
[out:json][timeout:25];
(
  node["leisure"~"park|garden|playground|nature_reserve"](around:${radius},${lat},${lng});
  way["leisure"~"park|garden|nature_reserve"](around:${radius},${lat},${lng});
  node["natural"="beach"](around:${radius},${lat},${lng});
  way["natural"="beach"](around:${radius},${lat},${lng});
  node["tourism"="viewpoint"](around:${radius},${lat},${lng});
  node["amenity"="marketplace"](around:${radius},${lat},${lng});
  way["amenity"="marketplace"](around:${radius},${lat},${lng});
  node["leisure"="swimming_area"](around:${radius},${lat},${lng});
);
out center body;
`;
    const cacheKey = `free-activities:${lat}:${lng}:${radius}`;
    return this.executeOverpassQuery(query, cacheKey);
  }

  // ── Categories ─────────────────────────────────────────────

  getCategories() {
    return [
      { key: 'tourism', label: 'Tourist Attractions', osmTag: 'tourism~attraction|museum|artwork|viewpoint' },
      { key: 'museum', label: 'Museums', osmTag: 'tourism=museum' },
      { key: 'artwork', label: 'Public Art', osmTag: 'tourism=artwork' },
      { key: 'viewpoint', label: 'Viewpoints', osmTag: 'tourism=viewpoint' },
      { key: 'beach', label: 'Beaches', osmTag: 'natural=beach' },
      { key: 'park', label: 'Parks & Gardens', osmTag: 'leisure~park|garden' },
      { key: 'castle', label: 'Castles', osmTag: 'historic=castle' },
      { key: 'ruins', label: 'Ruins', osmTag: 'historic=ruins' },
      { key: 'marketplace', label: 'Markets', osmTag: 'amenity=marketplace' },
      { key: 'temple', label: 'Temples', osmTag: 'amenity=place_of_worship;religion=buddhist' },
      { key: 'church', label: 'Churches', osmTag: 'amenity=place_of_worship;religion=christian' },
      { key: 'mosque', label: 'Mosques', osmTag: 'amenity=place_of_worship;religion=muslim' },
      { key: 'synagogue', label: 'Synagogues', osmTag: 'amenity=place_of_worship;religion=jewish' },
      { key: 'restaurant', label: 'Restaurants', osmTag: 'amenity=restaurant' },
      { key: 'cafe', label: 'Cafes', osmTag: 'amenity=cafe' },
      { key: 'bar', label: 'Bars', osmTag: 'amenity=bar' },
      { key: 'nightclub', label: 'Nightclubs', osmTag: 'amenity=nightclub' },
      { key: 'cinema', label: 'Cinemas', osmTag: 'amenity=cinema' },
      { key: 'theatre', label: 'Theatres', osmTag: 'amenity=theatre' },
      { key: 'zoo', label: 'Zoos', osmTag: 'tourism=zoo' },
      { key: 'aquarium', label: 'Aquariums', osmTag: 'tourism=aquarium' },
      { key: 'theme_park', label: 'Theme Parks', osmTag: 'tourism=theme_park' },
    ];
  }

  // ── Private Helpers ────────────────────────────────────────

  private buildOverpassQuery(
    osmFilter: string,
    lat: number,
    lng: number,
    radius: number,
  ): string {
    return `
[out:json][timeout:25];
(
  node[${osmFilter}](around:${radius},${lat},${lng});
  way[${osmFilter}](around:${radius},${lat},${lng});
);
out center body;
`;
  }

  private categoryToOsmFilter(category: string): string {
    const mapping: Record<string, string> = {
      tourism: '"tourism"~"attraction|museum|artwork|viewpoint"',
      museum: '"tourism"="museum"',
      artwork: '"tourism"="artwork"',
      viewpoint: '"tourism"="viewpoint"',
      beach: '"natural"="beach"',
      park: '"leisure"~"park|garden"',
      castle: '"historic"="castle"',
      ruins: '"historic"="ruins"',
      marketplace: '"amenity"="marketplace"',
      temple: '"amenity"="place_of_worship"]["religion"="buddhist"',
      church: '"amenity"="place_of_worship"]["religion"="christian"',
      mosque: '"amenity"="place_of_worship"]["religion"="muslim"',
      synagogue: '"amenity"="place_of_worship"]["religion"="jewish"',
      restaurant: '"amenity"="restaurant"',
      cafe: '"amenity"="cafe"',
      bar: '"amenity"="bar"',
      nightclub: '"amenity"="nightclub"',
      cinema: '"amenity"="cinema"',
      theatre: '"amenity"="theatre"',
      zoo: '"tourism"="zoo"',
      aquarium: '"tourism"="aquarium"',
      theme_park: '"tourism"="theme_park"',
    };

    return mapping[category.toLowerCase()] || '"tourism"~"attraction|museum|artwork|viewpoint"';
  }

  private getCached(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async executeOverpassQuery(query: string, cacheKey: string) {
    const cached = this.getCached(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    try {
      const response = await fetch(this.OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        this.logger.error(`Overpass API error: ${response.status} ${response.statusText}`);
        return { places: [], total: 0, source: 'overpass', error: 'Overpass API temporarily unavailable' };
      }

      const json = await response.json();
      const elements: OverpassElement[] = json.elements || [];

      const places = elements.map((el) => this.mapOverpassElement(el)).filter(Boolean);

      const result = {
        places,
        total: places.length,
        source: 'openstreetmap',
        cached: false,
      };

      this.setCache(cacheKey, { ...result, cached: true });
      return result;
    } catch (error) {
      this.logger.error(`Overpass API request failed: ${error}`);
      return {
        places: [],
        total: 0,
        source: 'overpass',
        error: 'Failed to fetch places from Overpass API',
      };
    }
  }

  private mapOverpassElement(el: OverpassElement) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) return null;

    const tags = el.tags || {};

    return {
      id: `osm-${el.type}-${el.id}`,
      name: tags.name || tags['name:en'] || 'Unnamed',
      type: el.type,
      lat,
      lng: lon,
      category: this.extractCategory(tags),
      description: tags.description || tags['description:en'] || null,
      wikipedia: tags.wikipedia || null,
      wikidata: tags.wikidata || null,
      website: tags.website || tags['contact:website'] || null,
      phone: tags.phone || tags['contact:phone'] || null,
      openingHours: tags.opening_hours || null,
      wheelchair: tags.wheelchair || null,
      fee: tags.fee || null,
      tags: {
        cuisine: tags.cuisine || null,
        religion: tags.religion || null,
        denomination: tags.denomination || null,
        historic: tags.historic || null,
        natural: tags.natural || null,
        leisure: tags.leisure || null,
        tourism: tags.tourism || null,
        amenity: tags.amenity || null,
      },
    };
  }

  private extractCategory(tags: Record<string, string>): string {
    if (tags.tourism) return `tourism:${tags.tourism}`;
    if (tags.historic) return `historic:${tags.historic}`;
    if (tags.natural) return `natural:${tags.natural}`;
    if (tags.leisure) return `leisure:${tags.leisure}`;
    if (tags.amenity) return `amenity:${tags.amenity}`;
    if (tags.man_made) return `man_made:${tags.man_made}`;
    return 'other';
  }
}
