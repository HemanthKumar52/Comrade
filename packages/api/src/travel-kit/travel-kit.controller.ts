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
import { TravelKitService } from './travel-kit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Travel Kit')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('travel-kit')
export class TravelKitController {
  constructor(private readonly travelKitService: TravelKitService) {}

  @Get('country/:code')
  @ApiOperation({ summary: 'Get full country info' })
  @ApiParam({ name: 'code', example: 'IN', description: 'ISO 3166-1 alpha-2 country code' })
  @ApiResponse({ status: 200, description: 'Full country information' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  getCountryInfo(@Param('code') code: string) {
    return this.travelKitService.getCountryInfo(code);
  }

  @Get('visa')
  @ApiOperation({ summary: 'Get visa requirement' })
  @ApiQuery({ name: 'passport', required: true, example: 'IN' })
  @ApiQuery({ name: 'destination', required: true, example: 'FR' })
  @ApiResponse({ status: 200, description: 'Visa requirement details' })
  getVisa(
    @Query('passport') passport: string,
    @Query('destination') destination: string,
  ) {
    return this.travelKitService.getVisaRequirement(passport, destination);
  }

  @Get('plug-adapter')
  @ApiOperation({ summary: 'Get plug type and voltage info' })
  @ApiQuery({ name: 'country', required: true, example: 'FR' })
  @ApiQuery({ name: 'from', required: false, example: 'IN', description: 'Your home country for adapter recommendation' })
  @ApiResponse({ status: 200, description: 'Plug adapter information' })
  getPlug(
    @Query('country') country: string,
    @Query('from') fromCountry?: string,
  ) {
    return this.travelKitService.getPlugAdapter(country, fromCountry);
  }

  @Get('timezone/compare')
  @ApiOperation({ summary: 'Compare timezones between two countries' })
  @ApiQuery({ name: 'from', required: true, example: 'IN' })
  @ApiQuery({ name: 'to', required: true, example: 'JP' })
  @ApiResponse({ status: 200, description: 'Timezone comparison with local times' })
  getTimezoneComparison(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.travelKitService.getTimezoneComparison(from, to);
  }

  @Get('timezone/current')
  @ApiOperation({ summary: 'Get current time in a country' })
  @ApiQuery({ name: 'country', required: true, example: 'IN' })
  @ApiResponse({ status: 200, description: 'Current time in country timezones' })
  getTimezone(@Query('country') country: string) {
    return this.travelKitService.getTimezoneInfo(country);
  }

  @Get('timezone')
  @ApiOperation({ summary: 'Get timezone info between two zones (legacy)' })
  @ApiQuery({ name: 'from', required: true, example: 'Asia/Kolkata' })
  @ApiQuery({ name: 'to', required: true, example: 'Europe/Paris' })
  @ApiResponse({ status: 200, description: 'Jet lag estimate between timezones' })
  getTimezoneOld(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.travelKitService.getJetLagEstimate(from, to);
  }

  @Get('laws/:country')
  @ApiOperation({ summary: 'Get comprehensive local laws for a country' })
  @ApiParam({ name: 'country', example: 'TH' })
  @ApiResponse({ status: 200, description: 'Comprehensive local laws and regulations' })
  getLocalLaws(@Param('country') country: string) {
    return this.travelKitService.getLocalLaws(country);
  }

  @Get('local-laws')
  @ApiOperation({ summary: 'Local laws summary (legacy endpoint)' })
  @ApiQuery({ name: 'country', required: true, example: 'TH' })
  @ApiResponse({ status: 200, description: 'Local laws summary' })
  getLocalLawsLegacy(@Query('country') country: string) {
    return this.travelKitService.getLocalLaws(country);
  }

  @Get('driving/:country')
  @ApiOperation({ summary: 'Get driving rules for a country' })
  @ApiParam({ name: 'country', example: 'JP' })
  @ApiResponse({ status: 200, description: 'Driving rules including side, license requirements, speed limits' })
  getDrivingRules(@Param('country') country: string) {
    return this.travelKitService.getDrivingRules(country);
  }

  @Get('esim')
  @ApiOperation({ summary: 'eSIM options for a country' })
  @ApiQuery({ name: 'country', required: true, example: 'JP' })
  @ApiResponse({ status: 200, description: 'eSIM options' })
  async getESIM(@Query('country') country: string) {
    return this.travelKitService.getEsimOptions(country);
  }

  @Get('jet-lag')
  @ApiOperation({ summary: 'Jet lag estimate and recovery tips' })
  @ApiQuery({ name: 'from', required: true, example: 'Asia/Kolkata' })
  @ApiQuery({ name: 'to', required: true, example: 'America/New_York' })
  @ApiResponse({ status: 200, description: 'Jet lag estimate with recovery tips' })
  getJetLag(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.travelKitService.getJetLagEstimate(from, to);
  }

  @Get('sunrise-sunset')
  @ApiOperation({ summary: 'Get sunrise and sunset times' })
  @ApiQuery({ name: 'lat', required: true, type: Number, example: 28.6139 })
  @ApiQuery({ name: 'lng', required: true, type: Number, example: 77.209 })
  @ApiQuery({ name: 'date', required: true, example: '2026-03-15' })
  @ApiResponse({ status: 200, description: 'Sunrise, sunset, and golden hour times' })
  getSunriseSunset(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('date') date: string,
  ) {
    return this.travelKitService.getSunriseSunset(
      parseFloat(lat),
      parseFloat(lng),
      date,
    );
  }

  @Get('all/:country')
  @ApiOperation({ summary: 'Get ALL travel kit info for a country in one call' })
  @ApiParam({ name: 'country', example: 'JP' })
  @ApiQuery({ name: 'passport', required: false, example: 'IN', description: 'Your passport country for visa info' })
  @ApiResponse({ status: 200, description: 'Complete travel kit: visa, plug, timezone, laws, currency, emergency numbers' })
  async getAllForCountry(
    @Param('country') country: string,
    @Query('passport') passport?: string,
  ) {
    return this.travelKitService.getAllForCountry(country, passport);
  }
}
