import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TravelGuidesService } from './travel-guides.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Travel Guides')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('travel-guides')
export class TravelGuidesController {
  constructor(private readonly travelGuidesService: TravelGuidesService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search WikiVoyage for travel guides' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max results (default 10)' })
  @ApiResponse({ status: 200, description: 'Array of matching travel guides' })
  @ApiResponse({ status: 400, description: 'Missing or invalid query' })
  async searchGuides(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.travelGuidesService.searchGuides(query, limit ? parseInt(limit, 10) : 10);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get travel guides for nearby destinations' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Search radius in meters (default 10000)' })
  @ApiResponse({ status: 200, description: 'Nearby destinations with guides' })
  @ApiResponse({ status: 400, description: 'Missing or invalid coordinates' })
  async getNearbyGuides(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.travelGuidesService.getNearbyGuides(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : 10000,
    );
  }

  @Get(':destination/summary')
  @ApiOperation({ summary: 'Get brief overview of a destination' })
  @ApiParam({ name: 'destination', type: String, description: 'Destination name (e.g. "Tokyo", "Paris")' })
  @ApiResponse({ status: 200, description: 'Summary with title, description, and optional thumbnail' })
  @ApiResponse({ status: 404, description: 'No guide found for destination' })
  async getSummary(@Param('destination') destination: string) {
    return this.travelGuidesService.getSummary(destination);
  }

  @Get(':destination/sections')
  @ApiOperation({ summary: 'List guide sections for a destination' })
  @ApiParam({ name: 'destination', type: String, description: 'Destination name' })
  @ApiResponse({ status: 200, description: 'List of section titles (Get in, See, Do, Eat, etc.)' })
  @ApiResponse({ status: 404, description: 'No guide found for destination' })
  async getSections(@Param('destination') destination: string) {
    return this.travelGuidesService.getSections(destination);
  }

  @Get(':destination')
  @ApiOperation({ summary: 'Get full travel guide for a destination' })
  @ApiParam({ name: 'destination', type: String, description: 'Destination name (e.g. "Tokyo", "Paris")' })
  @ApiResponse({ status: 200, description: 'Full guide with all sections and content' })
  @ApiResponse({ status: 404, description: 'No guide found for destination' })
  async getFullGuide(@Param('destination') destination: string) {
    return this.travelGuidesService.getFullGuide(destination);
  }
}
