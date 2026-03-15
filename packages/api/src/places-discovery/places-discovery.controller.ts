import {
  Controller,
  Get,
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
import { PlacesDiscoveryService } from './places-discovery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Places Discovery')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('places-discovery')
export class PlacesDiscoveryController {
  constructor(private readonly placesDiscoveryService: PlacesDiscoveryService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Discover nearby places by category' })
  @ApiQuery({ name: 'lat', required: true, type: Number, example: 48.8566 })
  @ApiQuery({ name: 'lng', required: true, type: Number, example: 2.3522 })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in meters (default 5000)', example: 5000 })
  @ApiQuery({ name: 'category', required: false, description: 'Category filter (e.g. tourism, museum, restaurant)', example: 'tourism' })
  @ApiResponse({ status: 200, description: 'List of nearby places' })
  async findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('category') category?: string,
  ) {
    return this.placesDiscoveryService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : 5000,
      category,
    );
  }

  @Get('landmarks')
  @ApiOperation({ summary: 'Famous landmarks near a location' })
  @ApiQuery({ name: 'lat', required: true, type: Number, example: 48.8566 })
  @ApiQuery({ name: 'lng', required: true, type: Number, example: 2.3522 })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in meters (default 10000)', example: 10000 })
  @ApiResponse({ status: 200, description: 'List of famous landmarks' })
  async findLandmarks(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.placesDiscoveryService.findLandmarks(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : 10000,
    );
  }

  @Get('hidden-gems')
  @ApiOperation({ summary: 'Lesser-known attractions (artwork, viewpoints, historic sites)' })
  @ApiQuery({ name: 'lat', required: true, type: Number, example: 48.8566 })
  @ApiQuery({ name: 'lng', required: true, type: Number, example: 2.3522 })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in meters (default 5000)', example: 5000 })
  @ApiResponse({ status: 200, description: 'List of hidden gem places' })
  async findHiddenGems(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.placesDiscoveryService.findHiddenGems(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : 5000,
    );
  }

  @Get('photo-spots')
  @ApiOperation({ summary: 'Scenic viewpoints and photography spots' })
  @ApiQuery({ name: 'lat', required: true, type: Number, example: 48.8566 })
  @ApiQuery({ name: 'lng', required: true, type: Number, example: 2.3522 })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in meters (default 5000)', example: 5000 })
  @ApiResponse({ status: 200, description: 'List of photo-worthy spots' })
  async findPhotoSpots(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.placesDiscoveryService.findPhotoSpots(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : 5000,
    );
  }

  @Get('free-activities')
  @ApiOperation({ summary: 'Free things to do (parks, beaches, viewpoints, markets)' })
  @ApiQuery({ name: 'lat', required: true, type: Number, example: 48.8566 })
  @ApiQuery({ name: 'lng', required: true, type: Number, example: 2.3522 })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in meters (default 5000)', example: 5000 })
  @ApiResponse({ status: 200, description: 'List of free activities and places' })
  async findFreeActivities(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.placesDiscoveryService.findFreeActivities(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : 5000,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all searchable place categories' })
  @ApiResponse({ status: 200, description: 'Array of category objects' })
  async getCategories() {
    return this.placesDiscoveryService.getCategories();
  }
}
