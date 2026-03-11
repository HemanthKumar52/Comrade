import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TravelStatsService } from './travel-stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Travel Stats')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class TravelStatsController {
  constructor(private readonly statsService: TravelStatsService) {}

  @Get('overview/:userId')
  @ApiOperation({ summary: 'Get travel overview stats for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Travel overview statistics' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getOverview(@Param('userId') userId: string) {
    return this.statsService.getOverview(userId);
  }

  @Get('heatmap/:userId')
  @ApiOperation({ summary: 'Get travel heatmap data for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Heatmap coordinates with intensity' })
  async getHeatmap(@Param('userId') userId: string) {
    return this.statsService.getHeatmap(userId);
  }

  @Get('timeline/:userId')
  @ApiOperation({ summary: 'Get travel timeline for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Interleaved trips and badges timeline' })
  async getTimeline(@Param('userId') userId: string) {
    return this.statsService.getTimeline(userId);
  }

  @Get('wrapped/:userId/:year')
  @ApiOperation({ summary: 'Get annual travel wrapped summary' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiParam({ name: 'year', description: 'Year (e.g., 2025)' })
  @ApiResponse({ status: 200, description: 'Annual travel summary' })
  async getWrapped(
    @Param('userId') userId: string,
    @Param('year') year: string,
  ) {
    return this.statsService.getWrapped(userId, parseInt(year, 10));
  }
}
