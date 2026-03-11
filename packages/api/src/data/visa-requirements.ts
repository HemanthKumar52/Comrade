export interface VisaRequirement {
  requirement: 'visa_free' | 'visa_on_arrival' | 'evisa' | 'visa_required' | 'eta' | 'unknown';
  maxDays?: number;
  notes: string;
  processingTime?: string;
  officialLink?: string;
}

export const VISA_REQUIREMENTS: Record<string, VisaRequirement> = {
  // Indian passport holders
  'IN-US': { requirement: 'visa_required', maxDays: 180, notes: 'B1/B2 Visa. Apply at US Embassy. Interview required.', processingTime: '2-4 weeks', officialLink: 'https://travel.state.gov' },
  'IN-GB': { requirement: 'visa_required', maxDays: 180, notes: 'Standard Visitor Visa. Biometrics required.', processingTime: '3-6 weeks', officialLink: 'https://www.gov.uk/standard-visitor' },
  'IN-JP': { requirement: 'visa_required', maxDays: 90, notes: 'Tourist visa. Apply at Japanese Embassy/Consulate.', processingTime: '5-7 business days', officialLink: 'https://www.mofa.go.jp' },
  'IN-TH': { requirement: 'visa_on_arrival', maxDays: 30, notes: '15 days visa-free. 30 days with VOA (THB 2000).', processingTime: 'On arrival' },
  'IN-SG': { requirement: 'evisa', maxDays: 30, notes: 'Apply online through authorized travel agents.', processingTime: '3-5 days', officialLink: 'https://www.ica.gov.sg' },
  'IN-AE': { requirement: 'visa_on_arrival', maxDays: 14, notes: '14-day free visa on arrival for Indian passport holders.', processingTime: 'On arrival' },
  'IN-NP': { requirement: 'visa_free', notes: 'No visa required for Indian citizens. Carry valid ID.', officialLink: 'https://www.immigration.gov.np' },
  'IN-BT': { requirement: 'visa_free', notes: 'No visa required. Permit needed for some areas.', officialLink: 'https://www.tourism.gov.bt' },
  'IN-LK': { requirement: 'evisa', maxDays: 30, notes: 'Electronic Travel Authorization (ETA).', processingTime: '24-48 hours', officialLink: 'https://www.eta.gov.lk' },
  'IN-FR': { requirement: 'visa_required', maxDays: 90, notes: 'Schengen Visa. Valid for all Schengen countries.', processingTime: '15-45 days', officialLink: 'https://france-visas.gouv.fr' },
  'IN-DE': { requirement: 'visa_required', maxDays: 90, notes: 'Schengen Visa. Apply at German consulate.', processingTime: '10-15 days' },
  'IN-AU': { requirement: 'visa_required', maxDays: 90, notes: 'Visitor visa (subclass 600). Apply online.', processingTime: '20-30 days', officialLink: 'https://immi.homeaffairs.gov.au' },
  'IN-CA': { requirement: 'visa_required', maxDays: 180, notes: 'Temporary Resident Visa. Biometrics required.', processingTime: '3-4 weeks', officialLink: 'https://www.canada.ca/immigration' },
  'IN-MY': { requirement: 'evisa', maxDays: 30, notes: 'eVisa or eNTRI available online.', processingTime: '48 hours', officialLink: 'https://www.windowmalaysia.my' },
  'IN-ID': { requirement: 'visa_on_arrival', maxDays: 30, notes: 'Visa on Arrival (USD 35). Extendable once.', processingTime: 'On arrival' },
  'IN-KR': { requirement: 'visa_required', maxDays: 90, notes: 'Apply at Korean Embassy/Consulate.', processingTime: '5-7 days' },
  'IN-TR': { requirement: 'evisa', maxDays: 30, notes: 'e-Visa available online.', processingTime: '48 hours', officialLink: 'https://www.evisa.gov.tr' },
  'IN-VN': { requirement: 'evisa', maxDays: 30, notes: 'e-Visa available online.', processingTime: '3 business days', officialLink: 'https://evisa.xuatnhapcanh.gov.vn' },
  'IN-EG': { requirement: 'visa_on_arrival', maxDays: 30, notes: 'Visa on arrival available at airport (USD 25).', processingTime: 'On arrival' },
  'IN-KE': { requirement: 'evisa', maxDays: 90, notes: 'eVisa required. Apply online.', processingTime: '2-7 days', officialLink: 'https://evisa.go.ke' },

  // US passport holders
  'US-IN': { requirement: 'evisa', maxDays: 60, notes: 'e-Tourist Visa. Apply online.', processingTime: '3-5 days', officialLink: 'https://indianvisaonline.gov.in' },
  'US-GB': { requirement: 'visa_free', maxDays: 180, notes: 'No visa required for stays up to 6 months.' },
  'US-JP': { requirement: 'visa_free', maxDays: 90, notes: '90 days visa-free for US citizens.' },
  'US-FR': { requirement: 'visa_free', maxDays: 90, notes: 'Schengen zone - 90 days visa-free in any 180-day period.' },
  'US-DE': { requirement: 'visa_free', maxDays: 90, notes: 'Schengen zone - 90 days visa-free.' },
  'US-AU': { requirement: 'eta', maxDays: 90, notes: 'Electronic Travel Authority (ETA) required.', processingTime: 'Usually instant', officialLink: 'https://immi.homeaffairs.gov.au' },
  'US-TH': { requirement: 'visa_free', maxDays: 30, notes: '30 days visa-free for tourism.' },
  'US-SG': { requirement: 'visa_free', maxDays: 90, notes: '90 days visa-free.' },
  'US-KR': { requirement: 'visa_free', maxDays: 90, notes: '90 days visa-free. K-ETA may be required.' },
  'US-CA': { requirement: 'visa_free', maxDays: 180, notes: 'No visa required. Valid passport needed.' },
  'US-MX': { requirement: 'visa_free', maxDays: 180, notes: 'No visa required for tourism up to 180 days.' },
  'US-BR': { requirement: 'evisa', maxDays: 90, notes: 'e-Visa required since 2024.', processingTime: '5-10 days' },
  'US-TR': { requirement: 'evisa', maxDays: 90, notes: 'e-Visa required.', processingTime: '48 hours', officialLink: 'https://www.evisa.gov.tr' },

  // UK passport holders
  'GB-US': { requirement: 'eta', maxDays: 90, notes: 'ESTA required. Apply online.', processingTime: 'Usually within 72 hours', officialLink: 'https://esta.cbp.dhs.gov' },
  'GB-IN': { requirement: 'evisa', maxDays: 60, notes: 'e-Tourist Visa. Apply online.', processingTime: '3-5 days', officialLink: 'https://indianvisaonline.gov.in' },
  'GB-JP': { requirement: 'visa_free', maxDays: 90, notes: '90 days visa-free.' },
  'GB-FR': { requirement: 'visa_free', maxDays: 90, notes: 'Schengen zone - 90 days visa-free post-Brexit.' },
  'GB-AU': { requirement: 'eta', maxDays: 90, notes: 'Electronic Travel Authority required.', processingTime: 'Usually instant' },
  'GB-TH': { requirement: 'visa_free', maxDays: 30, notes: '30 days visa-free for tourism.' },
  'GB-SG': { requirement: 'visa_free', maxDays: 90, notes: '90 days visa-free.' },

  // Japanese passport holders
  'JP-US': { requirement: 'eta', maxDays: 90, notes: 'ESTA required.', processingTime: 'Usually within 72 hours' },
  'JP-IN': { requirement: 'evisa', maxDays: 60, notes: 'e-Tourist Visa.', processingTime: '3-5 days' },
  'JP-GB': { requirement: 'visa_free', maxDays: 180, notes: 'No visa required up to 6 months.' },
  'JP-FR': { requirement: 'visa_free', maxDays: 90, notes: 'Schengen zone - 90 days visa-free.' },
  'JP-TH': { requirement: 'visa_free', maxDays: 30, notes: '30 days visa-free.' },
  'JP-SG': { requirement: 'visa_free', maxDays: 90, notes: '90 days visa-free.' },
  'JP-KR': { requirement: 'visa_free', maxDays: 90, notes: '90 days visa-free.' },
};
