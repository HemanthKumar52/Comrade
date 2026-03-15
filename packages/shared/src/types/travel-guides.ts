export interface TravelGuide {
  title: string;
  description: string;
  thumbnail?: string;
  sections: GuideSection[];
  quickFacts?: QuickFacts;
}

export interface GuideSection {
  title: string;
  content: string;
  level: number;
}

export interface QuickFacts {
  language?: string;
  currency?: string;
  timezone?: string;
  emergencyNumber?: string;
  electricPlug?: string;
  drivingSide?: string;
}

export interface GuideSearchResult {
  title: string;
  description: string;
  pageid: number;
}
