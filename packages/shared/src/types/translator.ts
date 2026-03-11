export type TranslationMode = 'camera' | 'voice' | 'text' | 'phrasebook';

export interface TranslationRequest {
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  mode: TranslationMode;
}

export interface TranslationResponse {
  translatedText: string;
  transliteration: string | null;
  sourceLang: string;
  targetLang: string;
  confidence: number;
}

export interface LanguagePack {
  langCode: string;
  name: string;
  sizeBytes: number;
  downloaded: boolean;
  lastUpdated: Date;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  transliteration: string | null;
  audioUrl: string | null;
  category: string;
}
