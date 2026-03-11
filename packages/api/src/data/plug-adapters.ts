export interface PlugAdapterInfo {
  plugTypes: string[];
  voltage: string;
  frequency: string;
  notes?: string;
}

export const PLUG_ADAPTERS: Record<string, PlugAdapterInfo> = {
  US: { plugTypes: ['A', 'B'], voltage: '120V', frequency: '60Hz', notes: 'Standard NEMA 1-15/5-15 plugs' },
  GB: { plugTypes: ['G'], voltage: '230V', frequency: '50Hz', notes: 'British Standard BS 1363' },
  IN: { plugTypes: ['C', 'D', 'M'], voltage: '230V', frequency: '50Hz', notes: 'Type D (old British) still common, Type M for heavy appliances' },
  JP: { plugTypes: ['A', 'B'], voltage: '100V', frequency: '50/60Hz', notes: '50Hz in eastern Japan, 60Hz in western. Lowest voltage worldwide.' },
  FR: { plugTypes: ['C', 'E'], voltage: '230V', frequency: '50Hz', notes: 'Type E has grounding pin in socket' },
  DE: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz', notes: 'Type F (Schuko) has grounding clips' },
  AU: { plugTypes: ['I'], voltage: '230V', frequency: '50Hz', notes: 'Angled flat blade design' },
  CN: { plugTypes: ['A', 'C', 'I'], voltage: '220V', frequency: '50Hz', notes: 'Multi-standard sockets common in hotels' },
  SG: { plugTypes: ['G'], voltage: '230V', frequency: '50Hz', notes: 'Same as UK standard' },
  TH: { plugTypes: ['A', 'B', 'C'], voltage: '220V', frequency: '50Hz', notes: 'Mixed plug types, universal sockets common' },
  KR: { plugTypes: ['C', 'F'], voltage: '220V', frequency: '60Hz', notes: 'Type F (Schuko) is standard' },
  IT: { plugTypes: ['C', 'F', 'L'], voltage: '230V', frequency: '50Hz', notes: 'Type L is unique to Italy, 10A and 16A variants' },
  ES: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  BR: { plugTypes: ['C', 'N'], voltage: '127/220V', frequency: '60Hz', notes: 'Voltage varies by city. Type N is standard since 2011.' },
  AE: { plugTypes: ['G'], voltage: '220V', frequency: '50Hz', notes: 'UK-style plugs' },
  SA: { plugTypes: ['A', 'B', 'G'], voltage: '220V', frequency: '60Hz', notes: 'Mixed plug types in use' },
  NZ: { plugTypes: ['I'], voltage: '230V', frequency: '50Hz', notes: 'Same as Australia' },
  CA: { plugTypes: ['A', 'B'], voltage: '120V', frequency: '60Hz', notes: 'Same as US standard' },
  MX: { plugTypes: ['A', 'B'], voltage: '127V', frequency: '60Hz', notes: 'Same plug types as US' },
  TR: { plugTypes: ['C', 'F'], voltage: '220V', frequency: '50Hz' },
  NP: { plugTypes: ['C', 'D', 'M'], voltage: '230V', frequency: '50Hz', notes: 'Same as India. Power cuts common, carry a power bank.' },
  LK: { plugTypes: ['D', 'G'], voltage: '230V', frequency: '50Hz', notes: 'UK and Indian style plugs both used' },
  VN: { plugTypes: ['A', 'C'], voltage: '220V', frequency: '50Hz', notes: 'Mixed plug types' },
  ID: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  MY: { plugTypes: ['G'], voltage: '240V', frequency: '50Hz', notes: 'UK-style plugs' },
  PH: { plugTypes: ['A', 'B', 'C'], voltage: '220V', frequency: '60Hz', notes: 'Universal sockets common in hotels' },
  EG: { plugTypes: ['C', 'F'], voltage: '220V', frequency: '50Hz' },
  ZA: { plugTypes: ['C', 'D', 'M', 'N'], voltage: '230V', frequency: '50Hz', notes: 'Type M (large 3-pin) is most common' },
  KE: { plugTypes: ['G'], voltage: '240V', frequency: '50Hz', notes: 'UK-style plugs' },
  RU: { plugTypes: ['C', 'F'], voltage: '220V', frequency: '50Hz' },
  PT: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  GR: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  CH: { plugTypes: ['C', 'J'], voltage: '230V', frequency: '50Hz', notes: 'Type J is unique to Switzerland. Type C works for 2-pin devices.' },
  NL: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  SE: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  NO: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  AT: { plugTypes: ['C', 'F'], voltage: '230V', frequency: '50Hz' },
  BT: { plugTypes: ['C', 'D', 'F', 'G'], voltage: '230V', frequency: '50Hz', notes: 'Mixed plug types due to Indian and European influences' },
};

/**
 * Determine which adapter a traveler needs.
 */
export function getAdapterRecommendation(fromCountry: string, toCountry: string): string | null {
  const from = PLUG_ADAPTERS[fromCountry.toUpperCase()];
  const to = PLUG_ADAPTERS[toCountry.toUpperCase()];
  if (!from || !to) return null;

  const fromSet = new Set(from.plugTypes);
  const toSet = new Set(to.plugTypes);
  const compatible = [...fromSet].some((t) => toSet.has(t));

  if (compatible) {
    return 'Your plugs are compatible. No adapter needed (check voltage if using non-dual-voltage devices).';
  }

  return `You need an adapter from Type ${from.plugTypes.join('/')} to Type ${to.plugTypes.join('/')}. Consider a universal travel adapter.`;
}
