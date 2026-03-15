export interface CountryInfo {
  name: string;
  officialName: string;
  code: string;
  cca3: string;
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  area: number;
  flag: string;
  flagSvg: string;
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
  timezones: string[];
  callingCodes: string[];
  drivingSide: 'left' | 'right';
  borders: string[];
  latlng: [number, number];
  landlocked: boolean;
  unMember: boolean;
  startOfWeek: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
}

export interface CountryComparison {
  countries: CountryInfo[];
  fields: string[];
}
