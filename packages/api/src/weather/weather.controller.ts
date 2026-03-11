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
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Weather')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current weather for coordinates' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Current weather data' })
  async getCurrentWeather(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lng));
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get weather forecast for coordinates' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of forecast days (default 5)' })
  @ApiResponse({ status: 200, description: 'Weather forecast data' })
  async getForecast(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('days') days?: string,
  ) {
    return this.weatherService.getForecast(
      parseFloat(lat),
      parseFloat(lng),
      days ? parseInt(days, 10) : 5,
    );
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get weather alerts for coordinates' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Active weather alerts' })
  async getAlerts(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.weatherService.getAlerts(parseFloat(lat), parseFloat(lng));
  }

  @Get('best-time/:country')
  @ApiOperation({ summary: 'Get best time to visit a country' })
  @ApiParam({ name: 'country', description: 'ISO country code (e.g., IN, US, JP)' })
  @ApiResponse({ status: 200, description: 'Best time to visit data' })
  async getBestTimeToVisit(@Param('country') country: string) {
    return this.weatherService.getBestTimeToVisit(country);
  }

  @Get('climate/:country')
  @ApiOperation({ summary: 'Get climate data for a country' })
  @ApiParam({ name: 'country', description: 'ISO country code (e.g., IN, US, JP)' })
  @ApiResponse({ status: 200, description: 'Climate zone and temperature data' })
  async getClimate(@Param('country') country: string) {
    return this.weatherService.getClimate(country);
  }
}
