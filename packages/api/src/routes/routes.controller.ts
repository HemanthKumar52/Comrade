import {
  Controller,
  Get,
  Post,
  Param,
  Body,
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
import { RoutesService } from './routes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Routes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate route between two points via OSRM' })
  @ApiResponse({ status: 200, description: 'Route geometry, distance, duration, steps' })
  async calculateRoute(
    @Body()
    body: {
      sourceCoords: { lat: number; lng: number };
      destCoords: { lat: number; lng: number };
      profile: 'driving' | 'walking' | 'cycling';
    },
  ) {
    return this.routesService.calculateRoute(body);
  }

  @Get('alternatives')
  @ApiOperation({ summary: 'Get up to 5 alternative routes' })
  @ApiQuery({ name: 'sourceLat', required: true, type: Number })
  @ApiQuery({ name: 'sourceLng', required: true, type: Number })
  @ApiQuery({ name: 'destLat', required: true, type: Number })
  @ApiQuery({ name: 'destLng', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Array of alternative routes' })
  async getAlternatives(
    @Query('sourceLat') sourceLat: string,
    @Query('sourceLng') sourceLng: string,
    @Query('destLat') destLat: string,
    @Query('destLng') destLng: string,
  ) {
    return this.routesService.getAlternativeRoutes(
      parseFloat(sourceLat),
      parseFloat(sourceLng),
      parseFloat(destLat),
      parseFloat(destLng),
    );
  }

  @Post(':tripId/log')
  @ApiOperation({ summary: 'Save route log for a trip' })
  @ApiResponse({ status: 201, description: 'Route log saved' })
  async saveRouteLog(
    @Param('tripId') tripId: string,
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      coordinates: Array<{ lat: number; lng: number }>;
      distanceKm: number;
      vehicleType?: string;
    },
  ) {
    return this.routesService.saveRouteLog(tripId, user.sub, body);
  }
}
