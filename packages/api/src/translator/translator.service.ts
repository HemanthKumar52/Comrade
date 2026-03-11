import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TranslatorService {
  private readonly libreTranslateUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.libreTranslateUrl =
      this.config.get<string>('LIBRE_TRANSLATE_URL') ||
      'http://localhost:5000';
  }

  async translate(
    text: string,
    source: string,
    target: string,
  ): Promise<{ translatedText: string }> {
    try {
      const res = await fetch(`${this.libreTranslateUrl}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source, target, format: 'text' }),
      });

      if (!res.ok) {
        throw new HttpException(
          'Translation service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const data = (await res.json()) as any;
      return { translatedText: data.translatedText };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Translation service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      const res = await fetch(`${this.libreTranslateUrl}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text }),
      });

      if (!res.ok) {
        throw new HttpException(
          'Detection service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const data = await res.json();
      const top = Array.isArray(data) ? data[0] : data;
      return { language: top.language, confidence: top.confidence };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Detection service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getLanguages() {
    try {
      const res = await fetch(`${this.libreTranslateUrl}/languages`);
      if (!res.ok) {
        return this.getFallbackLanguages();
      }
      return res.json();
    } catch {
      return this.getFallbackLanguages();
    }
  }

  async getLanguagePacks() {
    return this.prisma.languagePack.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getPhrasebook(lang: string, category?: string) {
    const where: any = { langCode: lang };
    if (category) {
      where.category = category;
    }

    return this.prisma.phrase.findMany({
      where,
      orderBy: { category: 'asc' },
    });
  }

  private getFallbackLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'it', name: 'Italian' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'bn', name: 'Bengali' },
      { code: 'tr', name: 'Turkish' },
      { code: 'nl', name: 'Dutch' },
      { code: 'pl', name: 'Polish' },
    ];
  }
}
