import type { GeoPoint } from './map.js';

export type NoteType = 'text' | 'voice' | 'photo' | 'plan';

export interface Note {
  id: string;
  userId: string;
  tripId: string | null;
  type: NoteType;
  title: string;
  content: string;
  audioUrl: string | null;
  photoUrls: string[];
  geoPoint: GeoPoint | null;
  tags: string[];
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFolder {
  id: string;
  userId: string;
  name: string;
  tripId: string | null;
}
