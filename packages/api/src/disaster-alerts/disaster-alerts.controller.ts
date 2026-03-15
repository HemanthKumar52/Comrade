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
  ApiParam,
} from '@nestjs/swagger';
import { DisasterAlertsService } from './disaster-alerts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Disaster Alerts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('disaster-alerts')
export class DisasterAlertsController {
  constructor(private readonly disasterAlertsService: DisasterAlertsService) {}

  @Get('earthquakes')
  @ApiOperation({ summary: 'Recent earthquakes worldwide' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default 7)', example: 7 })
  @ApiQuery({ name: 'minMagnitude', required: false, type: Number, description: 'Minimum magnitude (default 4)', example: 4 })
  @ApiResponse({ status: 200, description: 'List of recent earthquakes' })
  async getEarthquakes(
    @Query('days') days?: string,
    @Query('minMagnitude') minMagnitude?: string,
  ) {
    return this.disasterAlertsService.getEarthquakes(
      days ? parseInt(days, 10) : 7,
      minMagnitude ? parseFloat(minMagnitude) : 4,
    );
  }

  @Get('near')
  @ApiOperation({ summary: 'Disasters near a specific location' })
  @ApiQuery({ name: 'lat', required: true, type: Number, example: 35.6762 })
  @ApiQuery({ name: 'lng', required: true, type: Number, example: 139.6503 })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km (default 500)', example: 500 })
  @ApiResponse({ status: 200, description: 'List of disasters near location' })
  async getDisastersNear(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.disasterAlertsService.getDisastersNear(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 500,
    );
  }

  @Get('country/:countryCode')
  @ApiOperation({ summary: 'Active disaster alerts for a country' })
  @ApiParam({ name: 'countryCode', description: 'ISO 3166-1 alpha-2 country code', example: 'JP' })
  @ApiResponse({ status: 200, description: 'List of active alerts for the country' })
  async getAlertsByCountry(@Param('countryCode') countryCode: string) {
    return this.disasterAlertsService.getAlertsByCountry(countryCode);
  }

  @Get('active')
  @ApiOperation({ summary: 'All currently active disaster alerts worldwide' })
  @ApiResponse({ status: 200, description: 'List of all active disaster alerts' })
  async getActiveAlerts() {
    return this.disasterAlertsService.getActiveAlerts();
  }

  @Get('safety-check/:tripId')
  @ApiOperation({ summary: 'Check if trip destinations have active disaster alerts' })
  @ApiParam({ name: 'tripId', description: 'Trip ID to check', example: 'clx...' })
  @ApiResponse({ status: 200, description: 'Safety status for trip destinations' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async safetyCheckForTrip(@Param('tripId') tripId: string) {
    return this.disasterAlertsService.safetyCheckForTrip(tripId);
  }
}
