import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TrafficService } from './traffic.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Traffic Rules')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get('rules/:country')
  @ApiOperation({ summary: 'Get full traffic rules for a country' })
  @ApiParam({ name: 'country', description: 'ISO country code (e.g., IN, US, JP)' })
  @ApiResponse({ status: 200, description: 'Traffic rules for the country' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getRules(@Param('country') country: string) {
    return this.trafficService.getRules(country.toUpperCase());
  }

  @Get('driving-side/:country')
  @ApiOperation({ summary: 'Get driving side for a country' })
  @ApiParam({ name: 'country', description: 'ISO country code' })
  @ApiResponse({ status: 200, description: 'Driving side (left or right)' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getDrivingSide(@Param('country') country: string) {
    return this.trafficService.getDrivingSide(country.toUpperCase());
  }

  @Get('speed-limits/:country')
  @ApiOperation({ summary: 'Get speed limits for a country' })
  @ApiParam({ name: 'country', description: 'ISO country code' })
  @ApiResponse({ status: 200, description: 'Speed limits by road type' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getSpeedLimits(@Param('country') country: string) {
    return this.trafficService.getSpeedLimits(country.toUpperCase());
  }

  @Get('license/:country')
  @ApiOperation({ summary: 'Get license/IDP requirements for driving in a country' })
  @ApiParam({ name: 'country', description: 'ISO country code' })
  @ApiQuery({ name: 'homeCountry', required: false, description: 'Your home country ISO code (e.g., IN)' })
  @ApiResponse({ status: 200, description: 'License requirements' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getLicenseInfo(
    @Param('country') country: string,
    @Query('homeCountry') homeCountry?: string,
  ) {
    return this.trafficService.getLicenseInfo(
      country.toUpperCase(),
      homeCountry?.toUpperCase(),
    );
  }

  @Get('fines/:country')
  @ApiOperation({ summary: 'Get common traffic fines for a country' })
  @ApiParam({ name: 'country', description: 'ISO country code' })
  @ApiResponse({ status: 200, description: 'Common fines and penalties' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getFines(@Param('country') country: string) {
    return this.trafficService.getFines(country.toUpperCase());
  }
}
