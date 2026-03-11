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
import { CarbonService } from './carbon.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Carbon Footprint')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('carbon')
export class CarbonController {
  constructor(private readonly carbonService: CarbonService) {}

  @Get('trip/:tripId')
  @ApiOperation({ summary: 'Get carbon footprint for a specific trip' })
  @ApiResponse({ status: 200, description: 'Trip carbon footprint data' })
  async getTripCarbon(@Param('tripId') tripId: string) {
    return this.carbonService.calculateTripCarbon(tripId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get lifetime carbon footprint for a user' })
  @ApiResponse({ status: 200, description: 'User lifetime carbon data' })
  async getUserLifetimeCarbon(@Param('userId') userId: string) {
    return this.carbonService.getUserLifetimeCarbon(userId);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare carbon emissions between two vehicle types' })
  @ApiQuery({ name: 'vehicle1', required: true, description: 'First vehicle type' })
  @ApiQuery({ name: 'vehicle2', required: true, description: 'Second vehicle type' })
  @ApiQuery({ name: 'distance', required: true, description: 'Distance in km' })
  @ApiResponse({ status: 200, description: 'Side-by-side vehicle comparison' })
  async compareVehicles(
    @Query('vehicle1') vehicle1: string,
    @Query('vehicle2') vehicle2: string,
    @Query('distance') distance: string,
  ) {
    return this.carbonService.compareVehicles(vehicle1, vehicle2, parseFloat(distance));
  }

  @Get('offset/:tripId')
  @ApiOperation({ summary: 'Get carbon offset recommendations for a trip' })
  @ApiResponse({ status: 200, description: 'Offset recommendations' })
  async getOffsetRecommendations(@Param('tripId') tripId: string) {
    return this.carbonService.getOffsetRecommendations(tripId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get greenest travelers leaderboard' })
  @ApiResponse({ status: 200, description: 'Green leaderboard sorted by lowest carbon per km' })
  async getGreenLeaderboard() {
    return this.carbonService.getGreenLeaderboard();
  }
}
