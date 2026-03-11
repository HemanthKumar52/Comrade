import { Injectable, NotFoundException } from '@nestjs/common';
import { TRAFFIC_RULES, getTrafficRules, getDrivingSide } from '../data/traffic-rules';

@Injectable()
export class TrafficService {
  getRules(countryCode: string) {
    const rules = getTrafficRules(countryCode);
    if (!rules) {
      throw new NotFoundException(
        `Traffic rules not found for country: ${countryCode}`,
      );
    }
    return {
      country: countryCode,
      ...rules,
    };
  }

  getDrivingSide(countryCode: string) {
    const rules = getTrafficRules(countryCode);
    if (!rules) {
      throw new NotFoundException(
        `Traffic rules not found for country: ${countryCode}`,
      );
    }
    return {
      country: countryCode,
      drivingSide: rules.drivingSide,
      description:
        rules.drivingSide === 'left'
          ? 'Drive on the LEFT side of the road. Steering wheel is on the right.'
          : 'Drive on the RIGHT side of the road. Steering wheel is on the left.',
    };
  }

  getSpeedLimits(countryCode: string) {
    const rules = getTrafficRules(countryCode);
    if (!rules) {
      throw new NotFoundException(
        `Speed limit data not found for country: ${countryCode}`,
      );
    }
    return {
      country: countryCode,
      speedLimits: rules.speedLimits,
      unit: rules.speedLimits.unit === 'kmh' ? 'km/h' : 'mph',
    };
  }

  getLicenseInfo(countryCode: string, homeCountry?: string) {
    const rules = getTrafficRules(countryCode);
    if (!rules) {
      throw new NotFoundException(
        `License info not found for country: ${countryCode}`,
      );
    }

    const info: Record<string, any> = {
      country: countryCode,
      minimumDrivingAge: rules.minimumAge,
      idpRequired: rules.idpRequired,
      recommendation: rules.idpRequired
        ? 'An International Driving Permit (IDP) is required. Obtain one from your home country before traveling.'
        : 'An IDP is not strictly required, but carrying one is recommended as it serves as a translated license.',
    };

    if (homeCountry) {
      info.homeCountry = homeCountry;
      if (countryCode === homeCountry) {
        info.note = 'You are driving in your home country. Your domestic license is valid.';
      } else if (rules.idpRequired) {
        info.note = `Drivers from ${homeCountry} need an International Driving Permit (IDP) to drive in ${countryCode}. Carry both your IDP and original license.`;
      } else {
        info.note = `Drivers from ${homeCountry} can typically use their home license in ${countryCode}, but an IDP is recommended for convenience.`;
      }
    }

    return info;
  }

  getFines(countryCode: string) {
    const rules = getTrafficRules(countryCode);
    if (!rules) {
      throw new NotFoundException(
        `Traffic fines data not found for country: ${countryCode}`,
      );
    }
    return {
      country: countryCode,
      alcoholLimit: rules.alcoholLimit,
      seatbeltLaw: rules.seatbeltLaw,
      mobilePhoneBan: rules.mobilePhoneBan,
      commonFines: rules.commonFines,
      uniqueRules: rules.uniqueRules,
    };
  }
}
