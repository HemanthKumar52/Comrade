import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GeocodingService } from './geocoding.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Geocoding')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for places by name (forward geocoding)' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Place name to search' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max results (default 5)' })
  @ApiResponse({ status: 200, description: 'Array of matching places with coordinates' })
  @ApiResponse({ status: 400, description: 'Missing or invalid query' })
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.geocodingService.search(query, limit ? parseInt(limit, 10) : 5);
  }

  @Get('reverse')
  @ApiOperation({ summary: 'Get address from coordinates (reverse geocoding)' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Address details for the given coordinates' })
  @ApiResponse({ status: 400, description: 'Missing or invalid coordinates' })
  async reverse(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.geocodingService.reverse(parseFloat(lat), parseFloat(lng));
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Place autocomplete for search bars' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Partial place name' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max results (default 5)' })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions' })
  @ApiResponse({ status: 400, description: 'Missing or invalid query' })
  async autocomplete(
    @Query('q') partial: string,
    @Query('limit') limit?: string,
  ) {
    return this.geocodingService.autocomplete(partial, limit ? parseInt(limit, 10) : 5);
  }

  @Get('timezone')
  @ApiOperation({ summary: 'Get timezone for coordinates' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Timezone information for the given coordinates' })
  @ApiResponse({ status: 400, description: 'Missing or invalid coordinates' })
  async timezone(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.geocodingService.timezone(parseFloat(lat), parseFloat(lng));
  }
}
