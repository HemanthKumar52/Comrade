export interface EmergencyNumberSet {
  police: string;
  ambulance: string;
  fire: string;
  universal?: string;
  roadside?: string;
  coastGuard?: string;
  poisonControl?: string;
  touristPolice?: string;
  womenHelpline?: string;
  childHelpline?: string;
  notes?: string;
}

export const EMERGENCY_NUMBERS: Record<string, EmergencyNumberSet> = {
  IN: { police: '100', ambulance: '102', fire: '101', universal: '112', roadside: '1033', womenHelpline: '1091', childHelpline: '1098', touristPolice: '1363', notes: 'Dial 112 for integrated emergency response' },
  US: { police: '911', ambulance: '911', fire: '911', universal: '911', roadside: '911', poisonControl: '1-800-222-1222', coastGuard: '(202) 372-2100', notes: '911 is universal for all emergencies' },
  GB: { police: '999', ambulance: '999', fire: '999', universal: '112', coastGuard: '999', roadside: 'AA: 0800 887766', childHelpline: '0800 1111', notes: '112 also works from mobile phones' },
  AU: { police: '000', ambulance: '000', fire: '000', universal: '000', roadside: '13 11 11', poisonControl: '13 11 26', coastGuard: '000', notes: '112 works from mobiles' },
  JP: { police: '110', ambulance: '119', fire: '119', roadside: '#9910', coastGuard: '118', notes: 'Police and fire/ambulance have separate numbers' },
  FR: { police: '17', ambulance: '15', fire: '18', universal: '112', roadside: 'SAMU: 15', poisonControl: '01 40 05 48 48', notes: '112 is the EU-wide emergency number' },
  DE: { police: '110', ambulance: '112', fire: '112', universal: '112', roadside: 'ADAC: 0180 2222222', poisonControl: '030-19240', notes: '112 is the EU-wide emergency number' },
  IT: { police: '113', ambulance: '118', fire: '115', universal: '112', roadside: '116', coastGuard: '1530', notes: 'Carabinieri (military police): 112' },
  ES: { police: '091', ambulance: '061', fire: '080', universal: '112', roadside: '900 123 505', coastGuard: '900 202 202', notes: '112 is recommended for tourists' },
  CN: { police: '110', ambulance: '120', fire: '119', roadside: '122', notes: 'English-speaking operators may not be available' },
  KR: { police: '112', ambulance: '119', fire: '119', touristPolice: '1330', roadside: '1588-2504', notes: 'Tourist helpline 1330 has English support' },
  TH: { police: '191', ambulance: '1669', fire: '199', touristPolice: '1155', roadside: '1193', notes: 'Tourist police 1155 has English support' },
  SG: { police: '999', ambulance: '995', fire: '995', roadside: '1800 225 5582', notes: 'Non-emergency police: 1800-255-0000' },
  MY: { police: '999', ambulance: '999', fire: '994', universal: '112', roadside: '1800-88-0808', touristPolice: '03-2149 6590', notes: '999 is the main emergency number' },
  ID: { police: '110', ambulance: '118', fire: '113', universal: '112', touristPolice: '(021) 526-4073', notes: 'Search and rescue: 115' },
  BR: { police: '190', ambulance: '192', fire: '193', universal: '190', roadside: '194', notes: 'Military police: 190, Civil police: 197' },
  MX: { police: '911', ambulance: '911', fire: '911', universal: '911', roadside: '078', touristPolice: '078', notes: 'Green Angels (tourist roadside): 078' },
  AE: { police: '999', ambulance: '998', fire: '997', roadside: '800-4357', coastGuard: '999', notes: 'Abu Dhabi police: 999, Dubai police: 999' },
  SA: { police: '999', ambulance: '997', fire: '998', roadside: '993', notes: 'Traffic police: 993' },
  EG: { police: '122', ambulance: '123', fire: '180', touristPolice: '126', roadside: '01221110000', notes: 'Tourist police speak English' },
  ZA: { police: '10111', ambulance: '10177', fire: '10177', roadside: '0861 ASSIST', notes: 'From mobile: 112' },
  KE: { police: '999', ambulance: '999', fire: '999', universal: '112', notes: 'Red Cross: 1199' },
  NZ: { police: '111', ambulance: '111', fire: '111', universal: '111', coastGuard: '111', roadside: '*222', notes: '111 for all emergencies' },
  CA: { police: '911', ambulance: '911', fire: '911', universal: '911', roadside: '911', poisonControl: '1-800-222-1222', notes: '911 is universal for all emergencies' },
  RU: { police: '102', ambulance: '103', fire: '101', universal: '112', roadside: '112', notes: 'From mobile: 112' },
  TR: { police: '155', ambulance: '112', fire: '110', universal: '112', roadside: '159', touristPolice: '153', coastGuard: '158', notes: '112 from mobiles' },
  VN: { police: '113', ambulance: '115', fire: '114', roadside: '113', notes: 'English support limited outside major cities' },
  PH: { police: '117', ambulance: '911', fire: '911', universal: '911', roadside: '136', notes: '911 being rolled out nationwide' },
  NP: { police: '100', ambulance: '102', fire: '101', touristPolice: '1144', notes: 'Tourist police: 1144' },
  LK: { police: '119', ambulance: '110', fire: '111', universal: '112', touristPolice: '011-242-1052', notes: 'Accident service: 011-269-1111' },
  PT: { police: '112', ambulance: '112', fire: '112', universal: '112', roadside: '808 200 148', notes: '112 for all emergencies' },
  GR: { police: '100', ambulance: '166', fire: '199', universal: '112', coastGuard: '108', touristPolice: '1571', notes: '112 from mobiles' },
  CH: { police: '117', ambulance: '144', fire: '118', roadside: '140', poisonControl: '145', notes: 'REGA air rescue: 1414' },
  NL: { police: '112', ambulance: '112', fire: '112', universal: '112', roadside: '0800-0888', notes: '112 for all emergencies, 0900-8844 non-emergency police' },
  SE: { police: '112', ambulance: '112', fire: '112', universal: '112', roadside: '020-912 912', poisonControl: '010-456 6700', notes: '112 for all emergencies, 11414 non-emergency police' },
  NO: { police: '112', ambulance: '113', fire: '110', roadside: 'Viking: 06000', notes: '112 for police, 113 ambulance, 110 fire' },
  AT: { police: '133', ambulance: '144', fire: '122', universal: '112', roadside: '120', notes: '112 EU-wide emergency' },
  BT: { police: '113', ambulance: '112', fire: '110', notes: 'Limited emergency services outside Thimphu' },
};
