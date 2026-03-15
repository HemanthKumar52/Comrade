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
  @ApiOperation({ summary: 'Get current weather for coordinates (Open-Meteo)' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Current weather data from Open-Meteo' })
  async getCurrentWeather(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lng));
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get multi-day weather forecast (Open-Meteo)' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of forecast days (1-16, default 7)' })
  @ApiResponse({ status: 200, description: 'Multi-day weather forecast data' })
  async getForecast(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('days') days?: string,
  ) {
    return this.weatherService.getForecast(
      parseFloat(lat),
      parseFloat(lng),
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get('air-quality')
  @ApiOperation({ summary: 'Get air quality index for coordinates (Open-Meteo)' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Air quality data with US AQI and pollutant levels' })
  async getAirQuality(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.weatherService.getAirQuality(parseFloat(lat), parseFloat(lng));
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get weather alerts for coordinates (derived from current conditions)' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Active weather alerts derived from Open-Meteo data' })
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
