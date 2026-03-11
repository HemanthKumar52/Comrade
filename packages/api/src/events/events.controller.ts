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
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Events & Experiences')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get nearby events' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Nearby events' })
  async getNearbyEvents(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.eventsService.getNearbyEvents(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 50,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Get('festivals')
  @ApiOperation({ summary: 'Get festivals for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'IN' })
  @ApiQuery({ name: 'month', required: false, type: Number, example: 3 })
  @ApiResponse({ status: 200, description: 'Festivals list' })
  async getFestivals(
    @Query('country') country: string,
    @Query('month') month?: string,
  ) {
    return this.eventsService.getFestivals(
      country,
      month ? parseInt(month, 10) : undefined,
    );
  }

  @Get('sun-times')
  @ApiOperation({ summary: 'Get sunrise/sunset/golden hour times' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'date', required: true, example: '2025-03-15' })
  @ApiResponse({ status: 200, description: 'Sun times' })
  async getSunTimes(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('date') date: string,
  ) {
    return this.eventsService.getSunTimes(
      parseFloat(lat),
      parseFloat(lng),
      new Date(date),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event detail' })
  @ApiResponse({ status: 200, description: 'Event detail' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEvent(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }
}
