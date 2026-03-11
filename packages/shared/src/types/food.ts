export interface DietaryProfile {
  vegetarian: boolean;
  vegan: boolean;
  halal: boolean;
  kosher: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutAllergy: boolean;
  shellfishAllergy: boolean;
}

export interface LocalDish {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  photo: string | null;
  flavorProfile: string[];
  mustTryScore: number;
  averagePrice: number;
}

export type WaterSafety = 'safe' | 'boil' | 'bottled_only';
