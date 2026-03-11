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
  ApiQuery,
} from '@nestjs/swagger';
import { SafetyScoreService } from './safety-score.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Safety Score')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('safety-score')
export class SafetyScoreController {
  constructor(private readonly safetyScoreService: SafetyScoreService) {}

  @Get(':country')
  @ApiOperation({ summary: 'Get overall safety score for a country' })
  @ApiResponse({ status: 200, description: 'Country safety score' })
  async getCountrySafety(@Param('country') country: string) {
    return this.safetyScoreService.getCountrySafety(country);
  }

  @Get(':country/:city')
  @ApiOperation({ summary: 'Get city-level safety score' })
  @ApiResponse({ status: 200, description: 'City safety score' })
  async getCitySafety(
    @Param('country') country: string,
    @Param('city') city: string,
  ) {
    return this.safetyScoreService.getCitySafety(country, city);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare safety scores across countries' })
  @ApiQuery({ name: 'countries', required: true, description: 'Comma-separated country codes (e.g., IN,TH,JP)' })
  @ApiResponse({ status: 200, description: 'Country safety comparison' })
  async compareCountries(@Query('countries') countries: string) {
    const codes = countries.split(',').map((c) => c.trim().toUpperCase());
    return this.safetyScoreService.compareCountries(codes);
  }

  @Get('solo-female/:country')
  @ApiOperation({ summary: 'Get solo female traveler safety score' })
  @ApiResponse({ status: 200, description: 'Solo female safety data' })
  async getSoloFemaleSafety(@Param('country') country: string) {
    return this.safetyScoreService.getSoloFemaleSafety(country);
  }

  @Get('lgbtq/:country')
  @ApiOperation({ summary: 'Get LGBTQ+ safety score for a country' })
  @ApiResponse({ status: 200, description: 'LGBTQ+ safety data' })
  async getLgbtqSafety(@Param('country') country: string) {
    return this.safetyScoreService.getLgbtqSafety(country);
  }

  @Get('night/:country')
  @ApiOperation({ summary: 'Get nighttime safety score for a country' })
  @ApiResponse({ status: 200, description: 'Nighttime safety data' })
  async getNightSafety(@Param('country') country: string) {
    return this.safetyScoreService.getNightSafety(country);
  }
}
