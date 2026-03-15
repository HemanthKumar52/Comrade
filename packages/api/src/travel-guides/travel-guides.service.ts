import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

const WIKIVOYAGE_API = 'https://en.wikivoyage.org/w/api.php';
const WIKIVOYAGE_REST = 'https://en.wikivoyage.org/api/rest_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

interface GuideSection {
  index: number;
  title: string;
  level: number;
  content: string;
}

interface TravelGuide {
  destination: string;
  title: string;
  sections: GuideSection[];
  lastModified?: string;
}

interface GuideSummary {
  destination: string;
  title: string;
  description: string;
  thumbnail?: string;
  coordinates?: { lat: number; lng: number };
}

interface SearchResult {
  title: string;
  description?: string;
  url: string;
}

interface NearbyResult {
  title: string;
  lat: number;
  lng: number;
  distanceMeters: number;
}

@Injectable()
export class TravelGuidesService {
  private readonly logger = new Logger(TravelGuidesService.name);
  private readonly cache = new Map<string, CacheEntry<any>>();

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  private stripHtml(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private parseWikitext(wikitext: string): string {
    // Strip common wikitext markup for clean plain text
    return wikitext
      .replace(/\[\[(?:File|Image):[^\]]*\]\]/gi, '')
      .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
      .replace(/\[\[([^\]]*)\]\]/g, '$1')
      .replace(/\{\{[^}]*\}\}/g, '')
      .replace(/'{2,3}/g, '')
      .replace(/<ref[^>]*>.*?<\/ref>/gs, '')
      .replace(/<ref[^/]*\/>/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private async apiFetch(url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PartnerApp/1.0',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new InternalServerErrorException(
          `WikiVoyage API returned status ${response.status}`,
        );
      }

      return response.json();
    } catch (error) {
      if (
        error instanceof InternalServerErrorException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(`WikiVoyage fetch failed: ${error}`);
      throw new InternalServerErrorException(
        'Failed to contact WikiVoyage service',
      );
    }
  }

  async getFullGuide(destination: string): Promise<TravelGuide> {
    if (!destination || destination.trim().length === 0) {
      throw new BadRequestException('Destination parameter is required');
    }

    const cacheKey = `guide:${destination}`;
    const cached = this.getCached<TravelGuide>(cacheKey);
    if (cached) return cached;

    const encoded = encodeURIComponent(destination);
    const url =
      `${WIKIVOYAGE_API}?action=parse&page=${encoded}&format=json&prop=wikitext|sections`;

    this.logger.log(`Fetching full guide for: "${destination}"`);
    const data = await this.apiFetch(url);

    if (data.error) {
      if (data.error.code === 'missingtitle') {
        throw new NotFoundException(
          `No travel guide found for "${destination}"`,
        );
      }
      throw new InternalServerErrorException(data.error.info);
    }

    const parse = data.parse;
    const wikitext: string = parse.wikitext?.['*'] || '';
    const apiSections: any[] = parse.sections || [];

    // Split wikitext by section headers and parse each section
    const sections: GuideSection[] = [];

    // Add intro section (text before first header)
    const firstHeaderMatch = wikitext.match(/^==[^=]/m);
    if (firstHeaderMatch && firstHeaderMatch.index != null) {
      const introText = wikitext.substring(0, firstHeaderMatch.index);
      const parsed = this.parseWikitext(introText);
      if (parsed.length > 0) {
        sections.push({
          index: 0,
          title: 'Introduction',
          level: 1,
          content: parsed,
        });
      }
    }

    // Parse named sections
    for (const section of apiSections) {
      const level = parseInt(section.level, 10);
      const title = section.line || '';
      const sectionIndex = parseInt(section.index, 10);

      // Extract section content from wikitext using regex
      const headerPattern = new RegExp(
        `^${'='.repeat(level)}\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*${'='.repeat(level)}`,
        'm',
      );
      const headerMatch = wikitext.match(headerPattern);

      let content = '';
      if (headerMatch && headerMatch.index != null) {
        const startIdx = headerMatch.index + headerMatch[0].length;
        // Find next section of same or higher level
        const nextHeaderPattern = /^={2,3}\s*[^=]/m;
        const remaining = wikitext.substring(startIdx);
        const nextMatch = remaining.match(nextHeaderPattern);
        const endIdx = nextMatch?.index != null ? nextMatch.index : remaining.length;
        content = this.parseWikitext(remaining.substring(0, endIdx));
      }

      sections.push({
        index: sectionIndex,
        title: this.stripHtml(title),
        level,
        content,
      });
    }

    const result: TravelGuide = {
      destination,
      title: parse.title || destination,
      sections,
    };

    this.setCache(cacheKey, result);
    return result;
  }

  async getSummary(destination: string): Promise<GuideSummary> {
    if (!destination || destination.trim().length === 0) {
      throw new BadRequestException('Destination parameter is required');
    }

    const cacheKey = `summary:${destination}`;
    const cached = this.getCached<GuideSummary>(cacheKey);
    if (cached) return cached;

    const encoded = encodeURIComponent(destination);
    const url = `${WIKIVOYAGE_REST}/page/summary/${encoded}`;

    this.logger.log(`Fetching summary for: "${destination}"`);
    const data = await this.apiFetch(url);

    if (data.type === 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') {
      throw new NotFoundException(
        `No travel guide summary found for "${destination}"`,
      );
    }

    const result: GuideSummary = {
      destination,
      title: data.title || destination,
      description: data.extract || data.description || '',
      thumbnail: data.thumbnail?.source || undefined,
      coordinates: data.coordinates
        ? { lat: data.coordinates.lat, lng: data.coordinates.lon }
        : undefined,
    };

    this.setCache(cacheKey, result);
    return result;
  }

  async getSections(
    destination: string,
  ): Promise<{ destination: string; sections: { index: number; title: string; level: number }[] }> {
    if (!destination || destination.trim().length === 0) {
      throw new BadRequestException('Destination parameter is required');
    }

    const cacheKey = `sections:${destination}`;
    const cached = this.getCached<any>(cacheKey);
    if (cached) return cached;

    const encoded = encodeURIComponent(destination);
    const url =
      `${WIKIVOYAGE_API}?action=parse&page=${encoded}&format=json&prop=sections`;

    this.logger.log(`Fetching sections for: "${destination}"`);
    const data = await this.apiFetch(url);

    if (data.error) {
      if (data.error.code === 'missingtitle') {
        throw new NotFoundException(
          `No travel guide found for "${destination}"`,
        );
      }
      throw new InternalServerErrorException(data.error.info);
    }

    const sections = (data.parse?.sections || []).map((s: any) => ({
      index: parseInt(s.index, 10),
      title: this.stripHtml(s.line || ''),
      level: parseInt(s.level, 10),
    }));

    const result = { destination, sections };
    this.setCache(cacheKey, result);
    return result;
  }

  async searchGuides(
    query: string,
    limit = 10,
  ): Promise<{ results: SearchResult[] }> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Query parameter "q" is required');
    }

    const cacheKey = `search:${query}:${limit}`;
    const cached = this.getCached<{ results: SearchResult[] }>(cacheKey);
    if (cached) return cached;

    const url =
      `${WIKIVOYAGE_API}?action=opensearch&search=${encodeURIComponent(query)}` +
      `&limit=${limit}&namespace=0&format=json`;

    this.logger.log(`Searching guides for: "${query}"`);
    const data = await this.apiFetch(url);

    // OpenSearch returns [searchTerm, [titles], [descriptions], [urls]]
    const titles: string[] = data[1] || [];
    const descriptions: string[] = data[2] || [];
    const urls: string[] = data[3] || [];

    const results: SearchResult[] = titles.map((title, i) => ({
      title,
      description: descriptions[i] || undefined,
      url: urls[i] || `https://en.wikivoyage.org/wiki/${encodeURIComponent(title)}`,
    }));

    const result = { results };
    this.setCache(cacheKey, result);
    return result;
  }

  async getNearbyGuides(
    lat: number,
    lng: number,
    radius = 10000,
  ): Promise<{ results: NearbyResult[] }> {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Valid lat and lng parameters are required');
    }

    const cacheKey = `nearby:${lat}:${lng}:${radius}`;
    const cached = this.getCached<{ results: NearbyResult[] }>(cacheKey);
    if (cached) return cached;

    const url =
      `${WIKIVOYAGE_API}?action=query&list=geosearch` +
      `&gsradius=${radius}&gscoord=${lat}|${lng}&format=json`;

    this.logger.log(`Fetching nearby guides for: ${lat}, ${lng}`);
    const data = await this.apiFetch(url);

    const geoResults: any[] = data.query?.geosearch || [];

    const results: NearbyResult[] = geoResults.map((item: any) => ({
      title: item.title,
      lat: item.lat,
      lng: item.lon,
      distanceMeters: item.dist,
    }));

    const result = { results };
    this.setCache(cacheKey, result);
    return result;
  }
}
