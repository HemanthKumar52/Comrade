import type { POI } from './poi.js';

export interface AccessibilityProfile {
  wheelchairUser: boolean;
  visualImpairment: boolean;
  hearingImpairment: boolean;
  seniorMode: boolean;
  medicalConditions: string[];
}

export interface AccessiblePOI extends POI {
  wheelchairAccess: boolean;
  accessibleRestroom: boolean;
  brailleSignage: boolean;
  hearingLoop: boolean;
  accessibilityRating: number;
}
